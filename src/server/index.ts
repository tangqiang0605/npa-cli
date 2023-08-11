import { serveStaticMiddleware } from './middlewares/static.js'
import { resolveConfig } from '../config.js'
import connect from 'connect'
import { createOptimizeDepsRun } from '../optimizer/index.js'
import { apiServer } from './middlewares/index.js'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

interface ServerConfig {
  // 命令所在路径
  root: string
  // 端口
  // port:Number
}

async function createServer() {
  // 配置中间件
  const config: ServerConfig = await resolveConfig()
  const middlewares = connect()
  middlewares.use(serveStaticMiddleware(config))
  middlewares.use('/api', apiServer)

  // 工厂设计模式创建server对象
  const server = {
    async listen(port) {
      // 在项目启动前进行依赖分析
      await runDeps(config)
      require('http')
        .createServer(middlewares)
        .listen(port, async () => {
          console.log(`server running at: http://localhost:${port}`)
        })
    },
  }
  return server
}

async function runDeps(config) {
  return await createOptimizeDepsRun(config)
}

export { createServer }
