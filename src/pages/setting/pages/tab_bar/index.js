import Taro, {useEffect, useState} from '@tarojs/taro'
import {ScrollView, View, Button, RadioGroup, Radio, Label} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import _ from 'lodash/lodash.min'
import './index.scss'
import {setNavStyle, getNodeRect} from '../../../../utils'

function TabBarSetting() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [circular, setCircular] = useState(false);  // tabBar是否循环,默认循环
  const [circularItems, setCircularItems] = useState([]);
  const [tabBarItemNum, setTabBarItemNum] = useState(5); // tabBar显示标签个数，默认5个
  const [tabBarItems, setTabBarItems] = useState([]);
  const [slideUpHide, setSlideUpHide] = useState(false);  // tabBar是否上滑隐藏
  const [slideUpHideItems, setSlideUpHideItems] = useState([]);
  const [initTabBarSetting, setInitTabBarSetting] = useState({}); // tabBar设置的初始值,用于比较是否有更改


  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 设备信息
  useEffect(async () => {
    const res1 = await getNodeRect('#confirmBtn');
    if (!res1) {return;}
    // setTabBarHeight(res1.height);
    setScrollHeight(user.systemInfo.windowHeight - res1.height - 44 - user.systemInfo.statusBarHeight);  // 自定义导航固定44
  }, []);

  // 初始化数据
  useEffect(() => {
    const TAB_BAR_SETTING = Taro.getStorageSync('TAB_BAR_SETTING');  // 这个已经在首页设置过
    setInitTabBarSetting(TAB_BAR_SETTING);
    const _circularItems = [
      {name: '是', value: true, checked: TAB_BAR_SETTING.circular === true},
      {name: '否', value: false, checked: TAB_BAR_SETTING.circular === false}
    ];
    setCircular(TAB_BAR_SETTING.circular);
    setCircularItems(_circularItems);

    const _tabBarItems = [
      {value: 3, checked: TAB_BAR_SETTING.displayMultipleItems === 3},
      {value: 4, checked: TAB_BAR_SETTING.displayMultipleItems === 4},
      {value: 5,  checked: TAB_BAR_SETTING.displayMultipleItems === 5}
    ];
    setTabBarItemNum(TAB_BAR_SETTING.displayMultipleItems);
    setTabBarItems(_tabBarItems);

    const _slideUpHideItems = [
      {name: '是', value: true, checked: typeof TAB_BAR_SETTING.slideUpHide === 'undefined' ? false : TAB_BAR_SETTING.slideUpHide === true},  // 之前的用户没有这个，所以判断
      {name: '否', value: false, checked: typeof TAB_BAR_SETTING.slideUpHide === 'undefined' ? true : TAB_BAR_SETTING.slideUpHide === false}
    ];
    setSlideUpHide(TAB_BAR_SETTING.slideUpHide);
    setSlideUpHideItems(_slideUpHideItems);
  }, []);

  // tabBar循环滚动事件
  const onCircularChange = (e) => {
    setCircular(e.detail.value === 'true');
  };

  // tabBar标签显示个数事件
  const onTabBarItemNumChange = (e) => {
    setTabBarItemNum(Number(e.detail.value));
  };

  // tabBar上滑隐藏
  const onSlideUpHideChange = (e) => {
    setSlideUpHide(e.detail.value === 'true')
  };

  // 保存
  const saveSetting = () => {
    const TAB_BAR_SETTING = {circular, displayMultipleItems: tabBarItemNum, slideUpHide};
    Taro.setStorageSync('TAB_BAR_SETTING', TAB_BAR_SETTING);

    Taro.showToast({title: '设置成功，重启生效', icon: 'none', duration: 2000});
    let tId = setTimeout(() => {
      Taro.reLaunch({url: '../../../../pages/tab_bar/index/index'});
      clearTimeout(tId);
    }, 2000);
  };

  return (
    <View className={`flex-col tab-bar-setting theme-${user.theme}`}>
      <ScrollView
        className='flex-col pd-20 bd-box'
        scrollY
        scrollWithAnimation
        style={{height: `${scrollHeight}px`}}
      >
        <View className='mg-b-20 fs-36 gray-900'>循环滚动</View>
        <View className='h-line-gray-300 mg-t-20' />
        <RadioGroup onChange={(e) => onCircularChange(e)}>
          {circularItems.map((item, index) => {
            return (
              <Label className='flex-row flex-spb-baseline pd-20' key={String(index)}>
                <View>{item.name}</View>
                <Radio value={item.value} checked={item.checked} />
              </Label>
            )
          })}
        </RadioGroup>
        <View className='mg-b-20 mg-t-20 fs-36 gray-900'>显示标签个数</View>
        <View className='h-line-gray-300 mg-t-20' />
        <RadioGroup onChange={(e) => onTabBarItemNumChange(e)}>
          {tabBarItems.map((item, index) => {
            return (
              <Label className='flex-row flex-spb-baseline pd-20' key={String(index)}>
                <View>{item.value}</View>
                <Radio value={item.value} checked={item.checked} />
              </Label>
            )
          })}
        </RadioGroup>
        <View className='mg-b-20 mg-t-20 fs-36 gray-900'>上滑隐藏</View>
        <View className='h-line-gray-300 mg-t-20' />
        <RadioGroup onChange={(e) => onSlideUpHideChange(e)}>
          {slideUpHideItems.map((item, index) => {
            return (
              <Label className='flex-row flex-spb-baseline pd-20' key={String(index)}>
                <View>{item.name}</View>
                <Radio value={item.value} checked={item.checked} />
              </Label>
            )
          })}
        </RadioGroup>
      </ScrollView>
      <Button className={`h-88 w-100-per white bd-radius-0 fs-32 ${location.isDay ? 'day-bg' : 'night-bg'} confirm-btn`}
              id='confirmBtn' disabled={_.isEqual(initTabBarSetting, {circular, displayMultipleItems: tabBarItemNum, slideUpHide})} onClick={() => saveSetting()}>保存设置</Button>
    </View>
  )
}

TabBarSetting.config = {
  navigationBarTitleText: '标签设置',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default TabBarSetting;
