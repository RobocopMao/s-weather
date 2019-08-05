import Request from './request';

const request = new Request();

// 空气质量实况
export const getAirNow = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/air/now.json',
    data,
  });
};
