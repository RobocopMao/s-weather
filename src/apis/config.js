import Taro from '@tarojs/taro'
import moment from 'moment'
import HmacSHA1 from 'crypto-js/hmac-sha1'
import Base64 from 'crypto-js/enc-base64'

// export const HOST = 'https://www.mxnzp.com';
export const HOST = 'https://api.seniverse.com';

// export const HFKEY = '4c2fbe62b94b430281c7244b8cb1da41';  // 和风天气的key
// export const CONDICONHOST = 'https://cdn.heweather.com';

// 腾讯地图key
export const QQ_MAP_SDK_KEY = '';

// 生成签名参数
export const createSignParams = () => {
  const PUBLIC_KEY = '';
  const PRIVATE_KEY = '';
  const ts = moment().unix();
  const ttl = 600;
  const signStr = `ts=${ts}&ttl=${ttl}&uid=${PUBLIC_KEY}`;
  const hmacSHA1 = HmacSHA1(signStr, PRIVATE_KEY).toString(Base64);
  // console.log("hmacSHA1 = %s", hmacSHA1);
  const sig = encodeURI(hmacSHA1);
  // console.log(sig);
  return {ts, ttl, uid: PUBLIC_KEY, sig}
};
