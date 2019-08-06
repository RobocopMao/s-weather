/**封装的网络请求**/
import Taro from '@tarojs/taro';
import {XZ_API_HOST, HF_API_HOST_FREE, createSignParams} from './config';

class Request {
  get(options) {
    if (typeof options !== 'object') {
      return;
    }
    options.method = 'GET';
    return this.requestEvent(options);
  }

  post(options) {
    if (typeof options !== 'object') {
      return;
    }
    options.method = 'POST';
    return this.requestEvent(options);
  }

  requestEvent(options) {
      if (!options) {
      return;
    }
    // console.log(options)
    let sign = options.hostType === 'XZ' ? createSignParams(options.hostType) : createSignParams(options.hostType, options.data);  // 心知天气获取签名参数/和风天气的签名参数
    let url = `${options.host || (options.hostType === 'XZ' ? XZ_API_HOST : HF_API_HOST_FREE)}${options.url}`;  // 判断url来源
    let data = Object.assign({}, options.data, sign) || {};
    let method = options.method || 'GET';
    let dataType = 'json';
    let header = {};
    let loading = typeof options.loading === 'undefined' ? false : options.loading;  // 默认不显示loading
    let needCode = typeof options.needCode !== 'undefined' ? options.needCode : false;
    // let header = {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'};
    if (method === 'GET') {
      header = {
        'content-type': 'application/json;charset=UTF-8', // 默认值
      }
    } else if (method === 'POST') {
      header = {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    }
    let params = {
      url,
      data,
      header,
      method,
      dataType,
    };
    // console.log(params)
    if (loading) {
      Taro.showLoading({title: '加载中...', mask: true});
    }

    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV !== 'production')  {
        Taro.addInterceptor(Taro.interceptors.logInterceptor);
        Taro.addInterceptor(Taro.interceptors.timeoutInterceptor);
      }
      Taro.request({
        ...params,
        success: res => {
          if (needCode) { // 需要返回code
            resolve(res.data);
          } else {
            let {statusCode, data} = res;
            if (statusCode === 200) {
              if (options.hostType === 'XZ') {  // 心知天气返回数据
                resolve(data.results[0]);
              } else {  // 和风天气返回数据
                resolve(data.HeWeather6[0]);
              }
            } else {
              if (options.hostType === 'XZ') {  // 心知天气请求错误状态提示
                Taro.showToast({title: `${statusCode}[${data.status_code}]: ${data.status}`, icon: 'none'});
              } else {// 和风天气请求错误状态提示
                Taro.showToast({title: `${statusCode}: ${data.status}`, icon: 'none'});
              }
            }
          }
        },
        fail: res => {
          console.log(res);
          Taro.showToast({title: '请求失败', icon: 'none'});
        },
        complete: res => {
          if (loading) {
            Taro.hideLoading();
          }
        }
      })
    })
  };
}

export default Request;
