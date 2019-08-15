// 功能类
import Request from './request';
import {HF_HOST_TYPE, HF_API_HOST_SEARCH, XZ_HOST_TYPE} from './config';

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

// 天气聊天机器人
export const getRobotTalk = async (data) => {
  return await request.get({
    url: '/v3/robot/talk.json',
    data,
    hostType: XZ_HOST_TYPE
  });
};
