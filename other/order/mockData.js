var i=0;
Mock.mock("http://localhost:8080/order", "get", {
  "code": "S6000",
  "exceptionMsg": "处理数据成功",
  "status": "1",
  data: {
    "deviceId|1": "1",
    "deviceName|1-4": "0",
    "orderId|1-7":'A1',
    "orderTime|11":'1'
  }
});