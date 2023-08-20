import { serveStaticMiddleware } from './middlewares/static.js'
import { resolveConfig } from '../config.js'
import connect from 'connect'
import { createOptimizeDepsRun } from '../optimizer/index.js'
import { apiServer } from './middlewares/index.js'
import { createWebSocketServer } from './ws.js'
import chokidar from 'chokidar'
import path from 'path'
import { wrapLoading } from '../utils.js'
import { handleHMRUpdate } from './hmr.js'
import { exec } from 'child_process'
import util from 'util'
const execPromisified = util.promisify(exec)

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

interface ServerConfig {
  // 命令所在路径
  root: string
  // 端口
  // port:Number
}
/**
 *
 * @param depth 递归深度
 * @param json
 * @returns
 */
async function createServer(depth, json) {
  // 配置中间件
  const config: ServerConfig = await resolveConfig()
  const middlewares = connect()
  const httpServer = require('http').createServer(middlewares)
  const ws = createWebSocketServer(httpServer)
  const watcher = chokidar.watch(path.resolve(config.root, 'package.json'))
  middlewares.use(serveStaticMiddleware(config))
  middlewares.use('/api', apiServer)

  // 工厂设计模式创建server对象
  const server = {
    ws,
    watcher,
    async listen(port) {
      // 在项目启动前进行依赖分析
      wrapLoading('building...', async () => {
        await runDeps(config)
        require('http')
          .createServer(middlewares)
          .listen(port, async () => {
            console.log(`server running at: http://localhost:${port}`)
          })
        if (!json) await openPage()
      })
    },
  }
  watcher.on('change', async (file) => {
    wrapLoading('change', async () => {
      await handleHMRUpdate(file, server)
    })
  })
  return server
}

async function runDeps(config) {
  let res = null
  try {
    res = await createOptimizeDepsRun(config)
  } catch (error) {
    console.log(error)
  }
  return res
}

async function openPage() {
  const cmd = `start http://localhost:9999`
  return await execPromisified(cmd)
}

export { createServer }
