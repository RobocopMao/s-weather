import Taro, {useEffect, useState} from '@tarojs/taro'
import {Block, View, Text, ScrollView, Canvas, Image, Swiper, SwiperItem, Button} from '@tarojs/components'
import { useSelector, useDispatch } from '@tarojs/redux'
import moment from 'moment'
import _ from 'lodash'
import Core from '@antv/f2/lib/core'
import Guide from '@antv/f2/lib/plugin/guide'
import '@antv/f2/lib/geom/line'; // 只加载折线图
import '@antv/f2/lib/component/guide/text'; // 只加载 Guide.Text 组件
import '@antv/f2/lib/scale/time-cat'; // 加载 timeCat 类型的度量
import QQMapWX from '../../../utils/qqmap-wx-jssdk'
import {QQ_MAP_SDK_KEY} from '../../../apis/config'
import './index.scss'
import {useAsyncEffect, getNodeRect, getSystemInfo, getWindParams, setNavStyle} from '../../../utils'
import {getWeatherNow, getWeatherHourly, getWeatherDaily, getAlarms} from '../../../apis/weather'
import {getAirNow} from '../../../apis/air'
import {getLifeSuggestion} from '../../../apis/life'
import {getGeoSun} from '../../../apis/goe'
import {
  // setLng,
  // setLat,
  setProvince,
  setCity,
  setDistrict,
  setStreetNum,
  setAddress,
  setName,
  setIsDay,
  setLatAndLon
} from '../../../redux/location/action'
import {
  setSystemInfo,
  setUserLocation,
  setUserIsCurAddr,
  setUserGeoSun,
  setUserLifeSuggestion, setUserTheme
} from '../../../redux/user/action'
import ComponentBaseNavigation from '../../../components/base/navigation'
import ComponentIconWindDirection from '../../../components/icon/wind_dir'
import ComponentIconWeather from '../../../components/icon/weather'
// import ComponentTagName from '../../components/common/component_tag_name'
import Skeleton from '../../../components/common/skeleton'
import xzLogoGrayImg from '../../../assets/images/xinzhi_logo_gray.png'
import hfLogoGrayImg from '../../../assets/images/hefeng_logo_gray.png'
import themeMatch from '../../../assets/json/theme_match.json'
import Renderer from '../../../utils/renderer'

function Index() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [now, setNow] = useState({});
  const [updateTime, setUpdateTime] = useState('');
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [suggestion, setSuggestion] = useState({});
  const [nowAir, setNowAir] = useState({});
  const [sun, setSun] = useState({});
  const [alarms, setAlarms] = useState([]);
  // const [isDay, setIsDay] = useState(true);
  // const [bgPageClass, setBgPageClass] = useState('');
  // const [bgItemClass, setBgItemClass] = useState('');
  // const [navBarBgColor, setNavBarBgColor] = useState('#FFFFFF');
  const [tmpLineImgPath, setTmpLineImgPath] = useState('');
  // const [canvasHeight, setCanvasHeight] = useState(100); // 防止移除canvas，加载image时闪烁
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollToTop, setScrollToTop] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [previous , setPrevious ] = useState(0);

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

  // 设置主题颜色,本地没有就使用默认主题
  useEffect(() => {
    const theme = Taro.getStorageSync('THEME');
    if (theme) {
      dispatch(setUserTheme(theme));
    }
  }, []);

  // 日出日落
  useAsyncEffect(async () => {
    const {from} = this.$router.params;
    // console.log(user.isCurrentAddr);
    // console.log(user.geo);
    if (user.isCurrentAddr && user.geoSun && from !== 'SHARE') { // 当前用户，且日出日落已存在， 比如当用户点击当行定位按钮就不会在此发请求
      setSun(user.geoSun);
      setDayNight(user.geoSun);
    } else { // 否则就去请求
      const {latitude, longitude} = location.latAndLon;
      const res = await getGeoSun({location: `${latitude}:${longitude}`, days: 1});
      if (!res) {return}
      const {sun} = res;
      setSun(sun[0]);
      setDayNight(sun[0]);
      if (user.isCurrentAddr) {
        dispatch(setUserGeoSun(sun[0]));
      }
    }
  }, [location.latAndLon]);

  // 实时天气
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getWeatherNow({location: `${latitude}:${longitude}`});
    // console.log(res);
    if (!res) {return}
    const {now, last_update} = res;
    setNow(now);
    setUpdateTime(last_update);
  }, [location.latAndLon]);

  // 空气质量
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getAirNow({location: `${latitude}:${longitude}`, scope: 'all'});
    // console.log(res);
    if (!res) {return}
    const {air, last_update} = res;
    air.last_update = last_update;
    setNowAir(air);
    Taro.setStorageSync('NOW_AIR', air);
  }, [location.latAndLon]);

  // 逐小时预报
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getWeatherHourly({location: `${latitude}:${longitude}`});
    // console.log(res);
    if (!res) {return}
    const {hourly} = res;
    for (let [, v] of hourly.entries()) {
      // console.log(v,i);
     v.temperature = Number(v.temperature);
    }
    setHourly(hourly);
  }, [location.latAndLon]);

  // 3日预报
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getWeatherDaily({location: `${latitude}:${longitude}`, days: 15});
    // console.log(res);
    if (!res) {return}
    const {daily} = res;
    setDaily(daily);
    Taro.setStorageSync('DAILY_FORECAST', daily);
  }, [location.latAndLon]);

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
  }, [location.latAndLon]);

  // 气象预警
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getAlarms({location: `${latitude}:${longitude}`});
    // console.log(res);
    if (!res) {return}
    const {alarms} = res;
    setAlarms(alarms);
    Taro.setStorageSync('ALARMS', alarms); // alarm详情不用再次请求，直接取本地数据
  }, [location.latAndLon]);

  // 设备信息
  useEffect(async () => {
    const res = await getSystemInfo();
    dispatch(setSystemInfo(res));
    const res1 = await getNodeRect('#tabBar');
    if (!res1) {return;}
    setScrollHeight(res.windowHeight - res1.height - 44 - user.systemInfo.statusBarHeight);  // 自定义导航固定44
  }, [showSkeleton]);

  // 画逐小时图
  useEffect(() => {
    // setTmpLineImgPath('');
    // setCanvasHeight(100);
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
    dispatch(setIsDay(isDay));
    setNavStyle(isDay, user.theme);
  };

  // 获取用户位置信息
  const getUserLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
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
        dispatch(setLatAndLon({longitude, latitude}));
        // dispatch(setLat(latitude));
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
        }
        dispatch(setUserIsCurAddr(isUser));
      },
      fail: _res => {
        // console.log(_res);
        Taro.showToast({title: _res.message, icon: 'none'});
      },
      // complete: _res => {
      //   // console.log(res);
      // }
    });
  };

  // 画逐小时图
  // const drawTmpLine = async () => {
  //   let tmp = [];
  //
  //   for (let [, v] of hourly.entries()) {
  //     // console.log(v,i);
  //     tmp.push(Number(v.temperature));
  //   }
  //   let maxTmp = _.max(tmp) + 3; // 最高温
  //   let minTmp = _.min(tmp) - 1; // 最低温
  //   let tmpRange = maxTmp - minTmp;
  //   // console.log(tmp, maxTmp, minTmp, tmpRange);
  //   let distance= Math.floor((100 / tmpRange));
  //   let nodeRect = await getNodeRect('#tmpLineBox');
  //   if (!nodeRect) {return}
  //   const strokeColor = '#ffffff';
  //   let rowWidth = nodeRect.width / hourly.length;
  //   let ctx = Taro.createCanvasContext('tmpLine', this.$scope);
  //   // console.log(ctx);
  //   ctx.save();
  //
  //   // 画温度线
  //   ctx.strokeStyle = strokeColor;
  //   ctx.lineWidth = 1;
  //   ctx.beginPath();
  //   ctx.setLineCap('round');
  //   for (let [i, v] of tmp.entries()) {
  //     let drawX = i * rowWidth + (rowWidth / 2);
  //     let drawY = (maxTmp - v) * distance;
  //     // console.log(drawX, drawY);
  //     if (i === 0){
  //       ctx.moveTo(drawX, drawY);
  //       ctx.setFontSize(12);
  //       ctx.fillStyle = strokeColor;
  //       ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
  //     } else {
  //       ctx.lineTo(drawX, drawY);
  //       ctx.fillStyle = strokeColor;
  //       ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
  //     }
  //   }
  //   ctx.stroke();
  //
  //   ctx.draw(false, () => {
  //     canvasToImg();
  //   });
  // };

  // 画逐小时图
  const drawTmpLine = async () => {
    const nodeRect = await getNodeRect('#tmpLine');
    if (!nodeRect) {return}
    const lineColor = '#ffffff';
    const rowWidth = nodeRect.width / hourly.length;
    const min = _.minBy(hourly, 'temperature').temperature;
    const max = _.maxBy(hourly, 'temperature').temperature;

    const {width, height} = nodeRect;
    const ctx = Taro.createCanvasContext('tmpLine', this.$scope);
    const canvas = new Renderer(ctx);

    Core.Chart.plugins.register(Guide);
    let chart = new Core.Chart({
      el: canvas,
      width,
      height,
      animate: false,
      pixelRatio: user.systemInfo.pixelRatio,
      padding: ['auto', rowWidth / 2, 'auto', rowWidth / 2]
    });
    // console.log(chart);

    const defs = {
      time: {
        type: 'timeCat',
        mask: 'MM/DD',
        tickCount: 3,
        range: [0, 1]
      },
      temperature: {
        tickCount: max - min,
        min: min,
        alias: '逐小时温度'
      }
    };
    chart.source(hourly, defs);
    chart.axis(false);
    hourly.map(function(obj) {
      chart.guide().text({
        position: [obj.time, obj.temperature],
        content: obj.temperature + '℃',
        style: {
          fill: lineColor,
          textAlign: 'center'
        },
        offsetY: -15
      });
    });
    chart.line().position('time*temperature').shape('smooth').style({
      stroke: lineColor
    });

    chart.render();
    setTimeout(() => {
      canvasToImg();
    }, 300);
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

  // 定位自己,自己写节流，lodash的节流函数在这里不管用，不知道为什么
  const locationSelf = () => {
    let _now = Date.now();
    if (_now - previous > 5000) {
      const {latitude, longitude,} = user.location;
      qqMapSetLocation({latitude, longitude, isUser: true});
      scrollToPageTop();
      setPrevious(_now);
    } else {
      Taro.showToast({title: '客官，手速太快了', icon: 'none'});
    }
  };

  // 分享的事件
  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: `我这儿现在天气${now.text},气温${now.temperature}℃,你那儿呢？`,
        path: `/pages/tab_bar/index/index?from=SHARE`,
      }
    };
  };

  // scroll container 滚动事件
  const onContainerScroll = async (e) => {
    const {scrollTop} = e.detail;
    setScrollTop(scrollTop);
  };

  // 滚动到顶部
  const scrollToPageTop = () => {
    setScrollToTop(prev => prev === 0 ? 0.1 : 0);
  };

  // 去空气质量
  const goAir = () => {
    Taro.navigateTo({url: `../../forecast/pages/air/index`});
  };

  // 去气象预警
  const goAlarms = () => {
    Taro.navigateTo({url: `../../forecast/pages/alarm/index`});
  };

  // 去15天天气预报
  const goDailyDetails = () => {
    const {longitude, latitude} = location.latAndLon;
    Taro.navigateTo({url: `../../forecast/pages/daily_forecast/index?lon=${longitude}&lat=${latitude}`});
  };

  // 去城市收藏夹
  const goLocationCollection = () => {
    Taro.navigateTo({
      url: `../../tab_bar/location_collection/index`,
      events: {
        acceptDataFromLocationCollection(data) {  // 监听事件
          console.log('acceptDataFromLocationCollection');
          console.log(data);
          const {lat, lon, cityName} = data;
          qqMapSetLocation({latitude: lat, longitude: lon, isUser: false, name: cityName});  // 重新获取数据
          scrollToPageTop();
        }
      }
    });
  };

  // 去城市搜索
  const goLocationSearch = () => {
    Taro.navigateTo({
      url: `../../tab_bar/location_search/index`,
      events: {
        acceptDataFromLocationSearch(data) {  // 监听事件
          console.log('acceptDataFromLocationSearch');
          console.log(data);
          const {lat, lon, cityName} = data;
          qqMapSetLocation({latitude: lat, longitude: lon, isUser: false, name: cityName});  // 重新获取数据
          scrollToPageTop();
        }
      }
    });
  };

  // 去设置界面
  const goSetting = () => {
    Taro.navigateTo({
      url: `../../tab_bar/setting/index`,
      events: {
        acceptDataFromSetting(data) {  // 监听事件
          console.log('acceptDataFromSetting');
          console.log(data);
        }
      }
    });
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
      <View className={`weather h-100-per skeleton theme-${user.theme} white`}>
        {/*<ComponentTagName />*/}
        <ComponentBaseNavigation backgroundColor={location.isDay ? themeMatch[user.theme]['day'] : themeMatch[user.theme]['night']}
                                 color={location.isDay ? themeMatch[user.theme]['dayFontColor'] : themeMatch[user.theme]['nightFontColor']}
                                 statusBarHeight={user.systemInfo.statusBarHeight}
        >
          <View className='flex-row flex-start-center w-100-per pd-lr-20' onClick={_.debounce(chooseLocation, 5000, {leading: true, trailing: false})}>
            <View className='iconfont mg-r-10 fs-36'>&#xe875;</View>
            <View className={`flex-col  ${scrollTop > 200 ? 'flex-spb-start' : 'flex-center-start'}`}>
              {scrollTop > 200 && <View className='flex-row flex-start-baseline fs-26'>
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
          className={`flex-col relative ${location.isDay ? 'day-bg-lg' : 'night-bg-lg'}`}
          scrollY
          scrollWithAnimation
          style={{height: `${scrollHeight}px`}}
          onScroll={e => onContainerScroll(e)}
          scrollTop={scrollToTop}
        >
          {JSON.stringify(now) !== '{}' && <View className='flex-col flex-center relative' id='nowContainer'>
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
                <View className='iconfont mg-r-4 fs-28'>&#xe600;</View>
                <View className=''>湿度 {now.humidity}%</View>
              </View>
              {JSON.stringify(nowAir) !== '{}' && <View className='mg-l-10 mg-r-10 h-28 v-line-white' />}
              {JSON.stringify(nowAir) !== '{}' && <View className='flex-row flex-center-baseline' onClick={() => goAir()}>
                <View className='iconfont mg-r-4 fs-26'>&#xe68b;</View>
                <View className=''>空气{nowAir.city.quality} {nowAir.city.aqi}</View>
              </View>}
            </View>
            <View className='mg-b-40 fs-24'>天气数据更新于 {moment(updateTime).format('HH:mm')}</View>
            {/*气象预警*/}
            {alarms.length && <View className='flex-row flex-center circle w-120 h-120 pd-10 alarm' onClick={() => goAlarms()}>
              <View className='flex-row flex-center w-40 h-40 circle sound'>
                <View className='iconfont red-A700 fs-40'>&#xe63a;</View>
              </View>
            </View>}
          </View>}
          {/*{fixedContainerNow && <View style={{height: `${boxNowInitHeight - boxNowSmallHeight}px`}} />}*/}

          {/*24小时预报*/}
          {hourly.length && <View className={`mg-20 bd-radius-20 ${location.isDay ? 'day-bg-opacity' : 'night-bg-opacity'}`}>
            <View className='text-center fs-30 pd-30'>24小时逐时预报</View>
            <View className='h-line-white' />
            <ScrollView
              className='flex-col'
              scrollX
              scrollWithAnimation
              scrollLeft={0}
              style={{height: '300px'}}
            >
              <View className='flex-row flex-start-stretch pd-t-20 pd-b-40 h-100-per relative box-hd-x' style={{width: `${Taro.pxTransform(hourly.length * 150)}`}}>
                <Canvas className='tmp-line' canvasId='tmpLine' id='tmpLine'
                  style={{
                    width: `${Taro.pxTransform(hourly.length * 150)}`,
                    height: `100px`,
                    left: '9999px'
                  }}
                />
                {tmpLineImgPath && <Image className='tmp-line' src={tmpLineImgPath}
                  style={{
                    width: `${Taro.pxTransform(hourly.length * 150)}`,
                    height: '100px',
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
                        <View className='iconfont mg-r-4 fs-26'>&#xe600;</View>
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
          {daily.length && <View className={`mg-20 bd-radius-20 ${location.isDay ? 'day-bg-opacity' : 'night-bg-opacity'}`}>
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
                      {location.isDay && <ComponentIconWeather code={df.code_day} fontSize='fs-40' />}
                      {!location.isDay && <ComponentIconWeather code={df.code_night} fontSize='fs-40' />}
                      <View className='text-right mg-l-20 cond-txt'>{df.high}/{df.low}℃</View>
                    </View>
                  </View>
                )
              })}
            </View>
            <View className='h-line-white' />
            <View className='text-center fs-30 pd-30' onClick={() => goDailyDetails()}>15天天气趋势预报</View>
          </View>}

          {/*今日生活指数,香港澳门没有数据*/}
          {location.name !== '香港' && location.name !== '澳门' && JSON.stringify(suggestion) !== '{}'
          && <View className={`mg-20 bd-radius-20 ${location.isDay ? 'day-bg-opacity' : 'night-bg-opacity'}`}>
            <View className='text-center fs-30 pd-30'>今日生活指数</View>
            <View className='h-line-white' />
            <Swiper
              className='pd-t-10 pd-b-10'
              circular
              autoplay
              indicatorDots
              indicatorColor='#FFFFFF'
              indicatorActiveColor={location.isDay ? themeMatch[user.theme]['day'] : themeMatch[user.theme]['night']}
            >
              {lifeSuggestion.map((ls) => {
              return (
                <SwiperItem className='lifestyle-item bd-radius-20 pd-20 bd-box' key={ls.type}>
                  <View className='flex-row flex-start-baseline'>
                    {ls.type === 'comfort' && <View className='iconfont mg-r-6 fs-26'>&#xe668;</View>}
                    {ls.type === 'dressing' && <View className='iconfont mg-r-6 fs-30'>&#xe67a;</View>}
                    {ls.type === 'flu' && <View className='iconfont mg-r-6 fs-28'>&#xe6c8;</View>}
                    {ls.type === 'sport' && <View className='iconfont mg-r-6 fs-26'>&#xe6a7;</View>}
                    {ls.type === 'travel' && <View className='iconfont mg-r-6 fs-26'>&#xe60c;</View>}
                    {ls.type === 'car_washing' && <View className='iconfont mg-r-6 fs-26'>&#xe62f;</View>}
                    {ls.type === 'uv' && <View className='iconfont mg-r-6 fs-26'>&#xe773;</View>}
                    {ls.type === 'air_pollution' && <View className='iconfont mg-r-6 fs-26'>&#xe74f;</View>}
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
          </View>}

          {JSON.stringify(now) !== '{}' && <View className='fs-24 text-center mg-t-20 mg-b-20 flex-row flex-center'>
            <Text className='gray-700'>天气数据来源于</Text>
            <Image className='h-50 w-144' src={xzLogoGrayImg} />
            <Image className='h-30 w-120' src={hfLogoGrayImg} />
          </View>}
        </ScrollView>

        {!showSkeleton && <View className='flex-row flex-spa-center h-88 w-100-per bg-white bd-tl-radius-40 bd-tr-radius-40 tab-bar' id='tabBar'>
          <View className={`iconfont fs-50 bold ${location.isDay ? 'day-color' : 'night-color'}`} onClick={() => goLocationCollection()}>&#xe87e;</View>{/**收藏**/}
          <View className={`iconfont fs-50 bold ${location.isDay ? 'day-color' : 'night-color'}`} onClick={() => goLocationSearch()}>&#xe87c;</View>{/**搜索**/}
          <View className={`iconfont fs-50 bold ${location.isDay ? 'day-color' : 'night-color'} ${user.isCurrentAddr ? '' : 'self-loc-anim red-A700'}`} onClick={() => locationSelf()}>&#xe875;</View>{/**定位**/}
          <Button className={`iconfont fs-50 bold mg-0 pd-0 h-54 w-50 icon-btn ${location.isDay ? 'day-color' : 'night-color'}`} hoverClass='icon-btn-hover' openType='share'>&#xe874;</Button>{/**分享**/}
          <View className={`iconfont fs-50 bold ${location.isDay ? 'day-color' : 'night-color'}`} onClick={() => goSetting()}>&#xe87a;</View>{/**设置**/}
        </View>}
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
