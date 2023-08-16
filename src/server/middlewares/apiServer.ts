import { resolveConfig } from '../../config.js'
import { createOptimizeDepsRun } from 'optimizer/index.js'

interface ServerConfig {
  // 命令所在路径
  root: string
  // 端口
  // port:Number
}

async function apiServer(req, res, next) {
  const config: ServerConfig = await resolveConfig()
  const data = await createOptimizeDepsRun(config)
  // next()
  res.end(JSON.stringify(data))
}

export { apiServer }
