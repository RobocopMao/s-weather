import Taro, {useState, useEffect} from '@tarojs/taro'
import {View, Canvas, ScrollView} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import _ from 'lodash'
import Core from '@antv/f2/lib/core'
import Guide from '@antv/f2/lib/plugin/guide'
import '@antv/f2/lib/geom/line'; // 只加载折线图
import '@antv/f2/lib/geom/area'; // 只加载面积图
import '@antv/f2/lib/component/guide/text'; // 只加载 Guide.Text 组件
import '@antv/f2/lib/scale/time-cat'; // 加载 timeCat 类型的度量
import './index.scss'
import {getNodeRect, setNavStyle, useAsyncEffect} from '../../../../utils'
import Renderer from '../../../../utils/renderer'
import aqiJson from '../../../../assets/json/aqi.json'
import themeMatch from '../../../../assets/json/theme_match.json'
import {getAirDaily, getAirHourly} from '../../../../apis/air'

function AirForecast() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [airHourly, setAirHourly] = useState([]);
  const [times, setTimes] = useState([]);  // 显示24小时的时间轴
  const [airDaily, setAirDaily] = useState([]);
  const [dates, setDates] = useState([]);  // 显示5天的时间轴

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 获取数据
  useAsyncEffect(async () => {
    const {latitude, longitude} = location.latAndLon;
    const res = await getAirHourly({location: `${latitude}:${longitude}`, days: 1});
    const {hourly} = res;
    for (let [, v] of hourly.entries()) {
      v.aqi = Number(v.aqi);
    }
    setAirHourly(hourly);

    const res1 = await getAirDaily({location: `${latitude}:${longitude}`, days: 5});
    const {daily} = res1;
    for (let [, v] of daily.entries()) {
      v.aqi = Number(v.aqi);
    }
    setAirDaily(daily);
  }, []);

  useEffect(() => {
    drawHourlyLine();
  }, [airHourly]);

  useEffect(() => {
    drawDailyLine();
  }, [airDaily]);

  // 画逐小时预报图
  const drawHourlyLine = async () => {
    const nodeRect = await getNodeRect('#aqiHourlyLine');
    if (!airHourly.length || !nodeRect) {return}
    const lineColor = location.isDay ? themeMatch[user.theme]['day'] : themeMatch[user.theme]['night'];
    // const rowWidth = nodeRect.width / hourly.length;
    let _times = [];
    for (let [, v] of airHourly.entries()) {
      _times.push(v.time);
    }
    setTimes(_times);

    const min = _.minBy(airHourly, 'aqi').aqi;
    const max = _.maxBy(airHourly, 'aqi').aqi;
    const topColor = getAqiColor(max + 5);
    const bottomColor = getAqiColor(min - 5);

    const {width, height} = nodeRect;
    const ctx = Taro.createCanvasContext('aqiHourlyLine', this.$scope);
    const canvas = new Renderer(ctx);

    // Core.Chart.plugins.register(Guide);
    let chart = new Core.Chart({
      el: canvas,
      width,
      height,
      pixelRatio: user.systemInfo.pixelRatio,
      plugins: Guide,
      padding: ['auto', 30]
    });
    // console.log(chart);

    const defs = {
      time: {
        type: 'timeCat',
        mask: 'H时',
        // tickCount: 3,
        range: [0, 1],
      },
      aqi: {
        // tickCount: 5,
        min: min - 5,
        max: max + 5,
        alias: '逐小时AQI'
      }
    };
    chart.source(airHourly, defs);
    chart.axis(false);
    airHourly.map(function(obj) {
      chart.guide().text({
        position: [obj.time, obj.aqi],
        content: obj.aqi,
        style: {
          fill: getAqiColor(obj.aqi),
          textAlign: 'center'
        },
        offsetY: -15
      });
      chart.guide().text({
        position: [obj.time, obj.aqi],
        content: obj.quality,
        style: {
          fill: getAqiColor(obj.aqi),
          textAlign: 'center'
        },
        offsetY: -30
      });
    });
    chart.line().position('time*aqi').shape('smooth').style({
      stroke: lineColor
    });
    chart.area().position('time*aqi').color(`l(90) 0:${topColor} 1:${bottomColor}`).shape('smooth');

    chart.render();
  };

  // 画逐天预报图
  const drawDailyLine = async () => {
    const nodeRect = await getNodeRect('#aqiDailyLine');
    if (!airDaily.length || !nodeRect) {return}
    const lineColor = location.isDay ? themeMatch[user.theme]['day'] : themeMatch[user.theme]['night'];
    // const rowWidth = nodeRect.width / hourly.length;
    let _dates = [];

    for (let [, v] of airDaily.entries()) {
      _dates.push(v.date);
    }
    setDates(_dates);

    const min = _.minBy(airDaily, 'aqi').aqi;
    const max = _.maxBy(airDaily, 'aqi').aqi;
    const topColor = getAqiColor(max + 5);
    const bottomColor = getAqiColor(min - 5);

    const {width, height} = nodeRect;
    const ctx = Taro.createCanvasContext('aqiDailyLine', this.$scope);
    const canvas = new Renderer(ctx);

    // Core.Chart.plugins.register(Guide);
    let chart = new Core.Chart({
      el: canvas,
      width,
      height,
      pixelRatio: user.systemInfo.pixelRatio,
      plugins: Guide,
      padding: ['auto', 30]
    });
    // console.log(chart);

    const defs = {
      date: {
        type: 'timeCat',
        mask: 'MM-DD',
        // tickCount: 3,
        range: [0, 1],
      },
      aqi: {
        // tickCount: 5,
        min: min - 5,
        max: max + 5,
        alias: '逐天AQI'
      }
    };
    chart.source(airDaily, defs);
    chart.axis(false);
    airDaily.map(function(obj) {
      chart.guide().text({
        position: [obj.date, obj.aqi],
        content: obj.aqi,
        style: {
          fill: getAqiColor(obj.aqi),
          textAlign: 'center'
        },
        offsetY: -15
      });
      chart.guide().text({
        position: [obj.date, obj.aqi],
        content: obj.quality,
        style: {
          fill: getAqiColor(obj.aqi),
          textAlign: 'center'
        },
        offsetY: -30
      });
    });
    chart.line().position('date*aqi').shape('smooth').style({
      stroke: lineColor
    });
    chart.area().position('date*aqi').color(`l(90) 0:${topColor} 1:${bottomColor}`).shape('smooth');

    chart.render();
  };

  // 更具aqi获取不同的颜色
  const getAqiColor = (aqi) => {
    const _aqi = Number(aqi);
    let aqiDesc = aqiJson.find((v, i, arr) => {
      if (_aqi === 0) {
        return arr[0];
      }
      return _aqi > v.minAqi && _aqi <= v.maxAqi
    });

    return aqiDesc.color;
  };

  return (
    <View className={`air-forecast flex-col bd-box theme-${user.theme}`}>
      {/*<View className='flex-row flex-spb-center text-center'>*/}
        {/*<View className='item-flg-1 h-80 lh-80'>24小时预报</View>*/}
        {/*<View className='item-flg-1 h-80 lh-80'>5天预报</View>*/}
      {/*</View>*/}
      <View className='flex-col flex-start-stretch bd-box pd-b-40 item-flb-50per'>
        <View className='text-center lh-88'>24小时预报</View>
        <ScrollView
          className='pd-lr-20 bd-box item-flg-1'
          scrollX
          scrollWithAnimation
        >
          <View className='flex-col flex-start-stretch h-100-per' style={{width: `${airHourly.length * 50}px`}}>
            <Canvas className='w-100-per item-flg-1' canvasId='aqiHourlyLine' id='aqiHourlyLine' style={{
              height: `220px`,
              // width: `350px`
            }} />
            <View className='flex-row flex-spb-center text-center pd-lr-10 h-14 lh-14'>
              {times.map((time) => {
                return (
                  <View className='fs-20' key={time} style={{width: `50px`}}>
                    {moment(time).format('H:mm') === '0:00' ? moment(time).format('MM-DD') : moment(time).format('H:mm')}
                  </View>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </View>
      <View className='flex-col flex-start-stretch bd-box pd-b-40 item-flb-50per'>
        <View className='text-center lh-88 bd-t-thin-gray-300 relative'>5天预报</View>
        <ScrollView
          className='pd-lr-20 bd-box item-flg-1'
          scrollX
          scrollWithAnimation
        >
          <View className='flex-col flex-start-stretch h-100-per w-100-per'>
            <Canvas className='w-100-per item-flg-1' canvasId='aqiDailyLine' id='aqiDailyLine' style={{
              height: `220px`,
              // width: `350px`
            }} />
            <View className='flex-row flex-spb-center text-center w-100-per pd-lr-30 h-14 lh-14'>
              {dates.map((date) => {
                return (
                  <View className='fs-20' key={date}>{moment(date).format('MM-DD')}</View>
                )
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

AirForecast.config = {
  navigationBarTitleText: 'AQI预报',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default AirForecast;
