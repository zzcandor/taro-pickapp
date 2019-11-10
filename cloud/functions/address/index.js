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
  } else if (func === 'addaddress') {
    res = await addaddress(db, data)
  } else if (func === 'getaddress') {
    res = await getaddress(db, data)
  } else if (func === 'getOrderDetail') {
    res = await getOrderDetail(db, data)
  } else if (func === 'cancelOrder') {
    res = await cancelOrder(db, data)
  }

  return {
    data: res
  }
}


async function addaddress (db, data) {
  const OPENID=cloud.getWXContext().OPENID
  const {  addressdict } = data
  const addressColl = db.collection('address')  //获取数据库中的订单集合

  const orderId = Math.random().toString(36).substr(2)
  const Data = {
    _id: orderId,
    submitdate: db.serverDate(),
    owner:OPENID,
    name: addressdict.name,
    phone:addressdict.phone,
    address:addressdict.address,
    checked:false,
  }

  await addressColl.add({data:Data}).then(res=>{console.log("添加进数据库里的数据为",res)}).catch(err => {console.log(err)})   // 新插入订单

  return {
    code: 0,
    msg: '成功生成订单',
    data: Data
  }
}

async function getaddress (db, data) {
  const addressColl = db.collection('address')
  const _ = db.command

  const res = await addressColl.get()

  const Data = res.data
  console.log('查询数据库内容',res.data)

  return Data
}
