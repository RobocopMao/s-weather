import Taro, {useEffect} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {useSelector} from '@tarojs/redux';
import './index.scss'
import {setNavStyle} from '../../../../utils'

function DataSource() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  return (
    <View className={`flex-col h-100-per data-source theme-${user.theme}`}>
      <View className='flex-col mg-20'>
        <Text className='fs-36 gray-900'>心知天气</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>大部分天气数据由心知天气提供。</Text>
      </View>
      <View className='flex-col mg-20'>
        <Text className='fs-36 gray-900'>和风天气</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>城市搜索、热门城市、收藏夹里面的实况天气数据由和风天气提供。</Text>
      </View>
      <View className='flex-col mg-20'>
        <Text className='fs-36 gray-900'>腾讯地图</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>定位服务由腾讯地图提供。</Text>
      </View>
      <View className='flex-col mg-20'>
        <Text className='fs-36 gray-900'>微信同声传译</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>语音转文字服务由微信同声传译提供。</Text>
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
