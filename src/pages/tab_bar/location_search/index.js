import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Input, Button, Text} from '@tarojs/components'
import _ from 'lodash'
import moment from 'moment'
import {useSelector} from '@tarojs/redux';
import './index.scss'
import {setNavStyle, useAsyncEffect} from '../../../utils'
import {getTopCity, findCity} from '../../../apis/function'

function LocationSearch() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [topCity, setTopCity] = useState([]);
  const [locationHistory, setLocationHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 读取缓存的搜索历史记录
  useEffect(() => {
    let _locationHistory = Taro.getStorageSync('LOCATION_SEARCH_HISTORY');
    if (_locationHistory) {
      setLocationHistory(_locationHistory);
    }
  }, []);

  // 初始化数据
  useAsyncEffect(async () => {
    const _topCity = Taro.getStorageSync('TOP_CITY');
    if (_topCity) {  // 已缓存
      if (_topCity.date === moment().format('YYYY-MM-DD')) {  // 当日用缓存
        setTopCity(_topCity.cities);
      } else { // 不是当天，更新缓存
        _getTopCity();
      }
    } else {
      _getTopCity();
    }
  }, []);

  // 获取热门城市并设置
  const _getTopCity = async () => {
    const res = await getTopCity({group:'cn', number: 20});
    const {basic} = res;
    let TOP_CITY = {
      date: moment().format('YYYY-MM-DD'),
      cities: basic
    };
    setTopCity(basic);
    Taro.setStorageSync('TOP_CITY', TOP_CITY);
  };

  // 搜索输入
  const searchInput = (e) => {
    const {value} = e.detail;
    setInputVal(value.replace(/\s+/g, ''));
  };

  // input change
  const searchInputChange = async (e) => {
    // console.log(e);
    const {value} = e.detail;
    setIsSearching(true);
    const res = await findCity({location: value, group: 'cn', number: 20});
    setSearchResult(res.basic || []);
    setIsSearching(false);
  };

  // 重置input
  const resetInput = () => {
    setInputVal('');
  };

  // 清空历史记录
  const clearSearchHistory = () => {
    Taro.removeStorageSync('LOCATION_SEARCH_HISTORY');
    setLocationHistory([]);
  };

  // 跳转回首页刷新天气
  const searchWeather = ({lat, lon, cityName, store = false}) => {
    if (store) {  // 需要存储在本地
      let LOCATION_SEARCH_HISTORY = Taro.getStorageSync('LOCATION_SEARCH_HISTORY');
      if (LOCATION_SEARCH_HISTORY) {  // 已经存在缓存
        let findExit = LOCATION_SEARCH_HISTORY.find((v, k, arr) => {
          return v.lat === lat && v.lon === lon && v.cityName === cityName;
        });
        if (!findExit) {
          LOCATION_SEARCH_HISTORY.unshift({lat, lon, cityName});
          let len = LOCATION_SEARCH_HISTORY.length;
          if (len > 10) {
            LOCATION_SEARCH_HISTORY.pop();
          }
          Taro.setStorageSync('LOCATION_SEARCH_HISTORY', LOCATION_SEARCH_HISTORY);
        }
      } else {  // 不存在缓存
        Taro.setStorageSync('LOCATION_SEARCH_HISTORY', [{lat, lon, cityName}]);
      }
    }
    const eventChannel = this.$scope.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromLocationSearch', {lat, lon, cityName});  // 触发事件
    Taro.navigateBack(1);
  };

  // 收藏地址
  const collectCity = ({lat, lon, cityName}) => {
    let COLLECTED_CITY =  Taro.getStorageSync('COLLECTED_CITY');
    let len = COLLECTED_CITY.length;
    if (len === 10) {  // 目前设定只能收藏10个
      Taro.showToast({title: '您的10个收藏权限已经用满了，请到收藏夹删除后再收藏', icon: 'none'});
      return;
    }
    if (COLLECTED_CITY) { // 已经建立缓存
      let findExit = COLLECTED_CITY.find((v, k, arr) => {
        return v.lat === lat && v.lon === lon && v.cityName === cityName;
      });
      if (!findExit) {
        COLLECTED_CITY.unshift({lat, lon, cityName, active: false});
        Taro.setStorageSync('COLLECTED_CITY', COLLECTED_CITY);
        Taro.showToast({title: '已收藏', icon: 'none'});
      } else {
        Taro.showToast({title: '该城市已经收藏过', icon: 'none'});
      }
    } else {
      Taro.setStorageSync('COLLECTED_CITY', [{lat, lon, cityName, active: false}]);
      Taro.showToast({title: '已收藏', icon: 'none'});
    }
  };

  /**
   * 格式化地址
   * @param city
   * @param _type： 1-长地址：四川省成都市、北京市朝阳；2-短地址：成都市、朝阳
   * @returns {string}
   */
  const formatSearchLocation = (city, _type) => {
    const {parent_city, admin_area, type} = city;
    const location1 = city.location;
    let addr = '';
    let _location = ''; // 比如成都，带个市字
    if (admin_area === parent_city) {
      if (parent_city === location1) { // 直辖市-北京市
        addr = `${admin_area}${type === 'city' && location1 !== '香港' && location1 !== '澳门' ? '市': ''}`;
        _location = `${addr}`;
      } else { // 直辖市下面的区县-北京市朝阳
        addr = `${parent_city}${type === 'city' && parent_city !== '香港' && parent_city !== '澳门' ? '市': ''} ${location1}`;
        _location = location1;
      }
    } else {
      if (parent_city === location1) { // 省市-四川省成都市
        addr = `${admin_area} ${parent_city}${type === 'city' && location1 !== '香港' && location1 !== '澳门' ? '市': ''}`;
        _location = `${parent_city}`;
      } else { // 省市区-四川省成都市青羊区
        addr = `${admin_area} ${parent_city}市 ${location1}`;
        _location = location1;
      }
    }

    if (_type === 1) {
      return addr;
    } else {
      return _location;
    }
  };

  return (
    <View className={`location-search flex-col flex-start-stretch theme-${user.theme}`}>
      <View className='flex-row flex-start-stretch h-88 bd-radius-20 mg-20 bd-box search-bar'>
        <View className='flex-row flex-start-stretch item-flg-1 bd-w-1 bd-solid bd-gray-300 bd-radius-20'>
          <Input className='item-flg-1 h-88 pd-l-20 pd-r-20 bd-box lh-88' confirmType='search' value={inputVal} placeholder='请输入查询城市'
            onInput={_.throttle((e) => searchInput(e), 500, {leading: false, trailing: true})} onChange={(e) => searchInputChange(e)}
          />
          {inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-88-i gray-700' onClick={() => resetInput()}>&#xe87b;</Button>}
          {!inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-88-i gray-700'>&#xe87c;</Button>}
        </View>
      </View>
      {!inputVal && <View className='flex-col mg-20 search-history'>
        <View className={`fs-40 mg-b-20 ${location.isDay ? 'day-color' : 'night-color'}`}>历史记录</View>
        <View className='flex-row flex-start flex-wrap'>
          {locationHistory.map((history, index) => {
            const {lat, lon, cityName} = history;
            return (
                <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28'
                  hoverClass='btn-hover' key={String(index)} onClick={() => searchWeather({lat, lon, cityName})}
                  onLongPress={() => collectCity({lat, lon, cityName})}
                >{cityName}</Button>
              )
          })}
          <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28' hoverClass='btn-hover'
            onClick={() => clearSearchHistory()}
          >
            {locationHistory.length ? '清空历史记录' : '暂无搜索历史'}
          </Button>
        </View>
      </View>}
      {!inputVal && <View className='flex-col mg-20 top-city'>
        <View className={`fs-40 mg-b-20 ${location.isDay ? 'day-color' : 'night-color'}`}>热门城市</View>
        <View className='flex-row flex-start flex-wrap'>
          {topCity.map((city, index) => {
            const {lat, lon, type} = city;
            let _location = city.location;
            return (
              <View className={`item-flb-25per flex-center ${(index + 1) %4 === 1 ? 'pd-r-10' : ((index + 1) % 4 === 0 ? 'pd-l-10' : 'pd-lr-10')}`} key={String(index)}
                onClick={() => searchWeather({lat, lon, cityName: `${_location}${type === 'city' ? '市' : ''}`})}
                onLongPress={() => collectCity({lat, lon, cityName: `${_location}${type === 'city' ? '市' : ''}`})}
              >
                <Button className='h-56 pd-lr-10 mg-0 mg-b-20 lh-56-i bg-gray-100-i gray-700 fs-28 item-flb-20per' hoverClass='btn-hover'>{_location}</Button>
              </View>
            )
          })}
        </View>
        <View className='mg-t-50 fs-26 gray-400 text-center' style={{textDecoration: 'underline'}}>小提示：长按历史记录城市和热门城市可以添加到收藏夹</View>
      </View>}
      {inputVal && <View className='flex-col mg-20 search-result'>
        <View className={`flex-row flex-start-center fs-40 mg-b-20 ${location.isDay ? 'blue-A700' : 'black'}`}>
          <View className='mg-r-10'>{isSearching ? '正在搜索': '搜索结果'}</View>
          {isSearching && <View className='spin' />}
        </View>
        <View className='flex-row flex-start flex-wrap'>
          {searchResult.map((result, index) => {
            return (
              <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28'
                hoverClass='btn-hover' key={String(index)} onClick={() => searchWeather({lat: result.lat, lon: result.lon, cityName: formatSearchLocation(result,2), store: true})}
              >
                <Text>{formatSearchLocation(result, 1)}</Text>
              </Button>
            )
          })}
          {!isSearching && !searchResult.length && <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28' hoverClass='btn-hover'>无搜索结果</Button>}
        </View>
      </View>}
    </View>
  )
}

LocationSearch.config = {
  navigationBarTitleText: '城市搜索',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default LocationSearch;
