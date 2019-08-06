// 空气类
import Request from './request';
import {XZ_HOST_TYPE} from './config';

const request = new Request();

// 空气质量实况
export const getAirNow = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/air/now.json',
    data,
    hostType: XZ_HOST_TYPE
  });
};
