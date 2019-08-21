import Taro, {useState, useEffect} from '@tarojs/taro'
import {Button, Input, View} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import _ from 'lodash/lodash.min'
import './index.scss'
import {setNavStyle, getAqiColor} from '../../../../utils'
import {getAirRanking} from "../../../../apis/air";

function AirRanking() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [aqiRanking, setAqiRanking] = useState([]);
  const [showAqiRanking, setShowAqiRanking] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [initComplete, setInitComplete] = useState(false);

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    let aqiRankingData = [];
    if (this.$router.params.from) {  // 来自分享
      const {results} = await getAirRanking(); // 去请求
      aqiRankingData = results;
    } else { // 来自前一个页面
      aqiRankingData = Taro.getStorageSync('AQI_RANKING'); // 用缓存
    }

    let _aqiRanking = [];
    for (let [, v] of aqiRankingData.entries()) {
      let cityArr = [...new Set(v.location.path.split(','))].reverse();
      cityArr.shift();
      let city = cityArr.join(' ');
      let obj = {city, aqi: v.aqi};
      _aqiRanking.push(obj);
    }

    setAqiRanking(_aqiRanking);
    setShowAqiRanking(_aqiRanking);
    setInitComplete(true);
  }, []);

  // 显示转发按钮
  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    });
    onShareAppMessage();
  }, [aqiRanking]);

  // 分享的事件
  const onShareAppMessage = () => {
    this.$scope.onShareAppMessage = (res) => {
      return {
        title: `${aqiRanking[0].city.split(' ').reverse()[0]}AQI高居榜首,不服来PK`,
        path: `/pages/forecast/pages/air_ranking/index?from=SHARE`,
      }
    };
  };

  const searchInput = (e) => {
    const {value} = e.detail;

    if (value.replace(/\s+/g, '').length === 0) {  // 排除空字符串
      setShowAqiRanking(aqiRanking);
      setInputVal('');
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
      // Taro.showToast({title: '请输入地区名称', icon: 'none'});
      return;
    }

    const filterList = aqiRanking.filter((val, index, arr) => {
      const _value = value.replace(/\s+/g, '');
      const reg = new RegExp(_value);
      return reg.test(val.city);
    });

    setShowAqiRanking(filterList);
    setInputVal(value);
  };

  const resetInput = () => {
    setInputVal('');
    setShowAqiRanking(aqiRanking);
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  };

  return (
    <View className={`air-ranking theme-${user.theme}`}>
      <View className='top-bar'>
        <View className={`pd-20 ${location.isDay ? 'day-bg' : 'night-bg'}`}>
          <View className='flex-row bd-radius-50 bg-white'>
            <Input className='item-flg-1 h-80 pd-l-20 pd-lr-30 lh-80 ' confirmType='search' value={inputVal} placeholder='请输入城市名称关键字'
                   onInput={_.throttle((e) => searchInput(e), 500, {leading: false, trailing: true})}
            />
            {inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-80-i gray-700 reset-btn' onClick={() => resetInput()}>&#xe87b;</Button>}
          </View>
        </View>
        <View className='flex-row flex-spb-center fs-32 gray-900 pd-tb-4 pd-lr-20 bg-white'>
          <View className='item-flb-20per lh-60'>排行</View>
          <View className='item-flb-50per lh-60'>城市名</View>
          <View className='item-flb-30per lh-60 text-center'>AQI</View>
        </View>
        <View className='h-line-gray-300 mg-b-10' />
      </View>
      <View className='flex-col pd-lr-20 pd-b-20'>
        {showAqiRanking.map((ranking, index) => {
          const {city, aqi} = ranking;
          return (
            <View className='flex-row flex-spb-center' key={String(index)}>
              <View className='item-flb-20per lh-60'>{index + 1}</View>
              <View className='item-flb-50per lh-60'>{city}</View>
              <View className='item-flb-30per lh-60 text-center' style={{color: getAqiColor(aqi)}}>{aqi}</View>
            </View>
          )
        })}
        {!showAqiRanking.length && initComplete && <View className='flex-row flex-center lh-60 text-center'>
          <View>没有查询到您的城市</View>
          <View className='iconfont fs-36 mg-l-10'>&#xe606;</View>
        </View>}
      </View>
    </View>
  )
}

AirRanking.config = {
  navigationBarTitleText: '全国城市AQI排行榜',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default AirRanking;
