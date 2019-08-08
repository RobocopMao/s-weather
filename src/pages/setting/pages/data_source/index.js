import Taro, {useEffect} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {useSelector} from '@tarojs/redux';
import './index.scss'
import {setNavStyle} from '../../../../utils'

function DataSource() {
  const location = useSelector(state => state.location);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay);
  }, []);

  return (
    <View className='flex-col h-100-per data-source'>
      <View className='flex-col mg-20'>
        <Text className='bold black mg-b-10'>心知天气</Text>
        <Text>大部分天气数据由心知天气提供。</Text>
      </View>
      <View className='flex-col mg-20'>
        <Text className='bold black mg-b-10'>和风天气</Text>
        <Text>城市搜索、热门城市、收藏夹里面的实况天气数据由和风天气提供。</Text>
      </View>
      <View className='flex-col mg-20'>
        <Text className='bold black mg-b-10'>腾讯地图</Text>
        <Text>定位服务由腾讯地图提供。</Text>
      </View>
    </View>
  )
}

DataSource.config = {
  navigationBarTitleText: '数据来源',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default DataSource;
