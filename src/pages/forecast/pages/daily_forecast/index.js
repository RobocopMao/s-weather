import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, ScrollView, Canvas} from '@tarojs/components'
import moment from 'moment'
import _ from 'lodash'
import './index.scss'
import {useAsyncEffect} from '../../../../utils'
import {getWeatherDaily} from '../../../../apis/weather'
import ComponentIconWeather from '../../../../components/icon/weather';
import ComponentIconWindDirection from '../../../../components/icon/wind_dir';


function DailyForecast() {
  const [daily, setDaily] = useState([]);
  const [isDay, setIsDay] = useState(true);
  const [scrollHeight, setScrollHeight] = useState(0); // 可使用窗口高度
  const [scrollWidth, setScrollWidth] = useState(0); // 可使用窗口高度
  const [windowWidth, setWindowWidth] = useState(0); // 可使用窗口高度

  // 15日预报
  useAsyncEffect(async () => {
    let {lon, lat} = this.$router.params;
    // console.log(this);
    let _isDay = this.$router.params.isDay === 'true';
    setIsDay(_isDay);
    if (_isDay) {
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

    const res = await getWeatherDaily({location: `${lat}:${lon}`, days: 15});
    // console.log(res);
    const {daily} = res;
    setDaily(daily);
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
  }, [scrollHeight, scrollWidth, daily]);

  //画图
  const drawTmpLine = () => {
    let tmpMax = [],  // 高温
        tmpMin = [];  // 低温
    for (let [, v] of daily.entries()) {
      // console.log(v,i);
      tmpMax.push(Number(v.high));
      tmpMin.push(Number(v.low));
    }
    let maxTmp = _.max(tmpMax) + 5; // 最高温
    let minTmp = _.min(tmpMin) - 5; // 最低温
    let tmpRange = maxTmp - minTmp;
    // console.log(tmpMax, tmpMin, maxTmp, minTmp, tmpRange);
    let distance= Math.floor((scrollHeight / 3)  / tmpRange);
    let windowW1_5 = windowWidth / 5;

    let ctx = Taro.createCanvasContext('tmpLine', this.$scope);
    // console.log(ctx);
    ctx.save();

    // 画高温线
    ctx.strokeStyle = '#FFD600';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineCap('round');
    for (let [i, v] of tmpMax.entries()) {
      let drawX = i * windowW1_5 + (windowW1_5 / 2);
      let drawY = (maxTmp - v) * distance;
      //console.log(drawX, drawY);
      if (i === 0){
        ctx.moveTo(drawX, drawY);
        ctx.setFontSize(12);
        ctx.fillStyle ='#6e6e6e';
        ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
      } else {
        ctx.lineTo(drawX, drawY);
        ctx.fillStyle ='#6e6e6e';
        ctx.fillText(`${v}℃`, drawX - 10, drawY - 5);
      }
    }
    ctx.stroke();

    // 画低温线
    ctx.restore();
    ctx.strokeStyle = '#2962FF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.setLineCap('round');
    for (let [i, v] of tmpMin.entries()) {
      let drawX = i * windowW1_5 + (windowW1_5 / 2);
      let drawY = (scrollHeight / 3) - (v - minTmp) * distance;
      // console.log(drawX, drawY);
      if (i === 0){
        ctx.moveTo(drawX, drawY);
        ctx.setFontSize(12);
        ctx.fillStyle ='#6e6e6e';
        ctx.fillText(`${v}℃`, drawX - 10, drawY + 15);
      } else {
        ctx.lineTo(drawX, drawY);
        ctx.fillStyle ='#6e6e6e';
        ctx.fillText(`${v}℃`, drawX - 10, drawY + 15);
      }
    }
    ctx.stroke();

    ctx.draw();
  };

  return (
    <ScrollView
      className='daily-forecast'
      scrollX
      scrollWithAnimation
      style={{height: `${scrollHeight}px`}}
    >

      <View className='h-100-per flex-row flex-start-stretch' style={{width: `${scrollWidth}px`}}>
        <Canvas className='tmp-line' canvasId='tmpLine'
          style={{
            top: `${scrollHeight / 3}px`,
            width: `${scrollWidth}px`,
            height: `${scrollHeight / 3}px`
          }}
        />
        {daily.map((df, index) => {
          return (
            <View className={`flex-col flex-spa-center w-150 text-center ${index === 0 ? 'bg-gray-100' : ''}`} key={String(index)}>
              <View>
                {index === 0 && <View className='blue-A700'>今天</View>}
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
                <ComponentIconWindDirection windDirection={df.wind_direction} />
                {df.wind_scale && <View className='mg-l-4'>{`${df.wind_scale}级`}</View>}
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
