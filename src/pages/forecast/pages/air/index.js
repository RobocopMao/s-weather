import Taro, {useState, useEffect} from '@tarojs/taro'
import {View, Canvas, Text} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import Core from '@antv/f2/lib/core'
import Guide from '@antv/f2/lib/plugin/guide'
import GroupAnimation from '@antv/f2/lib/animation/group';
import '@antv/f2/lib/coord/polar'; // 极坐标
import '@antv/f2/lib/component/guide/text' // 只加载 Guide.Text 组件
import '@antv/f2/lib/component/guide/arc' // 只加载 Guide.Arc 组件
import '@antv/f2/lib/geom/interval' // 只加载 Guide.Arc 组件
import './index.scss'
import {setNavStyle, useAsyncEffect} from '../../../../utils'
import Renderer from '../../../../utils/renderer';
import aqiJson from '../../../../assets/json/aqi.json'

function Air() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [nowAir, setNowAir] = useState({});
  const [nowAirDesc, setNowAirDesc] = useState({});

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const _nowAir = Taro.getStorageSync('NOW_AIR');
    setNowAir(_nowAir);
  }, []);

  useEffect(() => {
    drawQai();
  }, [nowAir]);

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

  return (
    <View className={`air pd-lr-20 bd-box theme-${user.theme}`}>
      <View className='flex-col'>
      <View className='flex-row flex-start-center'>
        <Canvas canvasId='nowAirAqi' style={{width: '100px', height: '100px', flex: `0 0 100px`}} />
        <View className='flex-col mg-l-20'>
          <View className='fs-36 mg-b-10' style={{color: nowAirDesc.color}}>{nowAirDesc.aqiName}</View>
          <View>{nowAirDesc.effect}</View>
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
