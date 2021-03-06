import Taro, { Component } from '@tarojs/taro';
import { View, Input, Map, CoverView, ScrollView } from '@tarojs/components';
import QQMapWX from '../../assets/qqmap-wx-jssdk.min.js';
import imgUrl from '../../assets/location.png';
import './index.scss';


import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class chooseaddress extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      msg:"子组件信息",
      currentaddress:'',
      latitude: 35.970538, // 纬度
      longitude: 120.259514, // 经度
      markers: [
        {
          // 标记点
          iconPath: imgUrl,
          id: 0, // 标记点 id marker 点击事件回调会返回此 id。建议为每个 marker 设置上 number 类型 id，保证更新 marker 时有更好的性能。
          latitude: 35.970538, // 纬度
          longitude: 120.259514, // 经度
          width: 22, // 标注图标高度
          height: 22, // 标注图标宽度
        },
      ],
      qMapKey: 'S32BZ-TYNL4-JDVUZ-XMLOV-DIIHS-WBF4J',
      QQMapSDK: {},
      nearbyBuilding: [],
      searchVal: '酒店',
    };
  }


  componentDidMount = () => {
     if (!this.mapContext) {
        this.mapContext = Taro.createMapContext('myMap', this.$scope)
       // 实例化API核心类
       const QQMapSDK = new QQMapWX({
         key: 'S32BZ-TYNL4-JDVUZ-XMLOV-DIIHS-WBF4J',
         mapStyleId: 'style1', // 个性化地图
       });
       this.setState({
         QQMapSDK,
       });
       const that = this;
       Taro.getLocation({
         type: 'gcj02',  //使手机gps定位位置符合！
         success: function (res) {
           // 获取周边建筑信息
           console.log("重新定位")
           QQMapSDK.search({
             keyword: that.state.searchVal,
             location: `${res.latitude},${res.longitude}`,
             success: function (searchRes) {
               that.setState({
                 nearbyBuilding: searchRes.data,
               })
               console.log(searchRes);
             },
             fail: function (searchRes) {
               console.log(searchRes);
             },
             // complete: function(searchRes) {
             //   console.log(searchRes);
             // },
           });
           // 设置当前位置
           const obj = {
             // 标记点
             ...that.state.markers[0],
             latitude: res.latitude, // 纬度
             longitude: res.longitude, // 经度
           };
           that.setState({
             markers: [obj],
             latitude: res.latitude, // 纬度
             longitude: res.longitude, // 经度,
           });
         },
       });
     }};


   searchfujin(latitude,longitude){
     const that=this
     console.log("最新位置",latitude,longitude)
       this.state.QQMapSDK.search({
             keyword: "酒店",
             location: `${latitude},${longitude}`,
             success: function (search2) {
               that.setState({
                 nearbyBuilding: search2.data,
               })
               console.log("搜索结果附近",search2.data);
             },
             fail: function (searchRes) {
               console.log(searchRes);
             },
             // complete: function(searchRes) {
             //   console.log(searchRes);
             // },
           });
}
  /**
   * 搜索框
   * @param e
   */
  handleSearchValChange = e => {
    const that = this;
    this.state.QQMapSDK.search({
      keyword: e.detail.value,
      success: function(searchRes) {
        that.setState({
          nearbyBuilding: searchRes.data,
        });
      },
      fail: function(searchRes) {
        console.log(searchRes);
      },
      // complete: function(searchRes) {
      //   console.log(searchRes);
      // },
    });
    this.setState({
      searchVal: e.detail.value,
    });
  };

  /**
   * 列表项点击事件
   */
  handleNearbyClick = (address,latitude, longitude) => {

    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

    let prevPage = pages[ pages.length - 2 ];

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。

        address : address

    })


    this.props.addressstore.updateaddress(address)
    //this.props.addressstore.updateshow(false)
    // 设置当前位置
    const obj = {
      // 标记点
      ...this.state.markers[0],
      latitude: latitude, // 纬度
      longitude: longitude, // 经度
    };
    this.setState({
      markers: [obj],
      latitude: latitude, // 纬度
      longitude: longitude, // 经度,
    });

    wx.navigateBack()
  };


  /**
   * marker 点击事件
   */
  handleMarkerClick = e => {
    console.log(e);
  };

  /**
   * 视野发生变化触发事件
   */
   //下面为移动选点函数

   updateCenterLocation(res) {
    let latitude = res.latitude;
    let longitude = res.longitude;
    // let markers = JSON.parse(JSON.stringify(this.state.markers));
    // let marker = markers[0]
    // marker.longitude = longitude;
    // marker.latitude = latitude;
    console.log('loc u')
    console.log(res.latitude,res.longitude)
    const obj = {
       // 标记点
       ...this.state.markers[0],
       latitude: res.latitude, // 纬度
       longitude: res.longitude, // 经度
     };
     this.setState({
       markers: [obj],
       latitude: res.latitude, // 纬度
       longitude: res.longitude, // 经度,
     });
     this.searchfujin(res.latitude,res.longitude)
  }



  render() {
    return (
      <View className="homeWrap">
        <View className="searchDom">
          <Input
            value={this.state.searchVal}
            onInput={this.handleSearchValChange.bind(this)}
            className="inputDom"
          />
        </View>

        {/**
         * longitude 中心经度
         * latitude 中心纬度
         * scale 缩放级别，取值范围为5-18
         * onMarkertap marker 点击事件
         * onRegionchange 视野发生变化触发事件
         * show-location 显示带有方向的当前定位点
         * cover-view 覆盖在原生组件之上的文本视图
         */}
        <Map
          id="myMap"
          class="mapDom"
          subkey={this.state.qMapKey}
          longitude={this.state.longitude}
          latitude={this.state.latitude}
          scale="18"
          markers={this.state.markers}
          onMarkertap={this.handleMarkerClick.bind(this)}
          showLocation
           onRegionchange={(e) => {
          if (this.changingRegion) {
            this.changingRegion = false;
        if (e.type === 'end' && (e.causedBy === 'scale' || e.causedBy === 'drag')){
            this.mapContext && this.mapContext.getCenterLocation({
              success: (res) => {
                this.updateCenterLocation(res)
              },
              fail: e => {
              },
              complete: e => {
              }
            })}
          } else {
            this.changingRegion = true;
          }
        }}
        >
          <CoverView className="coverImgWrap">
            {/*<CoverImage src={imgUrl} className="coverImg" />*/}
          </CoverView>
        </Map>

        <ScrollView className="scrollDom" scrollY scrollWithAnimation lowerThreshold="50">
          {this.state.nearbyBuilding.map(item => (
            <View
              key={item.id}
              className="nearbyBuilding"
              onClick={this.handleNearbyClick.bind(this, item.address+item.title,item.location.lat, item.location.lng)}
            >
              <View className="nearbyTitle">{item.title}</View>
              <View className="nearbyAddr">{item.address}</View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
