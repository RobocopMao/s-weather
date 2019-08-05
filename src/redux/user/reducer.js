import {SET_SYSTEM_INFO, SET_USER_LOCATION, SET_USER_IS_CUR_ADDR, SET_USER_GEO_SUN, SET_USER_LIFT_SUGGESTION} from './constant'

const INITIAL_STATE = {
  systemInfo: {},
  location: {},  // 用户自己初始化定位的位置信息,
  isCurrentAddr: true, // 判断用户的位置信息是否是用于当前展示
  geoSun: null,
  lifeSuggestion: null
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SYSTEM_INFO:
      return {
        ...state,
        systemInfo: Object.assign({}, state.systemInfo, action.systemInfo)
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        location: Object.assign({}, state.location, action.location)
      };
    case SET_USER_IS_CUR_ADDR:
      return {
        ...state,
        isCurrentAddr: action.isCurrentAddr
      };
    case SET_USER_GEO_SUN:
      return {
        ...state,
        geoSun: Object.assign({}, state.geoSun, action.geoSun)
      };
    case SET_USER_LIFT_SUGGESTION:
      return {
        ...state,
        lifeSuggestion: Object.assign({}, state.lifeSuggestion, action.lifeSuggestion)
      };
    default:
      return state
  }
}
