import {
  // SET_LNG,
  // SET_LAT,
  SET_LAT_AND_LON,
  SET_PROVINCE,
  SET_CITY,
  SET_DISTRICT,
  SET_STREET_NUM,
  SET_ADDR,
  SET_NAME,
  SET_IS_DAY
} from './constant'

// export const setLat = (latitude) => {
//   return {
//     type: SET_LAT,
//     latitude
//   }
// };
//
// export const setLng = (longitude) => {
//   return {
//     type: SET_LNG,
//     longitude
//   }
// };

export const setLatAndLon = (latAndLon) => {
  return {
    type: SET_LAT_AND_LON,
    latAndLon
  }
};

export const setProvince = (province) => {
  return {
    type: SET_PROVINCE,
    province
  }
};

export const setCity = (city) => {
  return {
    type: SET_CITY,
    city
  }
};

export const setDistrict = (district) => {
  return {
    type: SET_DISTRICT,
    district
  }
};

export const setStreetNum = (streetNum) => {
  return {
    type: SET_STREET_NUM,
    streetNum
  }
};

export const setAddress = (address) => {
  return {
    type: SET_ADDR,
    address
  }
};

export const setName = (name) => {
  return {
    type: SET_NAME,
    name
  }
};

export const setIsDay = (isDay) => {
  return {
    type: SET_IS_DAY,
    isDay
  }
};
