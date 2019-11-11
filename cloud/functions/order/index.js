const cloud = require('wx-server-sdk')

cloud.init(
    {  envName: 'database-yh',
       mpAppId: 'wx3011a047f254103f',}
)


exports.main = async (event,context) => {
  const db = cloud.database()  //获取数据库实例
  const { func, data } = event

  let res

  if (func === 'updatepay') {
    res = await updatepay(db, data)
  } else if (func === 'creatorder') {
    res = await addOrder(db, data)
  } else if (func === 'getorder') {
    res = await getorder(db, data)
  } else if (func === 'updateorder') {
    res = await updateorder(db, data)
  } else if (func === 'getallorder') {
    res = await getallorder(db, data)
  }

  return {
    data: res
  }
}


async function addOrder (db, data) {
  const OPENID=cloud.getWXContext().OPENID
  const {  orderdict } = data
  const orderColl = db.collection('order')  //获取数据库中的订单集合

  const orderId = Math.random().toString(36).substr(2)
  const orderData = {
    _id: orderId,
    submitdate: db.serverDate(),
    ispaid: false,
    owner:OPENID,
    price: orderdict.totalprice,
    count:orderdict.totalcount,
    orderdetail:orderdict.checkedlist
  }

  await orderColl.add({data:orderData}).then(res=>{console.log("添加进数据库里的数据为",res)}).catch(err => {console.log(err)})   // 新插入订单

  return {
    code: 0,
    msg: '成功生成订单',
    data: orderData
  }
}

async function getorder (db, data) {
  const { _id } = data
  const orderColl = db.collection('order')
  const _ = db.command

  const res = await orderColl.doc(_id).get()

  const orderData = res.data
  console.log('查询数据库内容',res.data)

  return orderData
}


async function updateorder (db, data) {
  const { _id,neworder } = data
  const orderColl = db.collection('order')
  const _ = db.command

  const res = await orderColl.doc(_id).update({data:neworder})

  const orderData = res
  console.log('更新数据库内容',res)

  return orderData
}


async function updatepay (db, data) {
  const { _id } = data
  const orderColl = db.collection('order')
  const _ = db.command

  const res = await orderColl.doc(_id).update({data:{ispaid:true}})

  const orderData = res
  console.log('更新数据库内容',res)

  return orderData
}



async function getallorder (db, data) {
  const openid=cloud.getWXContext().OPENID
  const orderColl = db.collection('order')
  const _ = db.command
  const res = await orderColl.where({
          owner: openid,
        })
        .get({
          success: function(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)
          }
        })

  const orderData =res
  console.log('查询所有订单内容',res.data)

  return orderData
}

