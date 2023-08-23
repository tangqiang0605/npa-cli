import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { require } from './utils/utils.js'

async function resolveConfig() {
  // 本项目的路径
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const __baseDir = join(__dirname, '..')

  // 本项目的配置信息
  const pkg = require(join(__dirname, '../package.json'))
  const version = pkg.version || 'version not found'

  const defaultPort = 9999
  // 执行命令的位置
  const root = process.cwd()

  const config = {
    __filename,
    __dirname,
    __baseDir,
    pkg,
    version,
    defaultPort,
    root,
  }
  return config
}

export interface ServerConfig {
  __filename: string
  __dirname: string
  __baseDir: string
  pkg: any
  version: string
  defaultPort: number
  root: string
}

export { resolveConfig }
