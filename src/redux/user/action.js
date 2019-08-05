import {SET_SYSTEM_INFO, SET_USER_LOCATION, SET_USER_IS_CUR_ADDR, SET_USER_GEO_SUN, SET_USER_LIFT_SUGGESTION} from './constant'

export const setSystemInfo = (systemInfo) => {
  return {
    type: SET_SYSTEM_INFO,
    systemInfo
  }
};

export const setUserLocation = (location) => {
  return {
    type: SET_USER_LOCATION,
    location
  }
};

export const setUserIsCurAddr = (isCurrentAddr) => {
  return {
    type: SET_USER_IS_CUR_ADDR,
    isCurrentAddr
  }
};

export const setUserGeoSun = (geoSun) => {
  return {
    type: SET_USER_GEO_SUN,
    geoSun
  }
};

export const setUserLifeSuggestion = (lifeSuggestion) => {
  return {
    type: SET_USER_LIFT_SUGGESTION,
    lifeSuggestion
  }
};


