import Taro, {useEffect, useState} from '@tarojs/taro'
import {Block, View, Text, ScrollView, Canvas, Image, Swiper, SwiperItem, Button} from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import moment from 'moment'
import max from 'lodash/max'
import min from 'lodash/min'
import debounce from 'lodash/debounce'
import QQMapWX from '../../../utils/qqmap-wx-jssdk'
import {QQ_MAP_SDK_KEY} from '../../../apis/config'
import './index.scss'
import {useAsyncEffect, getNodeRect, getSystemInfo, getWindParams} from '../../../utils'
import {getWeatherNow, getWeatherHourly, getWeatherDaily} from '../../../apis/weather'
import {getAirNow} from '../../../apis/air'
import {getLifeSuggestion} from '../../../apis/life'
import {getGeoSun} from '../../../apis/goe'
import {
  setLng,
  setLat,
  setProvince,
  setCity,
  setDistrict,
  setStreetNum,
  setAddress,
  setName
} from '../../../redux/location/action'
import {
  setSystemInfo,
  setUserLocation,
  setUserIsCurAddr,
  setUserGeoSun,
  setUserLifeSuggestion
} from '../../../redux/user/action'
import ComponentBaseNavigation from '../../../components/base/navigation'
import ComponentIconWindDirection from '../../../components/icon/wind_dir'
import ComponentIconWeather from '../../../components/icon/weather'
// import ComponentTagName from '../../components/common/component_tag_name'
import Skeleton from '../../../components/common/skeleton'
import xzLogoGrayImg from '../../../assets/images/xinzhi_logo_gray.png';

function Index() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [now, setNow] = useState({});
  const [updateTime, setUpdateTime] = useState('');
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [nowAir, setNowAir] = useState({});
  const [sun, setSun] = useState([]);
  const [isDay, setIsDay] = useState(true);
  const [bgPageClass, setBgPageClass] = useState('');
  const [bgItemClass, setBgItemClass] = useState('');
  const [navBarBgColor, setNavBarBgColor] = useState('#FFFFFF');
  const [tmpLineImgPath, setTmpLineImgPath] = useState('');
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const lifeSuggestion = [
    {type: 'comfort', name: '舒适度指数'},
    {type: 'dressing', name: '穿衣指数'},
    {type: 'flu', name: '感冒指数'},
    {type: 'sport', name: '运动指数'},
    {type: 'travel', name:'旅游指数'},
    {type: 'car_washing', name:'洗车指数'},
    // {type: 'allergy', name: '过敏指数'},
    {type: 'uv', name: '紫外线指数'},
    {type: 'air_pollution', name:'空气污染扩散条件指数'}
  ];

  // 隐藏骨架屏
  useEffect(() => {
    let tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, 3000);
  }, []);

  // 实时天气
  useAsyncEffect(async () => {
    const res = await getWeatherNow({location: `${location.latitude}:${location.longitude}`});
    // console.log(res);
    if (!res) {return}
    const {now, last_update} = res;
    setNow(now);
    setUpdateTime(last_update);
  }, [location]);

  // 空气质量
  useAsyncEffect(async () => {
    const res = await getAirNow({location: `${location.latitude}:${location.longitude}`});
    // console.log(res);
    if (!res) {return}
    const {air} = res;
    setNowAir(air);
  }, [location]);

  // 逐小时预报
  useAsyncEffect(async () => {
    const res = await getWeatherHourly({location: `${location.latitude}:${location.longitude}`});
    // console.log(res);
    if (!res) {return}
    const {hourly} = res;
    setHourly(hourly);
  }, [location]);

  // 3日预报
  useAsyncEffect(async () => {
    const res = await getWeatherDaily({location: `${location.latitude}:${location.longitude}`, days: 3});
    // console.log(res);
    if (!res) {return}
    const {daily} = res;
    setDaily(daily);
  }, [location]);

  // 生活指数
  useAsyncEffect(async () => {
    const {from} = this.$router.params;
    if (user.isCurrentAddr && user.lifeSuggestion && from !== 'SHARE') { // 当前用户，且生活指数已存在， 比如当用户点击当行定位按钮就不会在此发请求
      setSuggestion(user.lifeSuggestion);
    } else {
      const res = await getLifeSuggestion({location: `${location.city}`});
      // console.log(res);
      if (!res) {return}
      const {suggestion} = res;
      setSuggestion(suggestion);
      dispatch(setUserLifeSuggestion(suggestion));
    }
  }, [location]);


  // 日出日落
  useAsyncEffect(async () => {
    const {from} = this.$router.params;
    if (user.isCurrentAddr && user.geoSun && from !== 'SHARE') { // 当前用户，且日出日落已存在， 比如当用户点击当行定位按钮就不会在此发请求
      setSun(user.geoSun);
    } else { // 否则就去请求
      const res = await getGeoSun({location: `${location.latitude}:${location.longitude}`, days: 1});
      if (!res) {return}
      const {sun} = res;
      setSun(sun);
      setDayNight(sun[0]);
      dispatch(setUserGeoSun(sun[0]));
    }
  }, [location]);

  // 设备信息
  useEffect(async () => {
    const res = await getSystemInfo();
    dispatch(setSystemInfo(res));
    const res1 = await getNodeRect('#tabBar');
    setScrollHeight(res.windowHeight - res1.height - 44 - user.systemInfo.statusBarHeight);  // 自定义导航固定44
  }, [scrollHeight]);

  // 画逐小时图
  useEffect(() => {
    drawTmpLine();
  }, [hourly]);

  // 授权获取用户位置信息
  useAsyncEffect(() => {
    Taro.getSetting({ // 获取设置
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({ // 地理位置授权
            scope: 'scope.userLocation',
            success() {
              getUserLocation();
            },
            fail() {
              Taro.showToast({title: '地理位置授权失败，请在设置里面开启', icon: 'none'});
            }
          })
        } else {
          getUserLocation();
        }
      }
    })
  }, []);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
    onShareAppMessage();
  }, [now]);

  // 设置日出日落
  const setDayNight = (sun) => {
    let {date, sunrise, sunset} = sun;
    let sr = `${date} ${sunrise}`;
    let ss= `${date} ${sunset}`;

    let isDay = moment().isAfter(sr) && moment().isBefore(ss); // 判断是不是在白天
    // console.log(moment().isAfter(sr), moment().isBefore(ss));
    setIsDay(isDay);
    setBgPageClass(isDay ? 'weather-day' : 'weather-night');
    setBgItemClass(isDay ? 'bg-blue-opacity' : 'bg-black-opacity');
    setNavBarBgColor(isDay ? '#2962FF' : '#000000');

    if (isDay) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2962FF',
        animation: {
          duration: 300,
          timingFunc: 'easeInOut'
        }
      });
    } else {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
        animation: {
          duration: 300,
          timingFunc: 'easeInOut'
        }
      });
    }
  };

  // 获取用户位置信息
  const getUserLocation = () => {
    Taro.getLocation({
      success: res => {
        // console.log(res);
        qqMapSetLocation({latitude: res.latitude, longitude: res.longitude, isUser: true});
      },
      fail: res => {
        console.log(res);
        Taro.showToast({title: '获取位置信息失败', icon: 'none'});
      }
    })
      .then();
  };

  // qqmapsdk根据经纬度查询位置信息
  const qqMapSetLocation = ({latitude, longitude, isUser, name = ''}) => {
    const qqmapsdk = new QQMapWX({key: QQ_MAP_SDK_KEY});
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (_res) => {
        // console.log(_res);
        const {province, city, district, street_number} = _res.result.address_component;
        dispatch(setLng(longitude));
        dispatch(setLat(latitude));
        dispatch(setProvince(province));
        dispatch(setCity(city));
        dispatch(setDistrict(district));
        dispatch(setStreetNum(street_number));
        dispatch(setAddress(_res.result.address));
        dispatch(setName(name));

        if (isUser) {
          const userLocation = {
            latitude: latitude,
            longitude: longitude,
            province,
            city,
            district,
            streetNum: street_number,
            address: _res.result.address,
            name: ''
          };
          dispatch(setUserLocation(userLocation));
          dispatch(setUserIsCurAddr(true));
        }
      },
      // fail: _res => {
      //   // console.log(_res);
      // },
      // complete: _res => {
      //   // console.log(res);
      // }
    });
  };

  // 去15天天气预报
  const goDailyDetails = () => {
    Taro.navigateTo({url: `../../../pages/forecast/pages/daily_forecast/index?lon=${location.longitude}&lat=${location.latitude}&isDay=${isDay}`});
  };

  // 画逐小时图
  const drawTmpLine = async () => {
    let tmp = [];

    for (let [, v] of hourly.entries()) {
      // console.log(v,i);
      tmp.push(Number(v.temperature));
    }
    let maxTmp = max(tmp) + 3; // 最高温
    let minTmp = min(tmp) - 1; // 最低温
    let tmpRange = maxTmp - minTmp;
    // console.log(tmp, maxTmp, minTmp, tmpRange);
    let distance= Math.floor((100 / tmpRange));
    let nodeRect = await getNodeRect('#tmpLineBox');
    if (!nodeRect) {return}
    let rowWidth = nodeRect.width / hourly.length;
    let ctx = Taro.createCanvasContext('tmpLine', this.$scope);
    // console.log(ctx);
    ctx.save();

    // 画高温线
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineCap('round');
    for (let [i, v] of tmp.entries()) {
      let drawX = i * rowWidth + (rowWidth / 2);
      let drawY = (maxTmp - v) * distance;
      // console.log(drawX, drawY);
      if (i === 0){
        ctx.moveTo(drawX, drawY);
        ctx.setFontSize(12);
        ctx.fillStyle ='#ffffff';
        ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
      } else {
        ctx.lineTo(drawX, drawY);
        ctx.fillStyle ='#ffffff';
        ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
      }
    }
    ctx.stroke();

    ctx.draw(false, () => {
      canvasToImg();
    });
  };

  // canvas 换图片，因为canvas层级高，自定义导航栏遮不住
  const canvasToImg = async () => {
    const canvasNode = await getNodeRect('#tmpLine');
    const {width, height} = canvasNode;
    Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      width,
      height,
      // destWidth: width * pixelRatio * 2,
      // destHeight: height * pixelRatio * 2,
      canvasId: 'tmpLine',
    }).then(res => {
      // console.log(res);
      // console.log('canvasToImg end');
      setTmpLineImgPath(res.tempFilePath);

    }).catch(err => {
      // console.log('canvasToImg err');
      console.log(err);
    })
  };

  // 点击导航栏打开地图，定位当前
  const chooseLocation = () => {
    Taro.chooseLocation({
      success: res => {
        // console.log(res);
        dispatch(setUserIsCurAddr(false));
        const {address, name, longitude, latitude} = res;
        if (name === '') { // 没选地址就点确定
          Taro.showToast({title: '未选择地址', icon: 'none'});
        }
        qqMapSetLocation({latitude, longitude, isUser: false, name});
      }
    })
  };

  // 定位自己
  const locationSelf = () => {
    const {latitude, longitude,} = user.location;
    qqMapSetLocation({latitude, longitude, isUser: true});
  };

  // 分享的事件
  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: `我这儿现在天气${now.text},气温${now.temperature}℃,你那儿呢？`,
        path: `/pages/tab_tar/index/index?from=SHARE`,
      }
    };
  };

  // scroll caontainer 滚动事件
  const onContainerScroll = async (e) => {
    const {scrollTop} = e.detail;
    setScrollTop(scrollTop);
  };

  return (
    <Block>
      {showSkeleton && (
        <Skeleton
          selector='skeleton'
          loading='spin'
          bgcolor='#FFF'
        />
      )}
      <View className='weather h-100-per skeleton'>
        {/*<ComponentTagName />*/}
        <ComponentBaseNavigation backgroundColor={navBarBgColor} color='white' statusBarHeight={user.systemInfo.statusBarHeight}>
          <View className='flex-row flex-start-center w-100-per pd-lr-20' onClick={debounce(chooseLocation, 5000, {leading: true, trailing: false})}>
            <View className='iconfont mg-r-10 fs-36'>&#xe875;</View>
            <View className={`flex-col  ${scrollTop > 200 ? 'flex-spb-start' : 'flex-center-start'}`}>
              {scrollTop > 200 && <View className='flex-row flex-start-baseline white fs-26'>
                <Text>{now.temperature}℃</Text>
                <Text className='mg-l-10'>{now.text}</Text>
              </View>}
              <View className={`flex-row flex-start-baseline ${scrollTop > 200 ? 'fs-26' : 'fs-30'}`}>
                {user.isCurrentAddr && <View className='nav-addr-box'>{user.location.district} {user.location.streetNum}</View>}
                {!user.isCurrentAddr && <View className='nav-addr-box'>{location.name ? location.name : `${location.district} ${location.streetNum}`}</View>}
              </View>
            </View>
          </View>
        </ComponentBaseNavigation>
        <ScrollView
          className={`flex-col relative ${bgPageClass}`}
          scrollY
          scrollWithAnimation
          style={{height: `${scrollHeight}px`}}
          onScroll={e => onContainerScroll(e)}
        >
          <View className='white flex-col flex-center' id='nowContainer'>
            <View className='flex-row flex-center mg-t-40'>
              <View className='fs-100 flex-row'>
                <Text className=''>{now.temperature}</Text>
                <Text className='mg-t-24 fs-28'>℃</Text>
              </View>
              <ComponentIconWeather code={now.code} fontSize='fs-100' />
            </View>
            <View className='mg-20 fs-30'>{now.text}</View>
            <View className='flex-row flex-center mg-b-20'>
              <View className='flex-row flex-center-baseline'>
                <ComponentIconWindDirection windDirection={now.wind_direction} />
                <View className='mg-l-4'>{now.wind_scale}级</View>
              </View>
              <View className='mg-l-10 mg-r-10 h-28 v-line-white' />
              <View className='flex-row flex-center-baseline'>
                <View className='iconfont white mg-r-4 fs-28'>&#xe600;</View>
                <View className=''>湿度 {now.humidity}%</View>
              </View>
              <View className='mg-l-10 mg-r-10 h-28 v-line-white' />
              <View className='flex-row flex-center-baseline'>
                <View className='iconfont white mg-r-4 fs-26'>&#xe68b;</View>
                <View className=''>空气{nowAir.city.quality} {nowAir.city.aqi}</View>
              </View>
            </View>
            <View className='mg-b-40 fs-24'>天气更新于 {moment(updateTime).format('HH:mm')}</View>
          </View>
          {/*{fixedContainerNow && <View style={{height: `${boxNowInitHeight - boxNowSmallHeight}px`}} />}*/}

          {/*24小时预报*/}
          {hourly.length && <View className={`mg-20 white bd-radius-20 ${bgItemClass}`}>
            <View className='text-center fs-30 pd-30'>24小时预报</View>
            <View className='h-line-white' />
            <ScrollView
              className='flex-col'
              scrollX
              scrollWithAnimation
              scrollLeft={0}
              style={{height: '300px'}}
            >
              <View className='flex-row flex-start-stretch pd-t-20 pd-b-40 h-100-per relative' id='tmpLineBox' style={{width: `${Taro.pxTransform(hourly.length * 150)}`}}>
                {!tmpLineImgPath && <Canvas className='tmp-line' canvasId='tmpLine' id='tmpLine'
                  style={{
                    width: `${Taro.pxTransform(hourly.length * 150)}`,
                    height: '100px'
                  }}
                />}
                {tmpLineImgPath && <Image className='tmp-line' src={tmpLineImgPath}
                  style={{
                    width: `${Taro.pxTransform(hourly.length * 150)}`,
                    height: '100px'
                  }}
                />}
                {hourly.map((h) => {
                  return (
                    <View className='flex-col flex-spa-center w-150 flex-center fs-24' key={h.time}>
                      <View className='flex-col flex-center'>
                        <ComponentIconWeather code={h.code} fontSize='fs-40' />
                        <View className='cond-txt'>{h.text}</View>
                        {/*<View className='text-right cond-txt'>{h.tmp}℃</View>*/}
                      </View>
                      <View className='' style={{flex: `0 0 100px`}} />
                      <View className='flex-row flex-center-baseline'>
                        <ComponentIconWindDirection windDirection={h.wind_direction} />
                        <View className='mg-l-4'>{`${getWindParams(h.wind_speed)['windScale']}级`}</View>
                      </View>
                      <View className='flex-row flex-center-baseline'>
                        <View className='iconfont white mg-r-4 fs-26'>&#xe600;</View>
                        <View>{h.humidity}%</View>
                      </View>
                      <View className='h-line-white line w-100-per' />
                      <View className='text-center'>{moment(h.time).format('HH:mm')}</View>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>}

          {/*3天预报*/}
          {daily.length && <View className={`mg-20 white bd-radius-20 ${bgItemClass}`}>
            <View className='pd-t-10 pd-b-10'>
              {daily.slice(0, 3).map((df, index) => {
                return (
                  <View className='flex-row flex-spb-start pd-t-30 pd-b-30 pd-l-40 pd-r-40' key={df.date}>
                    <View className='flex-row'>
                      {index === 0 && <View>今天</View>}
                      {index === 1 && <View>明天</View>}
                      {index > 1 && <View className=''>{moment(df.date).format('dddd')}</View>}
                      <View className='mg-r-10 mg-l-10'>·</View>
                      {df.text_day !== df.text_night && <View className='cond-txt'>{df.text_day}转{df.text_night}</View>}
                      {df.text_day === df.text_night && <View className='cond-txt'>{df.text_day}</View>}
                    </View>
                    <View className='flex-row'>
                      {isDay && <ComponentIconWeather code={df.code_day} fontSize='fs-40' />}
                      {!isDay && <ComponentIconWeather code={df.code_night} fontSize='fs-40' />}
                      <View className='text-right mg-l-20 cond-txt'>{df.high}/{df.low}℃</View>
                    </View>
                  </View>
                )
              })}
            </View>
            <View className='h-line-white' />
            <View className='text-center fs-30 pd-30' onClick={() => goDailyDetails()}>15天天气趋势预报</View>
          </View>}

          {/*今日生活指数*/}
          <View className={`mg-20 white bd-radius-20 ${bgItemClass}`}>
            <View className='text-center fs-30 pd-30'>今日生活指数</View>
            <View className='h-line-white' />
            <Swiper
              className='pd-t-10 pd-b-10'
              circular
              autoplay
              indicatorDots
              indicatorColor='rgba(255, 255, 255, 1)'
              indicatorActiveColor={navBarBgColor}
            >
              {lifeSuggestion.map((ls) => {
              return (
                <SwiperItem className='lifestyle-item bd-radius-20 pd-20 bd-box' key={ls.type}>
                  <View className='flex-row flex-start-baseline'>
                    {ls.type === 'comfort' && <View className='iconfont white mg-r-6 fs-26'>&#xe668;</View>}
                    {ls.type === 'dressing' && <View className='iconfont white mg-r-6 fs-30'>&#xe67a;</View>}
                    {ls.type === 'flu' && <View className='iconfont white mg-r-6 fs-28'>&#xe6c8;</View>}
                    {ls.type === 'sport' && <View className='iconfont white mg-r-6 fs-26'>&#xe6a7;</View>}
                    {ls.type === 'travel' && <View className='iconfont white mg-r-6 fs-26'>&#xe60c;</View>}
                    {ls.type === 'car_washing' && <View className='iconfont white mg-r-6 fs-26'>&#xe62f;</View>}
                    {ls.type === 'uv' && <View className='iconfont white mg-r-6 fs-26'>&#xe773;</View>}
                    {ls.type === 'air_pollution' && <View className='iconfont white mg-r-6 fs-26'>&#xe74f;</View>}
                    <View className='font30 mg-b-10'>{ls.name}</View>
                  </View>
                  <View className=''>- {suggestion[ls.type]['brief']} -</View>
                  <View className='h-line-white mg-t-10 mg-b-10' />
                  <View>{suggestion[ls.type]['details']}</View>
                </SwiperItem>
                )
              })}
            </Swiper>
            {/*<View className='h-line-white' />*/}
            {/*<View className='text-center fs-30 pd-30'>更多生活指数</View>*/}
          </View>

          <View className='fs-24 text-center mg-t-20 mg-b-20 flex-row flex-center'>
            <Text>数据来源于</Text>
            <Image className='h-50 w-144' src={xzLogoGrayImg} />
            </View>
        </ScrollView>

        <View className='flex-row flex-spa-center h-88 w-100-per bg-white bd-tl-radius-40 bd-tr-radius-40 tab-bar' id='tabBar'>
          <View className='iconfont fs-50 black bold'>&#xe87e;</View>{/**收藏**/}
          <View className='iconfont fs-50 black bold'>&#xe87f;</View>{/**添加**/}
          <View className={`iconfont fs-50 black bold ${user.isCurrentAddr ? '' : 'self-loc-anim blue-A700'}`} onClick={debounce(locationSelf, 5000, {leading: true, trailing: false})}>&#xe875;</View>{/**定位**/}
          <Button className='iconfont fs-50 black bold mg-0 pd-0 h-54 w-50 icon-btn' hoverClass='icon-btn-hover' openType='share'>&#xe874;</Button>{/**分享**/}
          <View className='iconfont fs-50 black bold'>&#xe87a;</View>{/**设置**/}
        </View>
      </View>
    </Block>
  )
}

Index.config = {
  navigationBarTitleText: '天气晴报',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black',
  navigationStyle: 'custom'
};

export default Index;
