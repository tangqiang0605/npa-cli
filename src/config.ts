import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { require } from './utils/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const __baseDir = join(__dirname, '..')

const pkg = require(join(__dirname, '../package.json'))
const version = pkg.version || 'version not found'

const cwd = process.cwd()

async function resolveConfig() {
  const root = process.cwd()

  const config = {
    // 执行命令的位置
    root,
    // 默认端口
    defaultPort: 9999,
    version,
  }
  return config
}

export interface ServerConfig {
  root: string
  defaultPort: number
}

export { resolveConfig, version, pkg, __baseDir, __filename, __dirname, cwd }
