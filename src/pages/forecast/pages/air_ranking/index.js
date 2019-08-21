import Taro, {useState, useEffect} from '@tarojs/taro'
import {Button, Input, View} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import _ from 'lodash/lodash.min'
import './index.scss'
import {setNavStyle, getAqiColor} from '../../../../utils'

function AirRanking() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [aqiRanking, setAqiRanking] = useState([]);
  const [showAqiRanking, setShowAqiRanking] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [initComplete, setInitComplete] = useState(false);

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const AQI_RANKING = Taro.getStorageSync('AQI_RANKING');
    let _aqiRanking = [];
    for (let [, v] of AQI_RANKING.entries()) {
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
      <View className={`search-bar pd-20 ${location.isDay ? 'day-bg' : 'night-bg'}`}>
        <View className='flex-row bd-radius-50 bg-white'>
          <Input className='item-flg-1 h-80 pd-l-20 pd-lr-30 lh-80 ' confirmType='search' value={inputVal} placeholder='请输入城市名称关键字'
                 onInput={_.throttle((e) => searchInput(e), 500, {leading: false, trailing: true})}
          />
          {inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-80-i gray-700 reset-btn' onClick={() => resetInput()}>&#xe87b;</Button>}
        </View>
      </View>
      <View className='flex-col pd-20'>
        {showAqiRanking.map((ranking, index) => {
          const {city, aqi} = ranking;
          return (
            <View className='flex-row flex-spb-center' key={String(index)}>
              <View className='item-flb-60per lh-60'>{city}</View>
              <View className='item-flb-40per lh-60 text-center' style={{color: getAqiColor(aqi)}}>{aqi}</View>
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
