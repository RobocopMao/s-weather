import Taro from '@tarojs/taro'
import moment from 'moment'
import HmacSHA1 from 'crypto-js/hmac-sha1'
// import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
// import Utf8 from 'crypto-js/enc-utf8'
// import forEach from 'lodash/each'

// 腾讯地图key
export const QQ_MAP_SDK_KEY = '';

// 和风天气接口标识
export const HF_HOST_TYPE = 'HF';
// 心知天气接口标识
export const XZ_HOST_TYPE = 'XZ';

// 和风天气接口请求地址
export const HF_API_HOST_FREE = 'https://free-api.heweather.net'; // 天气等
export const HF_API_HOST_SEARCH = 'https://search.heweather.net'; // 热门城市,城市搜索专用
// 心知天气接口请求地址
export const XZ_API_HOST = 'https://api.seniverse.com';

// 签名算法
export const createSignParams = (hostType, params) => {
  const ts = moment().unix();
  if (hostType === 'XZ') { // 心知天气生成签名参数 HMAC-SHA1
    const XZ_API_KEY_PUBLIC = '';
    const XZ_API_KEY_PRIVATE = '';
    const ttl = 600;
    const signStr = `ts=${ts}&ttl=${ttl}&uid=${XZ_API_KEY_PUBLIC}`;
    const hmacSHA1 = HmacSHA1(signStr, XZ_API_KEY_PRIVATE).toString(Base64);
    // console.log("hmacSHA1 = %s", hmacSHA1);
    const sig = encodeURI(hmacSHA1);
    // console.log(sig);
    return {ts, ttl, uid: XZ_API_KEY_PUBLIC, sig}
  } else { // 和风天气生成签名参数 MD5
    const HF_API_KEY = '';
    // const HF_USERNAME = '';
    // let paramsStr = '';
    // forEach(params, (v, k) => {
    //   if (v !== '') {
    //     paramsStr += `&${k}=${v}`;
    //   }
    // });
    // const signStr = `${paramsStr}${HF_API_KEY}`.slice(1);
    // // const signStr = `t=${ts}&username=${HF_USERNAME}${HF_API_KEY}`;
    // console.log(signStr);
    // const signUtf8 = MD5(signStr).toString();
    // // console.log(MD5(signStr));
    // console.log(signUtf8);
    // const signBase64 = Utf8.parse(signUtf8).toString(Base64);
    // console.log(signBase64);
    // const sign = signBase64;
    // console.log(sign);
    // return {username: HF_USERNAME, t: ts, sign};
    return {key: HF_API_KEY};
  }

};
