import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import moment from 'moment'

import Index from './pages/tab_bar'

import configStore from './redux/store'

import './app.scss'

// 自定义星期
moment.updateLocale('en', {
  weekdays : [
    '周日', '周一', '周二', '周三', '周四', '周五', '周六'
  ]
});

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {

  config = {
    pages: [
      'pages/tab_bar/index/index',
      'pages/tab_bar/setting/index',
      'pages/tab_bar/location_collection/index',
      'pages/tab_bar/location_search/index',
    ],
    subpackages: [  // 分包配置
      {
        root: 'pages/forecast/',
        name: 'forecast',  // 预告
        pages: [
          'pages/daily_forecast/index'
        ],
      },
      {
        root: 'pages/setting/',
        name: 'setting',  // 设置
        pages: [
          'pages/about/index',
          'pages/data_source/index',
          'pages/knowledge/index',
        ],
      }
    ],
    preloadRule: {
      'pages/tab_bar/index/index': {
        network: 'wifi',
        packages: ['forecast']
      },
      'pages/tab_bar/setting/index': {
        network: 'wifi',
        packages: ['setting']
      },
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#4481EB',
      navigationBarTitleText: '天气晴报',
      navigationBarTextStyle: 'white'
    },
    networkTimeout: {
      request: 10000,
      connectSocket: 10000,
      uploadFile: 10000,
      downloadFile: 10000
    },
    navigateToMiniProgramAppIdList: ['wx2269fb8c2e106c9c'],
    // workers: "workers",
    permission: {
      'scope.userLocation': {
        'desc': '你的位置信息将用于小程序查询天气'
      }
    }
  };

  componentWillMount() {
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //   console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })

    });
    updateManager.onUpdateFailed(function () {
      Taro.showToast({
        title: '有新的版本存在,但下载失败,请将小程序从列表中删除再重新搜索该小程序进入',
        icon: 'loading'
      })
    });
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'));
