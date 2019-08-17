import Taro, {useEffect} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {useSelector} from '@tarojs/redux'
import './index.scss'
import {setNavStyle} from '../../../../utils'

function UserManual() {
  const location = useSelector(state => state.location);
  const user = useSelector(state => state.user);

  // 设置白天、夜晚主题
  useEffect(() => {
    setNavStyle(location.isDay, user.theme);
  }, []);

  // 赋值github地址
  const copyUrl = () => {
    Taro.setClipboardData({
      data: 'https://github.com/RobocopMao/s-weather'
    });
  };

  return (
    <View className={`pd-lr-20 user-manual theme-${user.theme}`}>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>一、首页</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>1. 天气实况：</View>
          <View className='mg-t-10'>展示气温、天气状态、风向、风力、相对湿度、空气质量、气象灾害预警。</View>
          <View className='mg-t-10'>气象灾害预警：当有预警时会在右上角显示一个红色的预警铃铛，点击进入可以查看预警详情；</View>
          <View className='mg-t-10'>空气质量：点击进入可以查看空气质量实况详情以及周围的监测站点在地图上的空气质量监测数值，在空气详情页点击AQI预报，可以查看24小时逐时预报和未来5天逐天预报，统计图面积越红空气质量越差，越绿空气质量越好。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>2. 24小时逐时预报：</View>
          <View className='mg-t-10'>展示24小时内每小时的天气状态，气温曲线图，风向风力，相对湿度的预报。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>3. 15天逐天天气预报：</View>
          <View className='mg-t-10'>默认展示三天，点击15天天气趋势预报可以查看未来15的天气预报。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>4. 今日生活指数：</View>
          <View className='mg-t-10'>展示今日基本的生活指数。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>5. 头部导航栏：</View>
          <View className='mg-t-10'>默认定位用户当前位置，点击可以进入腾讯地图选择查询地址。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>5. 底部导航：</View>
          <View className='mg-t-10'>依次是城市收藏夹、城市搜索查询、定位用户当前位置、天气聊天机器人、分享当前页面、关于与设置。</View>
          <View className='mg-t-10'>当前天气不是展示用户定位天气的时候，当行中间的定位用户当前位置的按钮会变红且上下浮动，可以点击快速回到当前位置。</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>二、城市收藏夹</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='mg-t-10'>以卡片的形式展示用户收藏的城市，用户点击后回到首页查询该城市天气，再次进入会以不同的颜色记录上次的点击状态。</View>
          <View className='mg-t-10'>编辑：长按卡片可以进入编辑状态，对收藏的城市进行置顶和删除操作，点击右下角按钮退出编辑。</View>
          <View className='mg-t-10'>收藏：需要到城市搜索中收藏，最多收藏10个城市。</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>三、城市搜索</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='mg-t-10'>历史记录：通过输入框搜索城市，搜索的城市会记录在本地，最多10条记录。</View>
          <View className='mg-t-10'>热门城市：每天更新一次热门城市数据，最多展示20个热门城市。</View>
          <View className='mg-t-10'>收藏城市：长按历史记录和热门城市里的城市会收藏该城市，最多收藏10个城市。</View>
          <View className='mg-t-10'>点击历史记录、热门城市或搜索到的城市会回到首页查询对应城市的天气。</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>四、天气聊天机器人</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='mg-t-10'>可以通过对话的方式查询天气。</View>
          <View className='mg-t-10'>由于保持会话上下文的session过期时间为30分钟，所以为您在本地保存30分内的聊天记录。</View>
          <View className='mg-t-10'>您可以通过底部输入框主动输入来查询天气，或者使用左下角的快捷回复来快速查询，或者直接用语音来输入。</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>五、页面分享</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='mg-t-10'>分享本页面给好友或群聊。如果觉得好用，请分享给您的好友吧！</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>六、关于与设置</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>1. 授权管理：</View>
          <View className='mg-t-10'>管理小程序使用到的权限，比如位置信息。旨在更方便的给用户展示（其实小程序设置里面可以查看设置），请谨慎设置，关闭会影响小程序或某些功能的正常使用。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>2. 主题设置：</View>
          <View className='mg-t-10'>小程序内置了6套主题皮肤，会根据当前查询地址的日出日落自动切换白天/夜晚的主题，设置主题后会自动重启小程序。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>3. 标签设置：</View>
          <View className='mg-t-10'>设置小程序首页底部的标签栏：是否循环滚动（默认不循环）和显示的标签个数（默认显示5个）</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>4. 气象知识：</View>
          <View className='mg-t-10'>小程序用到的一些相关气象知识说明。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>5. 数据来源：</View>
          <View className='mg-t-10'>小程序天气数据的来源和地图数据来源。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>6. 其他查询：</View>
          <View className='mg-t-10'>作者开发的一个工具类查询小程序。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>7. 用户手册：</View>
          <View className='mg-t-10'>您正在浏览的内容。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>8. 联系方式：</View>
          <View className='mg-t-10'>作者的联系方式。</View>
        </View>
        <View className='flex-col gray-500 mg-b-20'>
          <View className='gray-700'>9. 关于：</View>
          <View className='mg-t-10'>小程序的logo、名称和版本号。</View>
        </View>
      </View>
      <View className='flex-col mg-tb-20'>
        <View className='fs-36 gray-900'>七、其他</View>
        <View className='h-line-gray-300 mg-tb-20' />
        <View className='flex-col gray-500 mg-b-20'>
          <View className='mg-t-10'>请合理使用本小程序，严禁非法使用。</View>
          <View className='mg-t-10'>本小程序为用户提供免费的天气等查询服务，不会收集用户的任何信息，用户所有数据均记录在用户本地，用户的头像和昵称均使用微信开放数据。
            如果用户从小程序列表删除小程序，所有数据清空；再次进入，城市收藏夹等需要重新收藏。</View>
          <View className='mg-t-10'>如果您是开发者，可以去github：<Text className='blue-A700' onClick={() => copyUrl()}>https://github.com/RobocopMao/s-weather</Text>，查看源码，交流学习，详细请看说明。</View>
        </View>
      </View>
    </View>
  )
}

UserManual.config = {
  navigationBarTitleText: '用户手册',
  backgroundTextStyle: 'light',
  navigationBarBackgroundColor: 'white',
  navigationBarTextStyle: 'black'
};

export default UserManual;
