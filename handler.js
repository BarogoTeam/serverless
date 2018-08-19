'use strict';

const axios = require('axios');
const FormData = require('form-data');
const _ = require('lodash');

const LotteCinemaService = require('./services/LotteCinemaService');

const axiosConfig = {
  timeout: 1000,
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_PORT,
  },
};

module.exports.getCinemas = (event, context, callback) => {
  LotteCinemaService.getCinemas().then(body =>
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

  axios.post('http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx', formData, _.extend({}, axiosConfig, { headers: formData.getHeaders() })).then(response => {
    return response.json()
  }).then(result => {
    if (result.IsOK !== 'true') {
      throw new Error(JSON.stringify(result));
    }

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
