import Taro, {useEffect, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'

function Setting() {

  return (
    <View className='setting'></View>
  )
}

Setting.config = {
  navigationBarTitleText: '设置',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Setting;
