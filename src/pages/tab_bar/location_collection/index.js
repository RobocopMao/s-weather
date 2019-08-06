import Taro, {useEffect, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'

function LocationCollection() {

  return (
    <View className='location-collection'>

    </View>
  )
}

LocationCollection.config = {
  navigationBarTitleText: '地址收藏',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default LocationCollection;
