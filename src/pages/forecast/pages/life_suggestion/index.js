import Taro, {useEffect} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'

function LifeSuggestion() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  const lifeSuggestion = [
    {type: 'ac', name: '空调开启指数'},
    {type: 'air_pollution', name:'空气污染扩散条件指数'},
    {type: 'airing', name:'晾晒指数'},
    {type: 'allergy', name: '过敏指数'},
    {type: 'beer', name: '啤酒指数'},
    {type: 'boating', name: '划船指数'},
    {type: 'car_washing', name:'洗车指数'},
    {type: 'chill', name:'风寒指数'},
    {type: 'comfort', name: '舒适度指数'},
    {type: 'dating', name: '约会指数'},
    {type: 'dressing', name: '穿衣指数'},
    {type: 'fishing', name: '钓鱼指数'},
    {type: 'flu', name: '感冒指数'},
    {type: 'hair_dressing', name: '美发指数'},
    {type: 'kiteflying', name: '放风筝指数'},
    {type: 'makeup', name: '化妆指数'},
    {type: 'mood', name: '心情指数'},
    {type: 'morning_sport', name: '晨练指数'},
    {type: 'night_life', name: '夜生活指数'},
    {type: 'road_condition', name: '路况指数'},
    {type: 'shopping', name: '购物指数'},
    {type: 'sport', name: '运动指数'},
    {type: 'sunscreen', name: '防晒指数'},
    {type: 'traffic', name: '交通指数'},
    {type: 'travel', name:'旅游指数'},
    {type: 'umbrella', name:'雨伞指数'},
    {type: 'uv', name: '紫外线指数'}
  ];

  useEffect(async () => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  return (
    <View className={`life-suggestion theme-${user.theme}`}>
      {lifeSuggestion.map((ls, index) => {
        return (
          <View className='flex-col' key={ls.type}>
            <View className='flex-row flex-start-center bd-radius-20 pd-20'>
              <View className={`flex-row flex-center w-100 h-100 circle white text-center ${location.isDay ? 'day-bg' : 'night-bg'}`}>
                {ls.type === 'ac' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe626;</View>}
                {ls.type === 'air_pollution' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe74f;</View>}
                {ls.type === 'airing' && <View className='iconfont w-100 h-100 lh-100 fs-60 bold' style={{marginTop: '-10px'}}>&#xe702;</View>}
                {ls.type === 'allergy' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe708;</View>}
                {ls.type === 'beer' && <View className='iconfont w-100 h-100 lh-100 fs-70'>&#xe605;</View>}
                {ls.type === 'boating' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xea7a;</View>}
                {ls.type === 'car_washing' && <View className='iconfont w-100 h-100 lh-100 fs-60' style={{marginTop: '-4px'}}>&#xe62f;</View>}
                {ls.type === 'chill' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe602;</View>}
                {ls.type === 'comfort' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe668;</View>}
                {ls.type === 'dating' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe60e;</View>}
                {ls.type === 'dressing' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe67a;</View>}
                {ls.type === 'fishing' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe66a;</View>}
                {ls.type === 'flu' && <View className='iconfont w-100 h-100 lh-100 fs-60 fs-28'>&#xe6c8;</View>}
                {ls.type === 'hair_dressing' && <View className='iconfont w-100 h-100 lh-100 fs-50'>&#xe6e7;</View>}
                {ls.type === 'kiteflying' && <View className='iconfont w-100 h-100 lh-100 fs-60 bold'>&#xe62c;</View>}
                {ls.type === 'makeup' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe667;</View>}
                {ls.type === 'mood' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe63c;</View>}
                {ls.type === 'morning_sport' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe6d0;</View>}
                {ls.type === 'night_life' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe60d;</View>}
                {ls.type === 'road_condition' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe69a;</View>}
                {ls.type === 'shopping' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe604;</View>}
                {ls.type === 'sport' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe6a7;</View>}
                {ls.type === 'sunscreen' && <View className='iconfont w-100 h-100 lh-100 fs-70'>&#xe630;</View>}
                {ls.type === 'traffic' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe84b;</View>}
                {ls.type === 'travel' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe60c;</View>}
                {ls.type === 'umbrella' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe624;</View>}
                {ls.type === 'uv' && <View className='iconfont w-100 h-100 lh-100 fs-60'>&#xe773;</View>}
              </View>
              <View className='item-flg-1 mg-l-20'>
                <View className='fs-32 gray-900'>{ls.name}</View>
                <View className={`mg-tb-10 ${location.isDay ? 'day-color' : 'night-color'}`}>- {user.lifeSuggestion[ls.type]['brief']} -</View>
                <View>{user.lifeSuggestion[ls.type]['details']}</View>
              </View>
            </View>
            {index !== ls.length - 1 && <View className='h-line-gray-300' />}
          </View>
        )
      })}
    </View>
  )
}

LifeSuggestion.config = {
  navigationBarTitleText: '今日生活指数',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default LifeSuggestion;
