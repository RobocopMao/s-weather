import Taro, {useState, useEffect} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import moment from 'moment'
import './index.scss'
import {setNavStyle} from '../../../../utils'

function Alarm() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [alarms, setAlarms] = useState([]);

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);

    const _alarms = Taro.getStorageSync('ALARMS');
    setAlarms(_alarms);
  }, []);

  return (
    <View className='alarm'>
      {alarms.map((alarm, index) => {
        const {type, level, title, description, pub_date} = alarm;
        return (
            <View className='flex-col pd-20 mg-b-20' key={String(index)}>
              <View className='flex-row flex-spb-center'>
                {level === '蓝色' && <View className='bold fs-32 blue-A700'>{type}{level}预警</View>}
                {level === '黄色' && <View className='bold fs-32 yellow-A700'>{type}{level}预警</View>}
                {level === '橙色' && <View className='bold fs-32 orange-A700'>{type}{level}预警</View>}
                {level === '红色' && <View className='bold fs-32 red-A700'>{type}{level}预警</View>}
                {level === '白色' && <View className='bold fs-32'>{type}{level}预警</View>}
                <View>{moment(pub_date).format('M月D日 HH:mm')}</View>
              </View>
              <View className='h-line-gray-300 mg-tb-20' />
              <View className='mg-b-10 fs-30'>{title}</View>
              <View>{description}</View>
            </View>
          )
      })}
    </View>
  )
}

Alarm.config = {
  navigationBarTitleText: '预警详情',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Alarm;
