const cloud = require('wx-server-sdk')

cloud.init(
    {  envName: 'database-yh',
       mpAppId: 'wx3011a047f254103f',}
)


exports.main = async (event,context) => {
  const db = cloud.database()  //获取数据库实例
  const { func, data } = event

  let res

  if (func === 'getBalance') {
    res = await getBalance(db, data)
  } else if (func === 'creatorder') {
    res = await addOrder(db, data)
  } else if (func === 'getorder') {
    res = await getorder(db, data)
  } else if (func === 'getOrderDetail') {
    res = await getOrderDetail(db, data)
  } else if (func === 'cancelOrder') {
    res = await cancelOrder(db, data)
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
