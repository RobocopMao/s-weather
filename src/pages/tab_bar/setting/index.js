import Taro, {useEffect, useState} from '@tarojs/taro'
import {View, OpenData} from '@tarojs/components'
import './index.scss'

function Setting() {
  const [isDay, setIsDay] = useState(true);

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

  // 打开授权
  const openSetting = () => {
    Taro.openSetting();
  };

  // 去小工具S小程序
  const goStoolsMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: 'wx2269fb8c2e106c9c'});
  };

  return (
    <View className='flex-col flex-start-center h-100-per bg-gray-100 setting'>
      <View className={`w-100-per h-300 box-hd relative ${isDay ? 'bg-blue-A700' : 'bg-black'}`}>
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
              <View className='iconfont mg-r-10'>&#xe872;</View>
              <View>授权管理</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30'>
            <View className='flex-row flex-start-baseline'>
              <View className='iconfont mg-r-10'>&#xe603;</View>
              <View>数据来源</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 mg-b-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30'>
            <View className='flex-row flex-start-baseline'>
              <View className='iconfont mg-r-10'>&#xe601;</View>
              <View>知识百科</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goStoolsMiniProgram()}>
            <View className='flex-row flex-start-baseline'>
              <View className='iconfont mg-r-10'>&#xe87c;</View>
              <View>其他查询</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30'>
            <View className='flex-row flex-start-baseline'>
              <View className='iconfont mg-r-10'>&#xe654;</View>
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
