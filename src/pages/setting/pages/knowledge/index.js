import Taro, {useEffect} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'
import windDirImg from '../../../../assets/images/wind_dir.jpg'
import windGrade from '../../../../assets/json/wind_grade.json'
import aqiJson from '../../../../assets/json/aqi.json'

function Knowledge() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  return (
    <View className={`knowledge theme-${user.theme}`}>
      {/*风向对照图*/}
      <View className='flex-col mg-20'>
        <Text className='fs-36 gray-900'>风向对照图</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>风向角度，范围0~360，0为正北，90为正东，180为正南，270为正西。</Text>
        <Image className='w-500 h-500 mg-tb-20 item-als-center' src={windDirImg} />
        <Text>风向中文表达只取常用的8方位，即东，东南，南，西南，西，西北，北。其他语言的表达，会取16方位的简称，如英文中的E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW, N等。</Text>
      </View>
      {/*风力等级表*/}
      <View className='flex-col mg-20 mg-t-40'>
        <Text className='fs-36 gray-900'>风力等级表</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <Text>风力是指风吹到物体上所表现出的力量的大小。一般根据风吹到地面或水面的物体上所产生的各种现象，把风力的大小分为18个等级，最小是0级，最大为17级。中国气象局于2001年下发《台风业务和服务规定》，以蒲福风力等级将12级以上台风补充到17级。12级台风定为 32.4-36.9米/秒；13级为37.0-41.4米/秒；14级为41.5-46.1米/秒，15级为46.2-50.9米/秒，16级为51.0-56.0米/秒，17级为56.1-61.2米/秒。琼海30年前那场台风，中心附近最大风力为73米/秒，已超过17级的最高标准。称之为18级，也是国际航海界关于特大台风的普遍说法。</Text>
        <Text className='gray-900 mg-tb-20'>风力等级对照表:</Text>
        <View>
          <View className='flex-row flex-spb-center bg-gray-200 pd-tb-10 text-center'>
            <View className='item-flg-0 item-fls-0 item-flb-30per'>风级</View>
            <View className='item-flg-0 item-fls-0 item-flb-30per'>名称</View>
            <View className='item-flg-0 item-fls-0 item-flb-40per'>风速(m/s)</View>
          </View>
          {windGrade.map((wind, index) => {
            const {windScale, name, min, max} = wind;
            return (
              <View className='flex-row flex-spb-center pd-tb-10 text-center' key={String(index)}>
                <View className='item-flg-0 item-fls-0 item-flb-30per'>{windScale}</View>
                <View className='item-flg-0 item-fls-0 item-flb-30per'>{name}</View>
                <View className='item-flg-0 item-fls-0 item-flb-40per'>{windScale === '17+' ? `>${min}` : `${min}-${max}`}</View>
              </View>
            )
          })}
          <View className='h-line-gray-300' />
        </View>
        <Text className='gray-900 mg-tb-20'>说明：</Text>
        <Text>· 本表所列风速是指平地上离地10米处的风速值。</Text>
        <Text>· 超级台风（super typhoon）为美国对顶级强度台风的称谓。</Text>
      </View>
      {/*空气质量指数*/}
      <View className='flex-col mg-20 mg-t-40'>
        <Text className='fs-36 gray-900'>空气质量指数等级表</Text>
        <View className='h-line-gray-300 mg-tb-20' />
        <View>
          <View className='flex-row flex-spb-center bg-gray-200 pd-tb-10 text-center'>
            <View className='item-flg-0 item-fls-0 item-flb-25per item-als-center'>空气质量指数AQI</View>
            <View className='item-flg-0 item-fls-0 item-flb-20per item-als-center'>AQI级别</View>
            <View className='item-flg-0 item-fls-0 item-flb-30per item-als-center'>AQI文字描述</View>
            <View className='item-flg-0 item-fls-0 item-flb-25per item-als-center'>颜色</View>
          </View>
          {aqiJson.map((aqi, index) => {
            const {minAqi, maxAqi, level, aqiName, colorName, color} = aqi;
            return (
              <View className='flex-row flex-spb-center pd-tb-10 text-center' key={String(index)} style={{color}}>
                {minAqi === 0 && <View className='item-flg-0 item-fls-0 item-flb-25per'>{minAqi}-{maxAqi}</View>}
                {minAqi > 0 && maxAqi <= 300 && <View className='item-flg-0 item-fls-0 item-flb-25per'>{minAqi + 1}-{maxAqi}</View>}
                {minAqi >= 300 && <View className='item-flg-0 item-fls-0 item-flb-25per'>{`>300`}</View>}
                <View className='item-flg-0 item-fls-0 item-flb-20per'>{level}</View>
                <View className='item-flg-0 item-fls-0 item-flb-30per'>{aqiName}</View>
                <View className='item-flg-0 item-fls-0 item-flb-25per'>{colorName}</View>
              </View>
            )
          })}
          <View className='h-line-gray-300' />
        </View>
      </View>
    </View>
  )
}

Knowledge.config = {
  navigationBarTitleText: '气象知识',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Knowledge;
