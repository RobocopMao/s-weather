import {SET_PROVINCE, SET_CITY, SET_DISTRICT, SET_LAT, SET_LNG, SET_STREET_NUM, SET_ADDR, SET_NAME} from './constant'

const INITIAL_STATE = {
  longitude: '',
  latitude: '',
  province: '',
  city: '',
  district: '',
  streetNum: '',
  address: '',
  name: '' // 用于显示最小的位置，比如小区的名称字
};

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_LAT:
      return {
        ...state,
        latitude: action.latitude
      };
    case SET_LNG:
      return {
        ...state,
        longitude: action.longitude
      };
    case SET_PROVINCE:
      return {
        ...state,
        city: action.province
      };
    case SET_CITY:
      return {
        ...state,
        city: action.city
      };
    case SET_DISTRICT:
      return {
        ...state,
        district: action.district
      };
    case SET_STREET_NUM:
      return {
        ...state,
        streetNum: action.streetNum
      };
    case SET_ADDR:
      return {
        ...state,
        address: action.address
      };
    case SET_NAME:
      return {
        ...state,
        name: action.name
      };
    default:
       return state
  }
}
