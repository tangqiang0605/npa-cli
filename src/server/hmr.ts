/**
 * 当检测到文件发生改变后，处理热更新
 * @param file 变化的文件
 * @param server
 */
export function handleHMRUpdate(file, server) {
  server.ws.send({
    type: 'update',
    path: file,
  })
}
