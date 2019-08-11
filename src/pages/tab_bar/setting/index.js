import Taro, {useEffect} from '@tarojs/taro'
import {View, OpenData} from '@tarojs/components'
import {useSelector} from '@tarojs/redux';
import './index.scss'
import {setNavStyle} from '../../../utils';
import {S_TOOLS_APPID} from '../../../apis/config';

function Setting() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 打开授权
  const openSetting = () => {
    Taro.openSetting();
  };

  // 设置主题
  const goTheme = () => {
    Taro.navigateTo({url: `../../setting/pages/theme/index`})
  };

  // 去数据来源页面
  const goDataSource = () => {
    Taro.navigateTo({url: `../../setting/pages/data_source/index`})
  };

  // 去气象知识页面
  const goKnowledge = () => {
    Taro.navigateTo({url: `../../setting/pages/knowledge/index`})
  };

  // 去小工具S小程序
  const goStoolsMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: S_TOOLS_APPID});
  };

  // 去关于页面
  const goAbout = () => {
    Taro.navigateTo({url: `../../setting/pages/about/index`})
  };

  return (
    <View className={`flex-col flex-start-center h-100-per bg-gray-100 setting theme-${user.theme}`}>
      <View className={`w-100-per h-300 box-hd relative ${location.isDay ? 'day-bg' : 'night-bg'}`}>
        <View className='flex-col flex-start-center bg-transparent avatar-box'>
          <View className='circle w-144 h-144 box-hd avatar'>
            <OpenData type='userAvatarUrl' />
          </View>
          <View className='fs-40 text-center'>
            <OpenData type='userNickName' />
          </View>
        </View>
        <View className='relative bg-gray-100 h-144 half-circle' />
      </View>
      <View className='flex-col flex-start-stretch w-100-per pd-tb-50 pd-lr-20 bd-box'>
        <View className='bd-radius-20 pd-lr-20 mg-b-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => openSetting()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe872;</View>
              <View>授权管理</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goTheme()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe607;</View>
              <View>主题设置</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 mg-b-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goKnowledge()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe601;</View>
              <View>气象知识</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goDataSource()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe603;</View>
              <View>数据来源</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goStoolsMiniProgram()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe87c;</View>
              <View>其他查询</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goAbout()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe654;</View>
              <View>关于</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>
      </View>
    </View>
  )
}

Setting.config = {
  navigationBarTitleText: '关于与设置',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Setting;
