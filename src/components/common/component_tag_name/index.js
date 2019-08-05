import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'

@withWeapp('Component')
class _C extends Taro.Component {
  config = {
    component: true
  }

  render() {
    return (
      <View className='wrapper'>
        <Image
          className='userinfo-avatar skeleton-radius'
          src='https://sfault-image.b0.upaiyun.com/117/579/1175792133-5b63fce811636_articlex'
          mode='cover'
        />
        <View>
          <Text className='skeleton-rect'>这里是组件的内部节点</Text>
        </View>
        <View>
          <Text className='skeleton-rect'>这里是组件的内部节点</Text>
        </View>
      </View>
    )
  }
}

export default _C
