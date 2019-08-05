import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

@withWeapp('Component')
class _C extends Taro.Component {
  static defaultProps = {
    bgcolor: '#FFF',
    selector: 'skeleton',
    loading: 'spin'
  }
  _observeProps = []
  state = {
    loadingAni: ['spin', 'chiaroscuro'],
    systemInfo: {},
    skeletonRectLists: [],
    skeletonCircleLists: []
  }
  attached = () => {
    //默认的首屏宽高，防止内容闪现
    const systemInfo = Taro.getSystemInfoSync();
    this.setData({
      systemInfo: {
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight
      },
      loading: this.data.loadingAni.includes(this.data.loading)
        ? this.data.loading
        : 'spin'
    })
  }
  ready = () => {
    const that = this

    //绘制背景
    Taro.createSelectorQuery()
      .selectAll(`.${this.data.selector}`)
      .boundingClientRect()
      .exec(function(res) {
        that.setData({
          'systemInfo.height': res[0][0].height + res[0][0].top
        })
      })

    //绘制矩形
    this.rectHandle()

    //绘制圆形
    this.radiusHandle()
  }
  rectHandle = () => {
    const that = this

    //绘制不带样式的节点
    Taro.createSelectorQuery()
      .selectAll(`.${this.data.selector} >>> .${this.data.selector}-rect`)
      .boundingClientRect()
      .exec(function(res) {
        that.setData({
          skeletonRectLists: res[0]
        })

        // console.log(that.data)
      })
  }
  radiusHandle = () => {
    const that = this

    Taro.createSelectorQuery()
      .selectAll(`.${this.data.selector} >>> .${this.data.selector}-radius`)
      .boundingClientRect()
      .exec(function(res) {
        // console.log(res)
        that.setData({
          skeletonCircleLists: res[0]
        })

        // console.log(that.data)
      })
  }
  config = {
    component: true
  }

  render() {
    const {
      bgcolor: bgcolor,
      selector: selector,
      loading: loading
    } = this.props;
    const {
      systemInfo: systemInfo,
      skeletonRectLists: skeletonRectLists,
      skeletonCircleLists: skeletonCircleLists
    } = this.state;
    return (
      <View
        style={
          'width: ' +
          systemInfo.width +
          'px; height: ' +
          systemInfo.height +
          'px; background-color: ' +
          bgcolor +
          '; position: absolute; left:0; top:0; z-index:9998; overflow: hidden;'
        }
      >
        {skeletonRectLists.map((item, index) => {
          return (
            <View
              key={index}
              className={loading === 'chiaroscuro' ? 'chiaroscuro' : ''}
              style={
                'width: ' +
                item.width +
                'px; height: ' +
                item.height +
                'px; background-color: rgb(194, 207, 214); position: absolute; left: ' +
                item.left +
                'px; top: ' +
                item.top +
                'px'
              }
            />
          )
        })}
        {skeletonCircleLists.map((item, index) => {
          return (
            <View
              key={index}
              className={loading === 'chiaroscuro' ? 'chiaroscuro' : ''}
              style={
                'width: ' +
                item.width +
                'px; height: ' +
                item.height +
                'px; background-color: rgb(194, 207, 214); border-radius: ' +
                item.width +
                'px; position: absolute; left: ' +
                item.left +
                'px; top: ' +
                item.top +
                'px'
              }
            />
          )
        })}
        {loading === 'spin' && (
          <View className='spinbox'>
            <View className='spin' />
          </View>
        )}
      </View>
    )
  }
}

export default _C
