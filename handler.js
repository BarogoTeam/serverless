const fetch = require('fetch-with-proxy').default;
const FormData = require('form-data');
const _ = require('lodash');

'use strict';

module.exports.getCinemas = (event, context, callback) => {
  const formData = new FormData();
  formData.append('paramList', JSON.stringify({
    "MethodName":"GetTicketingPage",
    "channelType":"HO",
    "osType":"Firefox",
    "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
    "memberOnNo":""
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
    console.log('Cinemas data');
    console.log(CinemasArray);

    return CinemasArray;
  }).then(body =>
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(body),
    })
  ).catch(e => {
    console.error("Error on getCinemas", e);
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
    "playDate":"2018-07-18",
    "cinemaID":"1|0001|1007,1|0001|1013", //NOTE(재연): UI상으로는 2개까지 제한이지만 API로는 무제한
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
      body: JSON.stringify(body),
    })
  ).catch(e => {
    console.error("Error on getScreens", e);
  })
};
