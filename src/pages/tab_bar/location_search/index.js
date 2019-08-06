import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Input, Button, Text} from '@tarojs/components'
import './index.scss'
import {useAsyncEffect} from '../../../utils'
import {getTopCity, findCity} from '../../../apis/function'

function LocationSearch() {
  const [isDay, setIsDay] = useState(true);
  const [topCity, setTopCity] = useState([]);
  const [locationHistory, setLocationHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 设置白天、夜晚主题
  useEffect(() => {
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
    const res = await getTopCity({group:'cn', number: 20});
    setTopCity(res.basic);
  }, []);

  // 搜索输入
  const searchInput = (e) => {
    const {value} = e.detail;
    setInputVal(value.replace(/\s+/g, ''));
  };

  // input change
  const searchInputChange = async (e) => {
    console.log(e);
    setIsSearching(true);
    const res = await findCity({location: inputVal, group: 'cn', number: 20});
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
          LOCATION_SEARCH_HISTORY.push({lat, lon, cityName});
          let len = LOCATION_SEARCH_HISTORY.length;
          if (len > 10) {
            LOCATION_SEARCH_HISTORY.shift();
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

  return (
    <View className='location-search flex-col flex-start-stretch'>
      <View className='flex-row flex-start-stretch h-88 bd-radius-20 mg-20 bd-box search-bar'>
        <View className='flex-row flex-start-stretch item-flg-1 bd-w-1 bd-solid bd-gray-300 bd-radius-20'>
          <Input className='item-flg-1 h-88 pd-l-20 pd-r-20 bd-box lh-88' confirmType='search' value={inputVal} placeholder='请输入查询城市'
            onInput={(e) => searchInput(e)} onChange={(e) => searchInputChange(e)}
          />
          {inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-88-i gray-700' onClick={() => resetInput()}>&#xe87b;</Button>}
          {!inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-88-i gray-700'>&#xe87c;</Button>}
        </View>
      </View>
      {!inputVal && <View className='flex-col mg-20 search-history'>
        <View className={`fs-40 mg-b-20 ${isDay ? 'blue-A700' : 'black'}`}>历史记录</View>
        <View className='flex-row flex-start flex-wrap'>
          {locationHistory.map((history, index) => {
            const {lat, lon, cityName} = history;
            return (
                <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28'
                  hoverClass='btn-hover' key={String(index)} onClick={() => searchWeather({lat, lon, cityName})}
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
        <View className={`fs-40 mg-b-20 ${isDay ? 'blue-A700' : 'black'}`}>热门城市</View>
        <View className='flex-row flex-start flex-wrap'>
          {topCity.map((city, index) => {
            const {lat, lon, location, type} = city;
            return (
              <View className={`item-flb-25per flex-center ${(index + 1) %4 === 1 ? 'pd-r-10' : ((index + 1) % 4 === 0 ? 'pd-l-10' : 'pd-lr-10')}`} key={String(index)}
                onClick={() => searchWeather({lat, lon, cityName: `${location}${type === 'city' ? '市' : ''}`})}
              >
                <Button className='h-56 pd-lr-10 mg-0 mg-b-20 lh-56-i bg-gray-100-i gray-700 fs-28 item-flb-20per' hoverClass='btn-hover'>{location}</Button>
              </View>
            )
          })}
        </View>
      </View>}
      {inputVal && <View className='flex-col mg-20 search-result'>
        <View className={`flex-row flex-start-center fs-40 mg-b-20 ${isDay ? 'blue-A700' : 'black'}`}>
          <View className='mg-r-10'>{isSearching ? '正在搜索': '搜索结果'}</View>
          {isSearching && <View className='spin' />}
        </View>
        <View className='flex-row flex-start flex-wrap'>
          {searchResult.map((result, index) => {
            return (
              <Button className='h-50 pd-lr-10 mg-0 mg-r-20 mg-b-20 lh-50-i bg-gray-100-i gray-700 fs-28'
                hoverClass='btn-hover' key={String(index)} onClick={() => searchWeather({lat: result.lat, lon: result.lon, cityName: `${result.location}${result.type === 'city' ? '市' : ''}`, store: true})}
              >
                { result.admin_area === result.parent_city && <Text>{result.admin_area}{result.type === 'city' ? '市': ''}</Text> }
                { result.admin_area !== result.parent_city && result.parent_city === result.location && <Text>{result.admin_area} {result.parent_city}{result.type === 'city' ? '市': ''}</Text>}
                { result.admin_area !== result.parent_city && result.parent_city !== result.location && <Text>{result.admin_area} {result.parent_city} {result.location}{result.type === 'city' ? '市': ''}</Text>}
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
