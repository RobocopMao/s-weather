// 生活类
import Request from './request';
import {XZ_HOST_TYPE} from './config';

const request = new Request();

// 生活指数
export const getLifeSuggestion = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/life/suggestion.json',
    data,
    hostType: XZ_HOST_TYPE
  });
};
