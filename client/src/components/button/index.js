import Taro, { Component } from '@tarojs/taro'
import { Button, Text } from '@tarojs/components'
import { postcss } from '@utils/style'
import classNames from 'classnames'
import './index.scss'

export default class ButtonItem extends Component {
  static defaultProps = {
    compStyle: '',
    textStyle: '',
    openType: '',
    plain: false,
    loading: false,
    disabled: false,
    formType:'',
    onClick: () => {},
    onGetUserInfo: () => {}
  }

  getCls = (base) => {
    const { type, plain, disabled } = this.props
    return classNames(
      base,
      type === 'primary' && `${base}--primary`,
      plain && `${base}--plain`,
      disabled && `${base}--disabled`
    )
  }

     submit(e){
    let _access_token = "27_KEiU8BIz7aGHm3HZXeXSY9-LoeivM4t6e_87aFIbGUtnCbvJVs5IVFjRYQT5c4KypEmMyeBDQzuuoOjYlLOVb6B2GVOsxkb6tEXYirYoU7z86Kts_PF_SmRnimEVbuxTtZrfzGuG0BSyxJA6TNXhADAXRB"
    let url='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+_access_token
     let _jsonData = {
      access_token: _access_token,
      touser: 'op4P9461xCkoNgtBQK6r8VyzC6J8',
      template_id: 'XhZPxCE6l8I5c4tImAe4cJxtSbrF0R0IbIxPnHd6QDY',
      form_id: e.detail.formId,
      page: "pages/user/user",
      data: {
        "keyword1": { "value": "测试数据一", "color": "#173177" },
        "keyword2": { "value": "测试数据二", "color": "#173177" },
        "keyword3": { "value": "测试数据三", "color": "#173177" },
        "keyword4": { "value": "测试数据四", "color": "#173177" },
        "keyword5": { "value": "测试数据四", "color": "#173177" },
      }
    }

    console.log("form_id",e)
    Taro.request({
        url: url,
        data: _jsonData,
        method:'POST',
        success: function (res) {
          console.log(res)
        },
        fail: function (err) {
          console.log('request fail ', err);
        },
        complete: function (res) {
          console.log("request completed!");
        }

 })
}

  render () {
    const {
      compStyle, textStyle, openType, loading, disabled, text,
      onClick, onGetUserInfo,formType
    } = this.props
    return (
       <Form onSubmit={this.submit} report-submit="true">
      <Button
        className={this.getCls('comp-button')}
        style={postcss(compStyle)}
        loading={loading}
        disabled={disabled}
        openType={openType}
        onClick={onClick}
        formType="submit"
        onGetUserInfo={onGetUserInfo}
      >
        <Text
          className={this.getCls('comp-button__txt')}
          style={textStyle}
        >
          {text}
        </Text>
      </Button>
       </Form>
    )
  }
}

