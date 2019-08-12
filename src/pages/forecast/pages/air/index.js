import Taro, {useState, useEffect} from '@tarojs/taro'
import {View, Canvas} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import './index.scss'
import {setNavStyle, useAsyncEffect} from '../../../../utils'

function Air() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [nowAir, setNowAir] = useState({});

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const _nowAir = Taro.getStorageSync('NOW_AIR');
    setNowAir(_nowAir);
  }, []);

  return (
    <View className='air'>
      <View>
        <Canvas className='w-200 h-200' canvasId='nowAirQai' />
        <View></View>
      </View>
    </View>
  )
}

Air.config = {
  navigationBarTitleText: '空气质量详情',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Air;
