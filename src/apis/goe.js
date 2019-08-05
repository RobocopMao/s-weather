import Request from './request';

const request = new Request();

// 日出日落
export const getGeoSun = async (data) => {
  if (data.location === ':' || data.location === '') {
    return;
  }
  return await request.get({
    url: '/v3/geo/sun.json',
    data,
  });
};
