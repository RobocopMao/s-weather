import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function ComponentIconWeather(props) {
  let {code, fontSize, color} = props;  // 天气现象代码/字体大小class:默认32px/颜色class：默认white
  let isDay = typeof props.isDay !== 'undefined' ? props.isDay : true; // 是否白天,默认白天

  return {
    '0': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c2;</View>,  // 晴（国内城市白天晴）	Sunny
    '1': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8aa;</View>,  // 晴（国内城市夜晚晴）	Clear
    '2': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c2;</View>,  // 晴（国外城市白天晴）	Fair
    '3': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8aa;</View>,  // 晴（国外城市夜晚晴）	Fair
    '4': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b6;</View>,  // 多云	Cloudy 白天
    '5': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8aa;</View>,  // 晴间多云	Partly Cloudy 白天
    '6': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b2;</View>,  // 晴间多云	Partly Cloudy 夜间
    '7': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8aa;</View>,  // 大部多云	Mostly Cloudy 白天
    '8': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b2;</View>,  // 大部多云	Mostly Cloudy 夜间
    '9': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8bc;</View>,  // 阴	Overcast
    '10': isDay ? <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ab;</View>  // 阵雨	Shower 白天
      : <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b0;</View>,  // 阵雨	Shower 夜间
    '11': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ad;</View>,  // 雷阵雨	Thundershower
    '12': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b5;</View>,  // 雷阵雨伴有冰雹	Thundershower with Hail
    '13': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b9;</View>,  // 小雨	Light Rain
    '14': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8bb;</View>,  // 中雨	Moderate Rain
    '15': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8bd;</View>,  // 大雨	Heavy Rain
    '16': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ba;</View>,  // 暴雨	Storm
    '17': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8be;</View>,  // 大暴雨	Heavy Storm
    '18': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8bf;</View>,  // 特大暴雨	Severe Storm
    '19': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ae;</View>,  // 冻雨	Ice Rain
    '20': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8af;</View>,  // 雨夹雪	Sleet
    '21': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c0;</View>,  // 阵雪	Snow Flurry
    '22': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b1;</View>,  // 小雪	Light Snow
    '23': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b8;</View>,  // 中雪	Moderate Snow
    '24': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c3;</View>,  // 大雪	Heavy Snow
    '25': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c4;</View>,  // 暴雪	Snowstorm
    '26': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b4;</View>,  // 浮尘	Dust
    '27': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b7;</View>,  // 扬沙	Sand
    '28': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b3;</View>,  // 沙尘暴	Duststorm
    '29': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8b3;</View>,  // 强沙尘暴	Sandstorm
    '30': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8a9;</View>,  // 雾	Foggy
    '31': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c5;</View>,  // 霾	Haze
    '32': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe646;</View>,  // 风	Windy
    '33': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe646;</View>,  // 大风	Blustery
    '34': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ac;</View>,  // 飓风	Hurricane
    '35': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8ac;</View>,  // 热带风暴	Tropical Storm
    '36': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe672;</View>,  // 龙卷风	Tornado
    '37': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe608;</View>,  // 冷	Cold
    '38': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe8c2;</View>,  // 热	Hot
    '99': <View className={`iconfont ${fontSize ? fontSize : 'fs-32'} ${color ? color : 'white'}`}>&#xe642;</View>,  // 未知	Unknown
  }[code];
}

export default ComponentIconWeather;
