import { WebSocketServer } from 'ws'
export function createWebSocketServer(httpServer) {
  // websocket 服务器可以和 http 服务器共享地址和端口
  var wss = new WebSocketServer({ noServer: true })
  // 当HTTP服务器接收到客户端发出的升级协议请求的时候
  httpServer.on('upgrade', function (req, client, head) {
    if (req.headers['sec-websocket-protocol'] === 'npa-cli') {
      // 把通信协议 从HTTP协议升级成WS协议
      wss.handleUpgrade(req, client, head, function (client) {
        wss.emit('connection', client, req) // 连接成功
      })
    }
  })
  // 当服务器监听到客户端的连接 请求成功的时候
  wss.on('connection', function (client) {
    client.send(
      JSON.stringify({
        type: 'connected',
      }),
    )
    console.log('客户端连接成功')
  })
  return {
    on: wss.on.bind(wss),
    off: wss.off.bind(wss),
    send: function (payload) {
      // 调用此方法可以向所有的客户端发送消息
      var stringified = JSON.stringify(payload)
      wss.clients.array.forEach(function (client) {
        client.send(stringified)
      })
    },
  }
}
// 前端
// var socket = new WebSocket(`ws://${window.location.host}`, 'npa-cli')
// socket.addEventListener('message', async (event) => {
//   const message = JSON.parse(event.data)
//   if (message.type === 'update') {
//     const updatedFilePath = message.path
//     console.log(`收到更新消息`)
//     // 在这里执行热更新操作，比如重新请求数据等
//   }
// })
//# sourceMappingURL=ws.js.map
