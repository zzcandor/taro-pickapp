import Taro, { Component } from '@tarojs/taro';
import { View, Input, Map, CoverView, ScrollView } from '@tarojs/components';
import './index.scss';
import { AtTextarea  } from "taro-ui"

import {inject, observer} from "@tarojs/mobx";

@inject( 'cartstore','counterStore','addressstore')  //将方法注入到组件的porps中，通过this.props访问
@observer
export default class chooseaddress extends Component {
  constructor() {
    super(...arguments);
  }
    config = {
    navigationBarTitleText: '备注'
  }

      handlebzChange (e) {
    this.setState({
      beizhu:e.target.value
    })
      console.log(e.target.value)
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return e.target.value
  }



  save=()=>{
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

    let prevPage = pages[ pages.length - 2 ];

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。

        beizhu : this.state.beizhu

    })
    Taro.navigateBack()
}



  render() {
    return (
         <View>
        <AtTextarea
          count={false}
          value={this.state.beizhu}
          onChange={this.handlebzChange.bind(this)}
          maxLength={200}
          placeholder='备注.....'
        />
         <Button  onClick={this.save}>保存</Button>
        </View>
    )
  }
}
