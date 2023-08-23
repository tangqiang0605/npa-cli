import { resolveConfig } from '../../config.js'
import type { ServerConfig } from '../../config.js'
import { createOptimizeDepsRun } from '../../optimizer/index.js'

async function apiServer(req, res, next) {
  const config: ServerConfig = await resolveConfig()
  // 这里应该再写其它接口
  const data = await createOptimizeDepsRun(config)
  // next()
  res.end(JSON.stringify(data))
}

export { apiServer }
