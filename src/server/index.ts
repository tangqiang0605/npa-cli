import { serveStaticMiddleware } from './middlewares/static.js'
import { apiServer } from './middlewares/apiServer.js'
import { resolveConfig } from '../config.js'
import type { ServerConfig } from '../config.js'
import connect from 'connect'
import { createOptimizeDepsRun } from '../optimizer/index.js'
import { createWebSocketServer } from './hmrServer/ws.js'
import chokidar from 'chokidar'
import path from 'path'
import { handleHMRUpdate } from './hmrServer/hmr.js'
import { execPromisified, require, wrapLoading } from '../utils/utils.js'
import { detectPort } from '../utils/detectPort.js'

/**
 *
 * @param depth 递归深度
 * @param json
 * @returns
 */
// depth参数 todo
async function createServer() {
  const config: ServerConfig = await resolveConfig()

  const middlewares = connect()
  middlewares.use(serveStaticMiddleware(config))
  middlewares.use('/api', apiServer)

  // 这个和服务器实例有关系吗 todo
  const httpServer = require('http').createServer(middlewares)
  const ws = createWebSocketServer(httpServer)
  const watcher = chokidar.watch(path.resolve(config.root, 'package.json'))
  watcher.on('change', async (file) => {
    wrapLoading('change', async () => {
      await handleHMRUpdate(file, server)
    })
  })

  // 工厂设计模式创建server对象
  const server = {
    ws,
    watcher,
    async listen(port) {
      wrapLoading('building...', async () => {
        await runDeps(config)
        const result = await detectPort(port)
        if (result) {
          httpServer.listen(port, async () => {
            console.log(`server running at: http://localhost:${port}`)
          })
          await openPage()
        } else {
          this.listen(port + 1)
        }
      })
    },
  }

  server.listen(config.defaultPort)

  // return server
}

// 依赖分析
async function runDeps(config) {
  let res = null
  try {
    res = await createOptimizeDepsRun(config)
  } catch (error) {
    console.log(error)
  }
  return res
}

// 打开链接
async function openPage() {
  const cmd = `start http://localhost:9999`
  return await execPromisified(cmd)
}

export { createServer }
