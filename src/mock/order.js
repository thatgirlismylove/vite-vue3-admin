// 模拟获取订单列表的接口
export function getOrderList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: '00000',
        data: {
          list: [1, 2, 3]
        },
        msg: 'success'
      })
    }, 500)
  })
}
