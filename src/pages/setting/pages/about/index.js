import Taro, {useEffect} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'
import weatherLogoImg from '../../../../assets/images/weather_logo.png'

function About() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  return (
    <View className={`flex-col flex-center h-100-per about them-${user.theme}`}>
      <Image className='w-144 h-144' src={weatherLogoImg} />
      <View className='fs-36 mg-tb-30'>天气晴报</View>
      <View className='fs-26 gray-500'>版本：1.4.20190816</View>
    </View>
  )
}

About.config = {
  navigationBarTitleText: '关于',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default About;
