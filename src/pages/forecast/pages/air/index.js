import Taro, {useState, useEffect} from '@tarojs/taro'
import {View, Canvas, Text, Map} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import Core from '@antv/f2/lib/core'
import Guide from '@antv/f2/lib/plugin/guide'
import GroupAnimation from '@antv/f2/lib/animation/group'
import '@antv/f2/lib/coord/polar'; // 极坐标
import '@antv/f2/lib/component/guide/text' // 只加载 Guide.Text 组件
import '@antv/f2/lib/component/guide/arc' // 只加载 Guide.Arc 组件
import '@antv/f2/lib/geom/interval' // 只加载 Guide.Arc 组件
import './index.scss'
import {setNavStyle, useAsyncEffect, getAqiColor} from '../../../../utils'
import {getAirRanking} from '../../../../apis/air'
import Renderer from '../../../../utils/renderer'
import aqiJson from '../../../../assets/json/aqi.json'
import locationImg from '../../../../assets/images/location.png'

function Air() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [nowAir, setNowAir] = useState({});
  const [nowAirDesc, setNowAirDesc] = useState({});
  const [markers, setMarkers] = useState([]);
  const [aqiTop10, setAqiTop10] = useState([]);
  const [loadingAqiRanking, setLoadingAqiRanking] = useState(false);

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const _nowAir = Taro.getStorageSync('NOW_AIR');
    setNowAir(_nowAir);
  }, []);

  useEffect(() => {
    drawQai();
    initMarkers();
  }, [nowAir]);

  useAsyncEffect(async () => {
    getAqiRanking();
  }, []);

  // 画
  const drawQai = () => {
    if (JSON.stringify(nowAir) === '{}') {
      return;
    }
    const aqi = Number(nowAir.city.aqi);
    const _nowAirDesc = aqiJson.find((v, i, arr) => {
      if (aqi === 0) {
        return arr[0];
      }
      return aqi > v.minAqi && aqi <= v.maxAqi
    });
    setNowAirDesc(_nowAirDesc);

    const color = _nowAirDesc.color;

    let data = [{
      x: '1',
      y: aqi
    }];
    let ctx = Taro.createCanvasContext('nowAirAqi', this.$scope);
    const canvas = new Renderer(ctx);

    Core.Chart.plugins.register(Guide);
    Core.Chart.plugins.register(GroupAnimation); // 这里进行全局注册，也可以给 chart 的实例注册
    let chart = new Core.Chart({
      el: canvas,
      width: 100,
      height: 100,
      animate: false,
      pixelRatio: user.systemInfo.pixelRatio,
      padding: [10, 0, 0, 0]
    });
    chart.source(data, {
      y: {
        max: 500,
        min: 0
      }
    });
    chart.axis(false);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.9,
      radius: 0.95,
      startAngle: - Math.PI * 5 / 4,
      endAngle: Math.PI / 4
    });
    chart.guide().arc({
      start: [0, 0],
      end: [1, 499.98],
      top: false,
      style: {
        lineWidth: 3,
        stroke: '#ccc'
      }
    });
    chart.guide().text({
      position: ['50%', '40%'],
      content: String(data[0].y),
      style: {
        fontSize: 26,
        fill: color
      }
    });
    chart.guide().text({
      position: ['50%', '60%'],
      content: '空气质量指数',
      style: {
        fontSize: 11,
        fill: '#616161'
      }
    });
    chart.interval().position('x*y').size(3).color('y', function(y) {
      return color;
    }).animate({
      appear: {
        duration: 1200,
        easing: 'cubicIn'
      }
    });
    chart.render();
  };

  // 初始化markers
  const initMarkers = () => {
    if (JSON.stringify(nowAir) === '{}') {
      return;
    }
    const {stations} = nowAir;
    let _markers = [];
    for (let [i, v] of stations.entries()) {
      if (v.aqi !== null) {
        let marker = {
          id: i,
          longitude: Number(v.longitude),
          latitude: Number(v.latitude),
          iconPath: locationImg,
          width: 25,
          height: 25,
          title: `${v.aqi} ${v.station}`,
          callout: {
            content: v.aqi,
            color: '#fff',
            fontSize: 13,
            borderRadius: 8,
            textAlign: 'center',
            bgColor: getAqiColor(v.aqi),
            display: 'ALWAYS',
            padding: 5,
            zIndex: 0,
          },
        };

        _markers.push(marker);
      }
    }

    setMarkers(_markers);
  };

  // 点击marker
  const markerTap = (e) => {
    // console.log(e)
    const {markerId} = e;
    let _markers = markers;
    for (let [, v] of _markers.entries()) {
      if (v.id === markerId) {
        v.callout.content = v.title;
        v.callout.zIndex = 1;
      } else {
        v.callout.content = v.title.split(' ')[0];
        v.callout.zIndex = 0;
      }
    }
    setMarkers(_markers)
  };

  const getAqiRanking = async () => {
    setLoadingAqiRanking(true);
    const {results} = await getAirRanking();
    Taro.setStorageSync('AQI_RANKING', results);
    setAqiTop10(results.slice(0, 10));
    setLoadingAqiRanking(false);
  };

  const goAqiForecast = () => {
    Taro.navigateTo({url: `/pages/forecast/pages/air_forecast/index`});
  };

  const goAqiRanking = () => {
    Taro.navigateTo({url: `/pages/forecast/pages/air_ranking/index`});
  };

  return (
    <View className={`air pd-lr-20 bd-box theme-${user.theme}`}>
      <View className='flex-col'>
        <View className='flex-row flex-spb-center'>
          <Canvas className='item-als-center' canvasId='nowAirAqi' style={{width: '100px', height: '100px', flex: `0 0 100px`}} />
          <View className='flex-col mg-l-20 item-als-center'>
            <View className='fs-36 mg-b-10 bold' style={{color: nowAirDesc.color}}>{nowAirDesc.aqiName}</View>
            <View>{nowAirDesc.effect}</View>
          </View>
          <View className={`flex-col flex-center item-als-center text-center mg-l-20 white circle w-100 h-100 item-fls-0 item-flg-0 item-flb-100 ${location.isDay ? 'day-bg' : 'night-bg'}`}
                onClick={() => goAqiForecast()}>
            <View className='fs-32'>AQI</View>
            <View className='fs-24'>预报</View>
          </View>
        </View>
        <View className='h-line-gray-300 mg-b-20' />
        <View className='flex-row flex-spb-center text-center'>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.pm25}</View>
            <View className='fs-24 mg-t-4'>PM2.5</View>
          </View>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.pm10}</View>
            <View className='fs-24 mg-t-4'>PM10</View>
          </View>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.so2}</View>
            <View className='fs-24 mg-t-4'>
              <Text>SO</Text>
              <Text className='fs-16'>2</Text>
            </View>
          </View>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.no2}</View>
            <View className='fs-24 mg-t-4'>
              <Text>NO</Text>
              <Text className='fs-16'>2</Text>
            </View>
          </View>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.o3}</View>
            <View className='fs-24 mg-t-4'>
              <Text>O</Text>
              <Text className='fs-16'>3</Text>
            </View>
          </View>
          <View>
            <View className={`fs-30 ${location.isDay ? 'day-color' : 'night-color'}`}>{nowAir.city.co}</View>
            <View className='fs-24 mg-t-4'>CO</View>
          </View>
        </View>
      </View>
      <View className='flex-col mg-t-20'>
        <View className='flex-row flex-spb-baseline mg-tb-20 fs-32'>
          <Text className='gray-900'>附近空气质量</Text>
          <Text className='fs-24 gray-400'>{moment(nowAir.last_update).format('MM-DD HH:mm')} 发布</Text>
        </View>
        <View className='map'>
          <Map
            className='w-100-per h-100-per'
            longitude={location.latAndLon.longitude}
            latitude={location.latAndLon.latitude}
            scale={10}
            markers={markers}
            showLocation
            onMarkerTap={(e) => markerTap(e)}
            onCalloutTap={(e) => markerTap(e)}
          />
        </View>
      </View>
      <View className='flex-col mg-b-20'>
        <View className='flex-row flex-spb-baseline mg-b-20 mg-t-40 fs-32'>
          <Text className='gray-900'>全国城市AQI排行榜TOP10</Text>
          {aqiTop10.length && <View className={`flex-row flex-row-baseline pd-tb-10 ${location.isDay ? 'day-color' : 'night-color'}`} onClick={() => goAqiRanking()}>
            <View className='fs-28'>更多</View>
            <View className='iconfont fs-36 bold'>&#xe65b;</View>
          </View>}
        </View>
        <View className='h-line-gray-300 mg-b-10' />
        {aqiTop10.map((ranking, index) => {
          let cityArr = [...new Set(ranking.location.path.split(','))].reverse();
          cityArr.shift();
          let city = cityArr.join(' ');
          return (
            <View className='flex-row flex-spb-center' key={String(index)}>
              <View className='item-flb-60per lh-60'>{city}</View>
              <View className='item-flb-40per lh-60 text-center' style={{color: getAqiColor(ranking.aqi)}}>{ranking.aqi}</View>
            </View>
          )
        })}
        {!aqiTop10.length && <View className='flex-col flex-start-center pd-tb-30 gray-300' onClick={() => getAqiRanking()}>
          <View className='iconfont fs-100 mg-20'>&#xe66b;</View>
          <View>数据加载失败，点击刷新</View>
        </View>}
      </View>
    </View>
  )
}

Air.config = {
  navigationBarTitleText: '空气质量详情',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Air;
