const fetch = require('isomorphic-fetch');
const FormData = require('form-data');

'use strict';

module.exports.getCinemas = async (event, context, callback) => {
  console.log(event.queryStringParameters);
};

module.exports.getScreens = async (event, context, callback) => {
  // TODO(재연): event.queryStringParameters를 이용해서 cinemaId와 playDate 조작
  const formData = new FormData();
  formData.append('paramList', JSON.stringify({
    "MethodName":"GetPlaySequence",
    "channelType":"HO",
    "osType":"Firefox",
    "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
    "playDate":"2018-06-24",
    "cinemaID":"1|0001|1007,1|0001|1013", //NOTE(재연): UI상으로는 2개까지 제한이지만 API로는 무제한
    "representationMovieCode":""
  }));

  fetch(
    '//www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
    {
      method: 'POST',
      body: formData,
    }
  ).then(
    response => response.json()
  ).then(result => {
    console.log(result);
    if (result.IsOK !== 'true') {
      throw new Error(JSON.stringify(result));
    }
    console.log(result.PlaySeqs);
    console.log(result.PlaySeqsHeader);
  }).catch(e => {
    console.error("Error on getScreens", e);
  })
};
