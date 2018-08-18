const axios = require('axios');
const FormData = require('form-data');
const _ = require('lodash');

require('dotenv').config()

'use strict';

const axiosConfig = {
  timeout: 1000,
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_PORT,
  },
};

module.exports.getCinemas = (event, context, callback) => {
  const formData = new FormData();
  formData.append('paramList', JSON.stringify({
    "MethodName":"GetTicketingPage",
    "channelType":"HO",
    "osType":"Firefox",
    "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
    "memberOnNo":""
  }));
  axios.post('http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx', formData, axiosConfig).then(response => {
    return response.data
  }).then(result => {
    if (result.IsOK !== 'true') {
      throw new Error(JSON.stringify(result));
    }
    var DivisonCode = new Array('','서울','경기/인천','충청/대전','전라/광주','경북/대구','경남/부산/울산','강원','제주');
    var CinemasArray = new Array();
    var parserData = result.Cinemas.Cinemas.Items;
    for(var c in result.Cinemas.Cinemas.Items){
      var newCinemas = {
        "divisionCode" : parserData[c].DivisionCode,
        "detailDivisionCode" : parserData[c].DetailDivisionCode,
        "cinemaid" : parserData[c].CinemaID,
        "regionName" : DivisonCode[parserData[c].DetailDivisionCode*1],
        "cinemaName" : parserData[c].CinemaNameKR
      }
      CinemasArray.push(newCinemas)
    }

    return CinemasArray;
  }).then(body =>
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
    })
  ).catch(e => {
    callback(null, {
      statusCode: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(e.message),
    })
  })
};

module.exports.getScreens = (event, context, callback) => {
  // TODO(재연): event.queryStringParameters를 이용해서 cinemaId와 playDate 조작
  const formData = new FormData();
  formData.append('paramList', JSON.stringify({
    "MethodName":"GetPlaySequence",
    "channelType":"HO",
    "osType":"Firefox",
    "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
    "playDate":event.queryStringParameters.alarmDate,
    "cinemaID":event.queryStringParameters.cinemaIds, //NOTE(재연): UI상으로는 2개까지 제한이지만 API로는 무제한
    "representationMovieCode":""
  }));

  fetch(
    'http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    {
      method: 'POST',
      body: formData,
    }
  ).then(response => {
    return response.json()
  }).then(result => {
    if (result.IsOK !== 'true') {
      throw new Error(JSON.stringify(result));
    }

    // TODO(재연): 데이터 정제 로직 필요
    // _.pick(result,)
    return result.PlaySeqs.Items.map(
        item => _.mapKeys(_.pick(
          item,
          ['ScreenID','MovieCode','StartTime','EndTime','TotalSeatCount','BookingSeatCount']
        ), (value, key) => _.camelCase(key))
      )
  }).then(body =>
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(body),
    })
  ).catch(e => {
    console.error("Error on getScreens", JSON.stringify(e));
    callback(null, {
      statusCode: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(e),
    })
  })
};
