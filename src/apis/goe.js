// 地理类
import Request from './request';
import {XZ_HOST_TYPE} from './config';

const request = new Request();

// 日出日落
export const getGeoSun = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/geo/sun.json',
    data,
    hostType: XZ_HOST_TYPE
  });
};
