import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import ServiceUtils from '../utils/ServiceUtils';

const axiosConfig = {
  timeout: 5000,
  responseType: 'json',
  proxy: {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_PORT,
  },
};

export default class LotteCinemaService {
  static async getCinemas() {
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

    const data = await axios
      .post(
        'http://www.lottecinema.co.kr/LCWS/Ticketing/TicketingData.aspx',
        formData,
        _.extend({}, axiosConfig, { headers: formData.getHeaders() })
      )
      .then(response =>
        _.isString(response.data) ? JSON.parse(response.data) : response.data
      )
      .then(ServiceUtils.toCamelCaseKeys);

    if (data.isOk !== 'true') {
      throw new Error(JSON.stringify(data));
    }

    const DIVISION_CODES = [
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

    return _.map(data.cinemas.cinemas.items, cinema =>
      _.assign(
        {},
        _.pick(cinema, ['divisionCode', 'detailDivisionCode', 'cinemaId']),
        {
          regionName: DIVISION_CODES[_.toInteger(cinema.detailDivisionCode)],
          cinemaName: cinema.cinemaNameKr,
        }
      )
    );
  }

  static getScreens(alarmDate, cinemaIds) {
    const formData = new FormData();
    formData.append(
      'paramList',
      JSON.stringify({
        MethodName: 'GetPlaySequence',
        channelType: 'HO',
        osType: 'Firefox',
        osVersion:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0',
        playDate: alarmDate,
        cinemaID: cinemaIds,
        representationMovieCode: '',
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

        return data.playSeqs.items.map(item =>
          _.pick(item, [
            'screenDivisionNameKr',
            'filmNameKr',
            'screenNameKr',
            'viewGradeNameKr',
            'playSequence',
            'screenId',
            'movieCode',
            'startTime',
            'endTime',
            'totalSeatCount',
            'bookingSeatCount',
          ])
        );
      });
  }

  static getSeats(screensJSON) {
    const screens = JSON.parse(screensJSON);
    const seats = [];

    const func2 = (index = 0) => {
      const {cinemaId, screenId, alarmDate} = screens[index];

      return func(cinemaId, screenId, alarmDate).then((result) => {
        seats.push(result);
        if(index < screens.length) {
          return func2(index+1);
        }

        return Promise.resolve(seats);
      });
    }

    const func = (cinemaId, screenId, playDate) => {
      const formData = new FormData();
      formData.append(
        'paramList',
        JSON.stringify({
          MethodName: 'GetSeats',
          channelType: 'HO',
          osType: 'Firefox',
          osVersion:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0',
          cinemaId,
          screenId,
          playDate,
          playSequence: 1,
          representationMovieCode: '100',
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

        return data.seats.items.map(item =>
          _.pick(item, [
            'seatNo',
            'seatXCoordinate',
            'seatYCoordinate',
            'seatXLength',
            'seatYLength',
          ])
        );
      });
    }

    return func2();
  }

  static getMovie(movieCode) {
    const formData = new FormData();
    formData.append(
      'paramList',
      JSON.stringify({
        MethodName: 'GetMovieDetail',
        channelType: 'HO',
        osType: 'Firefox',
        osVersion:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0',
        multiLanguageID: 'EN',
        representationMovieCode: `${movieCode}`,
      })
    );

    return axios
      .post(
        'http://www.lottecinema.co.kr/LCWS/Movie/MovieData.aspx',
        formData,
        _.extend({}, axiosConfig, { headers: formData.getHeaders() })
      )
      .then(response => response.data)
      .then(ServiceUtils.toCamelCaseKeys)
      .then(data => {
        if (data.isOk !== 'true') {
          throw new Error(JSON.stringify(data));
        }
        return _.pick(data.movie, ['movieNameKr', 'posterUrl']);
      });
  }
}
