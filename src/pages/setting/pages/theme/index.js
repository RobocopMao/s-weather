import Taro, {useEffect} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
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
    Taro.reLaunch({url: '../../../../pages/tab_bar/index/index'});
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
