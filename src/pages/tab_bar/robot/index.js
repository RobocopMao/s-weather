import Taro, {useEffect, useState} from '@tarojs/taro'
import {Button, Input, OpenData, ScrollView, Text, View} from '@tarojs/components'
import {useDispatch, useSelector} from '@tarojs/redux';
import _ from 'lodash/lodash.min'
import './index.scss'
import {setNavStyle, getNodeRect} from '../../../utils'
import {getRobotTalk} from "../../../apis/function";
import moment from "moment";
// import ComponentBaseNavigation from '../../../components/base/navigation'
// import themeMatch from '../../../assets/json/theme_match.json'

function Robot() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);
  // const dispatch = useDispatch();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [quickResScrollTop, setQuickResScrollTop] = useState(0);
  const [inputVal, setInputVal] = useState(`明天${user.location.city}天气怎么样？`);
  const [quickRes, setQuickRes] = useState([]);
  const [showQuickRes, setShowQuickRes] = useState(false);
  const [session, setSession] = useState('');
  const [talks, setTalks] = useState([{robotReply: `您好，我是天气聊天机器人，从现在开始为你在本地保留30分钟内的聊天回话。您可以对我说：明天${user.location.city}天气怎么样？`, time: moment().format('YYYY-MM-DD HH:mm')}]);
  const [quickResAnimation, setQuickResAnimation] = useState({});

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 设备信息
  useEffect(async () => {
    const res = await getNodeRect('#searchBar');
    if (!res) {return;}
    const {windowHeight, statusBarHeight} = user.systemInfo;
    setScrollHeight(windowHeight - res.height - 44 - statusBarHeight);  // 自定义导航固定44
  }, []);

  // 初始化聊天记录,30分钟之内的和会话session
  useEffect(() => {
    const ROBOT_SESSION = Taro.getStorageSync('ROBOT_SESSION');
    const ROBOT_TALKS = Taro.getStorageSync('ROBOT_TALKS');
    if (ROBOT_TALKS) {
      const firstTime = ROBOT_TALKS[1].time;
      if (moment().subtract(30, 'minutes') < moment(firstTime)) {
        setTalks(ROBOT_TALKS);
        let tId = setTimeout(() => {
          setScrollTop(ROBOT_TALKS.length * 200);
          clearTimeout(tId);
        }, 1000);
        setInputVal('');
        setSession(ROBOT_SESSION);
      } else {
        Taro.removeStorageSync('ROBOT_TALKS');
        Taro.removeStorageSync('ROBOT_SESSION');
      }
    }

  }, []);

  // 初始化快捷回复
  useEffect(() => {
    initQuickRes();
  }, []);

  // 初始化快捷回复
  const initQuickRes = () => {
    // 初始化常用类型
    let types = {
      desc: '想问类型',
      quickRes: ['天气', '空气质量', '生活指数', '日出日落', '月出月落', '月相', '洗车', '紫外线', '穿衣', '钓鱼', '雨伞']
    };

    // 初始化常用地址
    let _cities = [user.location.city];
    const COLLECTED_CITY = Taro.getStorageSync('COLLECTED_CITY');
    const LOCATION_SEARCH_HISTORY = Taro.getStorageSync('LOCATION_SEARCH_HISTORY');
    let storeCities = [...COLLECTED_CITY, ...LOCATION_SEARCH_HISTORY];
    if (storeCities.length) {
      for (let i = 0; i < storeCities.length; i++) {
        _cities.push(storeCities[i].cityName);
      }
    }
    _cities = [...new Set(_cities)];
    const cities = {
      desc: '常用地址',
      quickRes: _cities
    };

    // 初始化常用时间
    let date = {
      desc: '查询时间',
      quickRes: ['昨天', '今天', '明天', '后天', '未来24小时', '未来7天', '未来14天', '早上', '下午', '晚上']
    };

    // 常用快捷组合
    let quickResComb = {
      desc: '常用组合',
      quickRes: [
        `${user.location.city}今天天气怎么样？`,
        `${user.location.city}今天空气质量怎么样？`,
        `${user.location.city}明天天气怎么样？`,
        `${user.location.city}明天空气质量怎么样？`,
        `${user.location.city}今天出门我要带伞吗？`,
        `${user.location.city}今天洗车可以吗？`,
      ]
    };

    let _quickRes = [types, cities, date, quickResComb];
    setQuickRes(_quickRes);
  };

  // 搜索输入
  const searchInput = (e) => {
    const {value} = e.detail;
    setInputVal(value);
  };

  // 重置input
  const resetInput = () => {
    setInputVal('');
  };

  //显示/隐藏快捷回复
  const showHideQuickRes = () => {
    setShowQuickRes(prev => {
      this.animation = Taro.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      });

      if (!prev) { // 出来
        this.animation.translateX(user.systemInfo.windowWidth).step();
        setQuickResAnimation(this.animation.export());
        setQuickResScrollTop(prev1 => prev1 ? 0 : 0.1);
        Taro.setNavigationBarTitle({title: '快捷回复'});
      } else {  // 进去
        this.animation.translateX(-user.systemInfo.windowWidth).step();
        setQuickResAnimation(this.animation.export());
        setQuickResScrollTop(prev1 => prev1 ? 0.1 : 0);
        Taro.setNavigationBarTitle({title: '天气聊天机器人'});
      }

      return !prev;
    });
  };

  // 点击把快捷回复填在input里面
  const setQuickVal = (res) => {
    setInputVal('');

    this.animation.translateX(-user.systemInfo.windowWidth).step();
    setQuickResAnimation(this.animation.export());
    setShowQuickRes(false);
    Taro.setNavigationBarTitle({title: '天气聊天机器人'});

    sendTalk(res);
  };

  // 发送问题
  const sendTalk = async (myQuery) => {
    // 判断空值
    let q = myQuery || inputVal;
    q = q.replace(/\s+/g, '');
    if (!q) {
      return;
    }

    const res = await getRobotTalk({q, session});
    const {query, reply} = res;
    setSession(res.session);
    Taro.setStorageSync('ROBOT_SESSION', res.session);
    let _talks = talks;
    const onceTalk = {
      robotReply: reply.plain || `ヾ(≧O≦)〃嗷哦~，这个问题有点难，您可以试试其他的，比如：今天天气怎么样？`,
      myQuery: query,
      time: moment().format('YYYY-MM-DD HH:mm')
    };
    _talks.push(onceTalk);
    setTalks(_talks);
    setScrollTop(_talks.length * 200);
    setInputVal('');
    Taro.setStorageSync('ROBOT_TALKS', _talks);
  };

  // 设置剪贴板
  const setClipboard = (data) => {
    Taro.setClipboardData({
      data,
      success: res => {
        // Taro.showToast({title: '复制成功', icon: 'none'});
      },
      fail: res => {
        // Taro.showToast({title: '复制失败', icon: 'none'});
      }
    });
  };

  return (
    <View className={`robot relative theme-${user.theme}`}>
      {/*聊天对话*/}
      <ScrollView
        className='flex-col'
        scrollY
        scrollWithAnimation
        enableBackToTop
        scrollTop={scrollTop}
        style={{height: `${scrollHeight}px`}}
      >
        {talks.map((talk, index) => {
          const {robotReply, myQuery, time} = talk;
          let isTimeShow = true;
          if (index) {
            isTimeShow = moment(time).subtract(5, 'minutes') > moment(talks[index - 1].time);
          }
          return (
            <View className='flex-col flex-start-stretch white pd-lr-20 relative' key={String(index)}>
              {isTimeShow && <View className='fs-24 text-center w-100-per gray-700 mg-tb-20'>{moment(time).format('HH:mm')}</View>}
              {/*我*/}
              {myQuery && <View className='flex-row flex-end-start mg-b-30 relative'>
                <View className='h-100-per item-fls-0 item-flg-0 item-flb-20per' />
                <View className={`bd-radius-20 pd-20 ${location.isDay ? 'night-bg' : 'day-bg'}`} onLongPress={() => setClipboard(myQuery)}>{myQuery}</View>
                <View className='circle w-80 h-80 box-hd mg-l-20'>
                  <OpenData type='userAvatarUrl' />
                </View>
                <View className={`iconfont ${location.isDay ? 'night-color' : 'day-color'} my-triangle`}>&#xe617;</View>
              </View>}
              {/*机器人*/}
              {robotReply && <View className='flex-row flex-start mg-b-30 relative'>
                <View className={`iconfont fs-80 w-80 h-80 lh-80 text-center mg-r-20 ${location.isDay ? 'day-color' : 'night-color'}`}>&#xe632;</View>
                <View className={`bd-radius-20 pd-20 ${location.isDay ? 'day-bg' : 'night-bg'}`} onLongPress={() => setClipboard(robotReply)}>{robotReply}</View>
                <View className='h-100-per item-fls-0 item-flg-0 item-flb-20per' />
                <View className={`iconfont ${location.isDay ? 'day-color' : 'night-color'} robot-triangle`}>&#xe617;</View>
              </View>}
            </View>
          )
        })}
      </ScrollView>
      {/*快捷回复*/}
      {quickRes.length && <ScrollView
        className='flex-col bg-white pd-20 bd-box quick-res-box'
        scrollY
        scrollWithAnimation
        enableBackToTop
        scrollTop={quickResScrollTop}
        animation={quickResAnimation}
        style={{height: `${scrollHeight}px`}}
      >
        {quickRes.map((res, index) => {
          return (
            <View className='flex-row flex-wrap' key={String(index)}>
              <View className='mg-b-20 mg-t-10 fs-26 w-100-per'>{res.desc}</View>
              {res.quickRes.map((res1, index1) => {
                return (
                  <View className={`bd-radius-50 white pd-lr-20 pd-tb-10 mg-b-20 mg-r-20 inline-block ${location.isDay ? 'night-bg' : 'day-bg'}`}
                        key={String(index1)} onClick={_.throttle(() => setQuickVal(res1), 1000, {leading: true, trailing: false})}>{res1}</View>
                )
              })}
            </View>
          )
        })}
      </ScrollView>}
      {/*输入框*/}
      <View className='flex-row flex-start-stretch h-120 pd-tb-20 pd-lr-20 bd-box bg-gray-100 search-bar' id='searchBar'>
        <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-80-i gray-700' onClick={() => showHideQuickRes()}>&#xe87f;</Button>
        <View className={`flex-row flex-start-stretch item-flg-1 bd-w-1 bd-solid bd-gray-300 bd-radius-50 ${showQuickRes ? 'bg-gray-100' : 'bg-white'}`}>
          <Input className={`item-flg-1 h-80 pd-l-20 pd-r-20 bd-box lh-80 ${showQuickRes ? 'gray-400' : 'gray-700'}`} confirmType='search' value={inputVal} placeholder='' cursorSpacing={24 / user.systemInfo.pixelRatio}
                 onInput={_.throttle((e) => searchInput(e), 500, {leading: false, trailing: true})} disabled={showQuickRes}
          />
          {inputVal && <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-80-i gray-700' disabled={showQuickRes} onClick={() => resetInput()}>&#xe87b;</Button>}
        </View>
        <Button className='iconfont icon-btn fs-50 pd-0 mg-0 h-100-per w-100 lh-80-i gray-700' disabled={showQuickRes || !inputVal.replace(/\s+/g, '')} onClick={_.throttle(() => sendTalk(), 1000, {leading: true, trailing:false})}>&#xe87c;</Button>
      </View>
    </View>
  )
}

Robot.config = {
  navigationBarTitleText: '天气聊天机器人',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black',
};

export default Robot;
