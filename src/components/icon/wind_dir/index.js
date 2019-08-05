import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function ComponentIconWindDirection(props) {
  let {windDirection, fontSize, color} = props;  // 风向/字体大小class:默认26px/颜色class：默认white

  let Icon = null;
  switch (windDirection) {
    case '北': {
      Icon = <View className={`iconfont fx-n ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '东': {
      Icon = <View className={`iconfont fx-e ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '南': {
      Icon = <View className={`iconfont fx-s ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '西': {
      Icon = <View className={`iconfont fx-w ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '东北': {
      Icon = <View className={`iconfont fx-en ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '东南': {
      Icon = <View className={`iconfont fx-es ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '西南': {
      Icon = <View className={`iconfont fx-ws ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '西北': {
      Icon = <View className={`iconfont fx-wn ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    case '无持续风向': {
      Icon = <View className={`iconfont fx-nd ${fontSize ? fontSize : 'fs-26'} ${color ? color : 'white'}`}>&#xe754;</View>;
      break;
    }
    default: {
      Icon = null;
    }

  }

  return Icon;
}

export default ComponentIconWindDirection;
