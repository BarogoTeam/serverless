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

module.exports = {
  getCinemas: () => {
    const formData = new FormData();
    formData.append('paramList', JSON.stringify({
      "MethodName":"GetTicketingPage",
      "channelType":"HO",
      "osType":"Chrome",
      "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      "memberOnNo":"0"
    }));

    return axios.post('http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx', formData, _.extend({}, axiosConfig, { headers: formData.getHeaders() })).then(response => {
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
    });
  }
};