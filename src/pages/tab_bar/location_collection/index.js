import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import _ from 'lodash'
import './index.scss'
import ComponentIconWindDirection from '../../../components/icon/wind_dir';
import {useAsyncEffect} from '../../../utils';
import {getHFWeatherNow} from '../../../apis/weather';

function LocationCollection() {
  const [isDay, setIsDay] = useState(true);
  const [collectedCity, setCollectedCity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    // let COLLECTED_CITY = Taro.getStorageSync('COLLECTED_CITY');
    // console.log(COLLECTED_CITY);
    // if (COLLECTED_CITY) {
    //   console.log(COLLECTED_CITY);
    //   setCollectedCity(COLLECTED_CITY);
    //   console.log(collectedCity);
    // }
  }, []);

  useAsyncEffect(async () => {
    let COLLECTED_CITY = Taro.getStorageSync('COLLECTED_CITY');
    if (COLLECTED_CITY) {
      let arr = [];
      let wrapped = _(COLLECTED_CITY);
      forRequest(wrapped, arr);
    }
  }, []);

  // 循环发送请求
  const forRequest = async (wrapped, arr) => {
    let result = wrapped.next();
    // console.log(result.done);
    // console.log(result.value);
    if (result.done && result.value === undefined) {
      // console.log(arr);
      // setCollectedCity(arr);  // 在这里设置空白后，整屏加载渲染
      return false;
    }
    if (!result.done) {
      let res = await getHFWeatherNow({weatherType: 'now', params: {location: `${result.value.lon},${result.value.lat}`}});
      let v = Object.assign({}, result.value, res.now);
      arr.push(v);
    }
    setCollectedCity(arr); // 在这里每次设置可以看出加载变化
    forRequest(wrapped, arr);
  };

  // 跳转回首页刷新天气
  const searchWeather = ({lat, lon, cityName}) => {
    if (isEditing) {
      return;
    }
    const eventChannel = this.$scope.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromLocationCollection', {lat, lon, cityName});  // 触发事件
    Taro.navigateBack(1);
  };

  // 编辑收藏
  const editCollection = () => {
    setIsEditing(true);
  };

  // 编辑收藏
  const confirmEdit = () => {
    setIsEditing(false);
  };

  // 删除收藏
  const deleteCollection = (city, e) => {
    e.stopPropagation();
    const {lat, lon, cityName} = city;
    let _collectedCity = collectedCity;
    let index = _collectedCity.findIndex((v, i, arr) => {
      return v.lat === lat && v.lon === lon && v.cityName === cityName;
    });

    _collectedCity.splice(index, 1);
    setCollectedCity(_collectedCity);
    Taro.setStorageSync('COLLECTED_CITY', _collectedCity);
  };

  // 置顶收藏
  const topCollection = (city, e) => {
    e.stopPropagation();
    const {lat, lon, cityName} = city;
    let _collectedCity = collectedCity;
    let topCity = _collectedCity.find((v, i, arr) => {
      return v.lat === lat && v.lon === lon && v.cityName === cityName;
    });

    let index = _collectedCity.findIndex((v, i, arr) => {
      return v.lat === lat && v.lon === lon && v.cityName === cityName;
    });

    _collectedCity.splice(index, 1);
    _collectedCity.unshift(topCity);
    setCollectedCity(_collectedCity);
    Taro.setStorageSync('COLLECTED_CITY', _collectedCity);
  };

  return (
    <View className='flex-row flex-wrap location-collection white box-hd-x'>
      {collectedCity.map((city, index) => {
        const {active, cityName, tmp, cond_txt, wind_dir, wind_sc, hum, lat, lon} = city;
        return (
          <View className={`item-flb-50per flex-row flex-center mg-t-20 ${isEditing ? 'shake' : ''}`} key={String(index)}>
            <View className={`flex-col flex-spb-start pd-24 bg-gray-800 relative bd-radius-20 item-flg-1 ${isEditing ? 'bd-dashed' : ''} ${index % 2 === 0 ? 'mg-r-10 mg-l-20' : 'mg-l-10 mg-r-20'} ${isDay ? (active ? 'bg-gray-800' : 'bg-blue-A700') : (active ? 'bg-blue-A700' : 'bg-gray-800')}`}
              onClick={() => searchWeather({lat, lon, cityName})}
              onLongPress={() => editCollection()}
            >
              <View className=''>
                <Text className='fs-50'>{tmp}</Text>
                <Text className=''>℃</Text>
                <Text className='mg-l-10'>{cond_txt}</Text>
              </View>
              <View className='flex-row flex-start-center mg-tb-20'>
                <View className='flex-row flex-start-baseline'>
                  <ComponentIconWindDirection windDirection={wind_dir.replace(/风$/, '')} />
                  <View>{wind_sc}级</View>
                </View>
                <View className='mg-l-10 mg-r-10 h-28 v-line-white' />
                <View className='flex-row flex-start-baseline'>
                  <View className='iconfont white mg-r-4 fs-28'>&#xe600;</View>
                  <View className=''>湿度 {hum}%</View>
                </View>
              </View>
              <View className='fs-26'>{cityName}</View>

              {isEditing && <Button className='iconfont fs-50 mg-0 pd-0 h-50 w-50 icon-btn red-A700 del-icon' hoverClass='icon-btn-hover' onClick={(e) => deleteCollection(city, e)}>&#xe87b;</Button>}{/**删除**/}
              {isEditing && <Button className='iconfont fs-44 mg-0 pd-0 h-44 w-50 icon-btn white top-icon' hoverClass='icon-btn-hover' onClick={(e) => topCollection(city ,e)}>&#xe75a;</Button>}{/**置顶**/}
            </View>
          </View>
        )
      })}
      {isEditing && <View className='h-120 w-100-per' />}
      {isEditing && <View className='flex-row flex-spb-center h-100 bg-gray-200 pd-lr-20 bd-box edit-bar'>
        {/*<Button className='iconfont fs-88 mg-0 mg-t-6 pd-0 h-88 w-88 icon-btn red-A700' hoverClass='icon-btn-hover' onClick={() => cancelEdit()}>&#xe87b;</Button>/!**取消**!/*/}
        <Text className='lh-100 gray-700'>您正在时时编辑，点击右侧按钮退出</Text>
        <Button className='iconfont fs-88 mg-0 mg-t-6 pd-0 h-88 w-88 icon-btn green-A700' hoverClass='icon-btn-hover' onClick={() => confirmEdit()}>&#xe873;</Button>{/**完成**/}
      </View>}
    </View>
  )
}

LocationCollection.config = {
  navigationBarTitleText: '城市收藏夹',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default LocationCollection;
