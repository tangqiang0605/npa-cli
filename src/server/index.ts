import {
  globalStatic,
  projectStatic,
  serveStaticMiddleware,
} from './middlewares/static.js'
import { apiServer } from './middlewares/apiServer.js'
import connect from 'connect'
import { createWebSocketServer } from './hmrServer/ws.js'
import chokidar from 'chokidar'
import path from 'path'
import { handleHMRUpdate } from './hmrServer/hmr.js'
import {
  execPromisified,
  logInfo,
  require,
  wrapLoading,
} from '../utils/utils.js'
import { detectPort } from '../utils/detectPort.js'
// import chalk from 'chalk'

// depth参数 todo
async function createServer(config) {
  const middlewares = connect()

  middlewares.use(globalStatic(config))
  middlewares.use(projectStatic(config))
  middlewares.use(serveStaticMiddleware(config))
  middlewares.use('/api', apiServer)

  // 热更新
  const httpServer = require('http').createServer(middlewares)
  const ws = createWebSocketServer(httpServer)
  const watcher = chokidar.watch(path.resolve(config.root, 'package.json'))
  watcher.on('change', async (file) => {
    wrapLoading('change', async (whenSucceedCb) => {
      await handleHMRUpdate(file, server)
      whenSucceedCb(() => logInfo('rebuild successed'))
    })
  })

  const server = {
    ws,
    watcher,
    async listen(port) {
      const result = await detectPort(port)
      if (result) {
        wrapLoading('building...', async (whenSucceedCb) => {
          httpServer.listen(port, async () => {
            whenSucceedCb(() =>
              logInfo(`server running at: http://localhost:${port}`),
            )
          })
          await openPage(port)
        })
      } else {
        this.listen(port + 1)
      }
    },
  }

  server.listen(config.defaultPort)

  // 工厂设计模式创建server对象
  // return server
}

// 打开链接
async function openPage(port) {
  const cmd = `start http://localhost:${port}`
  return await execPromisified(cmd)
}

export { createServer }
