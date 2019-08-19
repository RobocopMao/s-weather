import Taro, {useEffect} from '@tarojs/taro'
import {View, OpenData} from '@tarojs/components'
import {useSelector} from '@tarojs/redux';
import _ from 'lodash/lodash.min'
import './index.scss'
import {setNavStyle} from '../../../utils';
import {S_TOOLS_APPID} from '../../../apis/config';
import themeMatch from '../../../assets/json/theme_match.json'

function Setting() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 打开授权
  const openSetting = () => {
    Taro.openSetting({
      success(res) {
        const AUTH_SETTING = Taro.getStorageSync('AUTH_SETTING');
        // console.log(AUTH_SETTING === res.authSetting);
        // console.log(res);
        const isEqual = _.isEqual(AUTH_SETTING, res.authSetting);
        if (!isEqual) { // 不一样，更新权限，返回首页
          Taro.setStorageSync('AUTH_SETTING', res.authSetting);
          Taro.showToast({title: '权限设置已更新，即将重启', icon: 'none', duration: 2000});
          let tId = setTimeout(() => {
            Taro.reLaunch({url: '../../../pages/tab_bar/index/index'});
            clearTimeout(tId);
          }, 2000);
        }
        // console.log(isEqual);
      }
    });
  };

  // 设置主题
  const goTheme = () => {
    Taro.navigateTo({url: `../../setting/pages/theme/index`})
  };

  // 设置tabBar
  const goTabBar = () => {
    Taro.navigateTo({url: `../../setting/pages/tab_bar/index`})
  };

  // 去数据来源页面
  const goDataSource = () => {
    Taro.navigateTo({url: `../../setting/pages/data_source/index`})
  };

  // 去气象知识页面
  const goKnowledge = () => {
    Taro.navigateTo({url: `../../setting/pages/knowledge/index`})
  };

  // 去小工具S小程序
  const goStoolsMiniProgram = () => {
    Taro.navigateToMiniProgram({appId: S_TOOLS_APPID});
  };

  // 去用户手册
  const goUserManual = () => {
    Taro.navigateTo({url: `../../setting/pages/user_manual/index`})
  };

  // 联系作者
  const contactAuthor = () => {
    Taro.showModal({
      title: '作者联系方式',
      content: 'QQ：410503915\r\n微信：m410503915',  // \r\n换行
      confirmText: '复制微信',
      cancelText: '复制QQ',
      confirmColor: location.isDay ? themeMatch[user.theme]['night'] : themeMatch[user.theme]['day'],
      cancelColor: location.isDay ? themeMatch[user.theme]['day'] : themeMatch[user.theme]['night'],
      success: res => {
        const {cancel, confirm} = res;
        // 复制邮箱
        if (cancel) {
          Taro.setClipboardData({data: '410503915'});
        }
        // 复制微信
        if (confirm) {
          Taro.setClipboardData({data: 'm410503915'});
        }
      }
    });
  };

  // 去关于页面
  const goAbout = () => {
    Taro.navigateTo({url: `../../setting/pages/about/index`})
  };

  return (
    <View className={`flex-col flex-start-center bg-gray-100 setting theme-${user.theme}`}>
      <View className={`w-100-per h-300 box-hd relative ${location.isDay ? 'day-bg' : 'night-bg'}`}>
        <View className='flex-col flex-start-center bg-transparent avatar-box'>
          <View className='circle w-144 h-144 box-hd avatar'>
            <OpenData type='userAvatarUrl' />
          </View>
          <View className={`fs-40 text-center mg-t-10 ${location.isDay ? 'day-color' : 'night-color'}`}>
            <OpenData type='userNickName' />
          </View>
        </View>
        <View className='relative bg-gray-100 h-144 half-circle' />
      </View>
      <View className='flex-col flex-start-stretch w-100-per pd-t-50 pd-lr-20 bd-box'>
        <View className='bd-radius-20 pd-lr-20 mg-b-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => openSetting()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe872;</View>
              <View>授权管理</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goTheme()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe607;</View>
              <View>主题设置</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goTabBar()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe611;</View>
              <View>标签设置</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 mg-b-20 bg-white'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goKnowledge()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe601;</View>
              <View>气象知识</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goDataSource()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe603;</View>
              <View>数据来源</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>

        <View className='bd-radius-20 pd-lr-20 bg-white mg-b-20'>
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goUserManual()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-l-2 mg-r-12 fs-28 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe728;</View>
              <View>用户手册</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goStoolsMiniProgram()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe87c;</View>
              <View>更多查询</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => contactAuthor()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe709;</View>
              <View>联系作者</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
          <View className='h-line-gray-300' />
          <View className='flex-row flex-spb-baseline pd-tb-30' onClick={() => goAbout()}>
            <View className='flex-row flex-start-baseline'>
              <View className={`iconfont mg-r-10 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe654;</View>
              <View>关于</View>
            </View>
            <View className='iconfont'>&#xe65b;</View>
          </View>
        </View>
      </View>
    </View>
  )
}

Setting.config = {
  navigationBarTitleText: '关于与设置',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default Setting;
