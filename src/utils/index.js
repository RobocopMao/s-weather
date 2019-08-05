import Taro, { useEffect, DependencyList } from '@tarojs/taro'
import windGrade from '../assets/json/wind_grade.json'

export function useAsyncEffect (effect, deps = DependencyList) {
  useEffect(() => {
    effect()
  }, deps)
}

/*
 * 获取单个node的 rect
 */
export const getNodeRect = (selector) => {
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery().select(selector).boundingClientRect(function(rect) {
      // console.log(rect);
      resolve(rect);
    }).exec();
  });
};

// 获取系统信息
export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    Taro.getSystemInfo({
      success: res => {
        resolve(res);
      }
    });
  });
};

// 获取风里等级参数
export const getWindParams = (windSpeed) => {
  let speed = windSpeed * 1000 / 3600; // km/h换算成m/s
  return windGrade.find((v, i, ) => {
    return speed >= v.min && speed <=v.max;
  });
};
