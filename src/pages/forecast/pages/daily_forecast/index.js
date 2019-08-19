import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, ScrollView, Canvas} from '@tarojs/components'
import moment from 'moment'
import _ from 'lodash/lodash.min'
import Core from '@antv/f2/lib/core'
import Guide from '@antv/f2/lib/plugin/guide'
import '@antv/f2/lib/geom/line'; // 只加载折线图
import '@antv/f2/lib/component/guide/text'; // 只加载 Guide.Text 组件
import '@antv/f2/lib/scale/time-cat'; // 加载 timeCat 类型的度量
import {useSelector} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'
// import {getWeatherDaily} from '../../../../apis/weather'
import ComponentIconWeather from '../../../../components/icon/weather'
import ComponentIconWindDirection from '../../../../components/icon/wind_dir'
import themeMatch from '../../../../assets/json/theme_match.json'
import Renderer from '../../../../utils/renderer'

function DailyForecast() {
  const [daily, setDaily] = useState([]);
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度
  const [scrollWidth, setScrollWidth] = useState(0); // 可使用窗口高度
  const [windowWidth, setWindowWidth] = useState(0); // 可使用窗口高度
  // const [tmpLineImgPath, setTmpLineImgPath] = useState(''); // 可使用窗口高度

  // 15日预报
  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const _daily = Taro.getStorageSync('DAILY_FORECAST');
    // console.log(res);
    setDaily(_daily);
  }, []);

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setScrollHeight(res.windowHeight);
        setScrollWidth(res.windowWidth * (daily.length || 15) / 5);
        setWindowWidth(res.windowWidth);
      }
    })
      .then(res => {
        drawTmpLine();
      })
  }, [daily]);

  const drawTmpLine = () => {
    if (!daily.length) {
      return;
    }
    let highTmp = [],  // 高温
        lowTmp = [];  // 低温
    for (let [, v] of daily.entries()) {
      // console.log(v,i);
      let highTmpObj = {
        date: v.date,
        tem: Number(v.high),
        type: '高温'
      };
      let lowTmpObj = {
        date: v.date,
        tem: Number(v.low),
        type: '低温'
      };
      highTmp.push(highTmpObj);
      lowTmp.push(lowTmpObj);
    }
    let maxTmp = _.maxBy(highTmp, 'tem').tem; // 最高温
    let minTmp = _.minBy(lowTmp, 'tem').tem; // 最低温
    const data = [...highTmp, ...lowTmp];
    let tmpRange = maxTmp - minTmp;
    let windowW1_5 = windowWidth / 5;

    let ctx = Taro.createCanvasContext('tmpLine', this.$scope);
    const canvas = new Renderer(ctx);

    Core.Chart.plugins.register(Guide);
    let chart = new Core.Chart({
      el: canvas,
      width: scrollWidth,
      height: scrollHeight / 3,
      animate: false,
      pixelRatio: user.systemInfo.pixelRatio,
      padding: ['auto', windowW1_5 / 2, 'auto', windowW1_5 / 2]
    });

    // console.log(chart);

    const defs = {
      date: {
        type: 'timeCat',
        mask: 'YYYY-MM-DD',
        tickCount: 3,
        range: [0, 1]
      },
      temperature: {
        tickCount: tmpRange,
        min: minTmp,
        alias: '每日最高/最低温'
      }
    };
    chart.source(data, defs);
    chart.axis(false);
    // chart.legend(false);
    data.map(function(obj) {
      chart.guide().text({
        position: [obj.date, obj.tem],
        content: obj.tem + '℃',
        style: {
          fill: '#616161',
          textAlign: 'center'
        },
        offsetY: -15
      });
    });
    chart.line().position('date*tem').color('type', function (type) {
      if (type === '高温') {
        return themeMatch[user.theme]['day'];
      }
      if (type === '低温') {
        return themeMatch[user.theme]['night'];
      }
    }).shape('smooth');

    chart.render();
    // setTimeout(() => {
    //   canvasToImg();
    // }, 300);
  };

  // canvas 换图片，因为canvas层级高，自定义导航栏遮不住
  // const canvasToImg = async () => {
  //   const canvasNode = await getNodeRect('#tmpLine');
  //   const {width, height} = canvasNode;
  //   Taro.canvasToTempFilePath({
  //     x: 0,
  //     y: 0,
  //     width,
  //     height,
  //     canvasId: 'tmpLine',
  //   }).then(res => {
  //     setTmpLineImgPath(res.tempFilePath);
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // };

  return (
    <ScrollView
      className={`daily-forecast theme-${user.theme}`}
      scrollX
      scrollWithAnimation
      style={{height: `${scrollHeight}px`}}
    >

      <View className='h-100-per flex-row flex-start-stretch relative box-hd-x' style={{width: `${scrollWidth}px`}}>
        <Canvas className='tmp-line' canvasId='tmpLine' id='tmpLine'
          style={{
            top: `${scrollHeight / 3}px`,
            width: `${scrollWidth}px`,
            height: `${scrollHeight / 3}px`,
            // left: `9999px`
          }}
        />
        {/*{tmpLineImgPath && <Image className='tmp-line' src={tmpLineImgPath}*/}
          {/*style={{*/}
            {/*top: `${scrollHeight / 3}px`,*/}
            {/*width: `${scrollWidth}px`,*/}
            {/*height: `${scrollHeight / 3}px`*/}
          {/*}}*/}
        {/*/>}*/}
        {daily.map((df, index) => {
          return (
            <View className={`flex-col flex-spa-center w-150 text-center ${index === 0 ? 'bg-gray-100' : ''}`} key={String(index)}>
              <View>
                {index === 0 && <View className={`${location.isDay ? 'day-color' : 'night-color'}`}>今天</View>}
                {index === 1 && <View>明天</View>}
                {index > 1 && <View>{moment(df.date).format('dddd')}</View>}
                <View className='fs-20'>{moment(df.date).format('M月D日')}</View>
              </View>
              <View className='flex-col flex-center'>
                <ComponentIconWeather code={df.code_day} fontSize='fs-60' />
                <View>{df.text_day}</View>
              </View>
              <View className='flex-col flex-spb-center'
                style={{
                  flex: `0 0 ${scrollHeight / 3}px`,
                }}
              >
                {/*<View>{df.tmp_max}℃</View>*/}
                {/*<View>{df.tmp_min}℃</View>*/}
              </View>
              <View className='flex-col flex-center'>
                <ComponentIconWeather code={df.code_night} fontSize='fs-60' isDay={false} />
                <View>{df.text_night}</View>
              </View>
              <View className='fs-24 flex-row flex-center-baseline'>
                {Number(df.wind_scale) && <ComponentIconWindDirection windDirection={df.wind_direction} />}
                {df.wind_scale && <View className='mg-l-4'>{Number(df.wind_scale) ? `${df.wind_scale}级` : '无风'}</View>}
                {!df.wind_scale && <View className='mg-l-4'>未知</View>}
              </View>
              {df.precip && <View className='fs-24 flex-row flex-center-baseline'>
                <View className='iconfont gray-700 mg-r-4 fs-26'>&#xe618;</View>
                <View>降水{df.precip}%</View>
              </View>}
            </View>
          )
        } )}
      </View>
    </ScrollView>
  )
}

DailyForecast.config = {
  navigationBarTitleText: '15天天气趋势预报',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default DailyForecast;
