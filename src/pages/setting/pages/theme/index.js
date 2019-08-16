import Taro, {useEffect} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useSelector, useDispatch} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'
import themeMatch from '../../../../assets/json/theme_match.json'
import {setUserTheme} from '../../../../redux/user/action';

function Theme() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 修改主题
  const changeTheme = (index) => {
    if (user.theme === index) {
      return;
    }
    Taro.setStorageSync('THEME', index);
    dispatch(setUserTheme(index));

    Taro.showToast({title: '主题设置成功，重启生效', icon: 'none', duration: 2000});
    let tId = setTimeout(() => {
      Taro.reLaunch({url: '../../../../pages/tab_bar/index/index'});
      clearTimeout(tId);
    }, 2000);
  };

  return (
    <View className={`flex-row flex-wrap pd-b-20 theme theme-${user.theme}`}>
      {themeMatch.map((theme, index) => {
        const {day, night, cnName} = theme;
        return (
          <View className='item-flb-50per flex-col flex-center mg-t-40' key={String(index)} onClick={() => changeTheme(index)}>
            <View className='flex-row flex-spb-center relative'>
              <View className='h-200 w-100' style={{backgroundColor: `${day}`}} />
              <View className='h-200 w-100' style={{backgroundColor: `${night}`}} />
              {user.theme === index && <View className='flex-row flex-center h-200 w-200 selected'>
                <View className='iconfont fs-50 white'>&#xe873;</View>
              </View>}
            </View>
            <View className='mg-t-20'>{cnName}</View>
          </View>
        )
      })}

      <View className='text-center fs-26 gray-400 mg-t-50 pd-lr-20 bd-box' style={{textDecoration: 'underline'}}>小提示：主题的两种颜色分别为白天和夜间的颜色，颜色会根据当前位置日出日落自动切换</View>
    </View>
  )
}

Theme.config = {
  navigationBarTitleText: '主题设置',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Theme;
