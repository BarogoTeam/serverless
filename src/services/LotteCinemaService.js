import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import ServiceUtils from '../utils/ServiceUtils';

require('dotenv').config();

const axiosConfig = {
  timeout: 1000,
  // proxy: {
  //   host: process.env.PROXY_HOST,
  //   port: process.env.PROXY_PORT,
  // },
};

export default class LotteCinemaService {
  static getCinemas() {
    const formData = new FormData();
    formData.append(
      'paramList',
      JSON.stringify({
        MethodName: 'GetTicketingPage',
        channelType: 'HO',
        osType: 'Chrome',
        osVersion:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        memberOnNo: '0',
      })
    );

    return axios
      .post(
        'http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
        formData,
        _.extend({}, axiosConfig, { headers: formData.getHeaders() })
      )
      .then(response => response.data)
      .then(ServiceUtils.toCamelCaseKeys)
      .then(data => {
        if (data.isOk !== 'true') {
          throw new Error(JSON.stringify(data));
        }
        const DivisonCode = [
          '',
          '서울',
          '경기/인천',
          '충청/대전',
          '전라/광주',
          '경북/대구',
          '경남/부산/울산',
          '강원',
          '제주',
        ];
        const CinemasArray = [];
        const parserData = data.cinemas.cinemas.items;

        // TODO(재연): 밑에 코드 eslint 조건에 맞게 수정 필요
        /* eslint-disable */
        for (const c in data.cinemas.cinemas.items) {
          const newCinemas = {
            divisionCode: parserData[c].divisionCode,
            detailDivisionCode: parserData[c].detailDivisionCode,
            cinemaid: parserData[c].cinemaId,
            regionName: DivisonCode[parserData[c].detailDivisionCode * 1],
            cinemaName: parserData[c].cinemaNameKr,
          };
          CinemasArray.push(newCinemas);
        }
        return CinemasArray;
      });
  }

  static getScreens(alarmDate, cinemaIds) {
    const formData = new FormData();
    formData.append('paramList', JSON.stringify({
      "MethodName":"GetPlaySequence",
      "channelType":"HO",
      "osType":"Firefox",
      "osVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0",
      "playDate":alarmDate,
      "cinemaID":cinemaIds, //NOTE(재연): UI상으로는 2개까지 제한이지만 API로는 무제한
      "representationMovieCode":""
    }));

    return axios.post('http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx', formData, _.extend({}, axiosConfig, { headers: formData.getHeaders() }))
      .then(response => response.data)
      .then(ServiceUtils.toCamelCaseKeys)
      .then(data => {
        if (data.isOk !== 'true') {
          throw new Error(JSON.stringify(data));
        }

        return data.playSeqs.items.map(
          item => _.pick(
            item,
            ['screenId','movieCode','startTime','endTime','totalSeatCount','bookingSeatCount']
          )
        )
    })
  }
}