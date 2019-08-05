import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function ComponentBaseNavigation(props) {
  const { statusBarHeight, backgroundColor, color } = props;
  // console.log(props);
  const barStyle = {
    paddingTop: `${statusBarHeight || 20}Px`,
    backgroundColor,
    color,
  };

  return (
    <View className='navigation'>
      <View className='bar' style={barStyle}>
        {props.children}
      </View>
      <View className='placeholder' style={barStyle} />
    </View>
  )
}

export default ComponentBaseNavigation
