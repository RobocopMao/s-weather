// 天气类
import Request from './request';
import {XZ_HOST_TYPE, HF_HOST_TYPE} from './config';

const request = new Request();

// 天气实况
export const getWeatherNow = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/weather/now.json',
    data,
    hostType: XZ_HOST_TYPE
  });
};

// 24小时逐小时天气预报
export const getWeatherHourly = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/weather/hourly.json',
    data,
    hostType: XZ_HOST_TYPE,
  });
};

// 逐日天气
export const getWeatherDaily = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/weather/daily.json',
    data,
    hostType: XZ_HOST_TYPE,
  });
};

// 以下是和风天气的api
/**
 * 获取常规天气数据: https://dev.heweather.com/docs/api/weather
 * @param weatherType: now/forecast/hourly/lifestyle
 * @param params
 * @returns {Promise<void>}
 */
export const getHFWeatherNow = async ({weatherType, params}) => {
  if (params.location === ',' || params.location === '') {
    return false;
  }
  return await request.get({
    host: 'https://free-api.heweather.net',
    url: '/s6/weather/' + weatherType,
    data: params,
    hostType: HF_HOST_TYPE,
  });
};
//
// /**
//  * 获取空气质量：https://dev.heweather.com/docs/api/air
//  * @param weatherType：now/forecast/hourly
//  * @param params
//  * @returns {Promise<void>}
//  */
// export const getAirQuality = async ({airType, params}) => {
//   if (params.reducer === ',') {
//     return false;
//   }
//   return await request.get({
//     host: 'https://free-api.heweather.net',
//     url: '/s6/air/' + airType,
//     data: params,
//     needCode: true,
//   });
// };
