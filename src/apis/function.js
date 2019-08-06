// 功能类
import Request from './request';
import {HF_HOST_TYPE, HF_API_HOST_SEARCH} from './config';

const request = new Request();

// 获取热门城市
export const getTopCity = async (data) => {
  return await request.get({
    host: HF_API_HOST_SEARCH,
    url: '/top',
    data,
    hostType: HF_HOST_TYPE
  });
};

// 获取热门城市
export const findCity = async (data) => {
  return await request.get({
    host: HF_API_HOST_SEARCH,
    url: '/find',
    data,
    hostType: HF_HOST_TYPE
  });
};
