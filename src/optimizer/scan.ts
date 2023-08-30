import fs from 'fs'
import {
  getPackageSize,
  getDevDependencies,
  initPkgMap,
  getRandomCode,
} from './until.js'
// import { NPM_getDepInfo, NPM_getDeps } from './npm.js'
import { PNPM_getDeps } from './pnpm.js'
import { NPM_getDeps } from './npm.js'
import { join } from 'node:path'

let depth = NaN,
  json = null
/**
 * @description 通过该函数注入参数（depth、json）
 * @param _option
 */
export function saveOption(_option: { depth: number; json: string }) {
  depth = Number(_option.depth)
  json = _option.json
}

export async function scanDeps(config: any) {
  let deps = null
  if (depth <= 0 && !Number.isNaN(depth)) return deps // 如果传入的层次为 0
  const type = buildType(config)
  if (type === 'none') return deps
  // 开始分析
  initPkgMap()
  deps = getRootDeps(config, type, depth)
  return deps
}

// 判斷项目构建类型
function buildType(config: any) {
  if (
    !fs.existsSync(join(config.root, 'node_modules')) ||
    !fs.existsSync(join(config.root, 'package.json'))
  )
    return 'none'
  if (fs.existsSync(join(config.root, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  } else if (fs.existsSync(join(config.root, 'yarn.lock'))) {
    return 'yarn'
  } else if (fs.existsSync(join(config.root, 'package-lock.json'))) {
    return 'npm'
  }
  return 'none'
}

async function getRootDeps(config: any, type: string, depth: number) {
  const { root } = config
  // 读取当前package.json
  const pkgJSON = JSON.parse(
    fs.readFileSync(join(root, 'package.json'), {
      encoding: 'utf-8',
    }),
  )
  const deps = {
    dependencies: null, // 依赖
    devDependencies: null, // 开发依赖
  }
  const depSet = new Set<string>()
  // 读取根package.json
  const dependencies = pkgJSON.dependencies // 获取依赖
  const devDependencies = pkgJSON.devDependencies // 获取开发依赖

  !Number.isNaN(depth) && depth--
  if (dependencies && JSON.stringify(dependencies) !== '{}') {
    deps.dependencies = {
      points: [],
      arrows: [],
      top: [],
    }
    for (const key in dependencies) {
      const path = join(root, 'node_modules', key)
      const id = `${key}${dependencies[key]}`
      const group = getRandomCode()
      if (depSet.has(id)) continue
      depSet.add(`${id}`)
      deps.dependencies.top.push(key)
      deps.dependencies.points.push({
        id,
        name: key,
        version: dependencies[key],
        ...getPackageSize(path),
        group,
      })
      if (type === 'npm' || type === 'yarn') {
        NPM_getDeps(
          path,
          { name: key, version: dependencies[key] },
          depth,
          depSet,
          deps.dependencies.points,
          deps.dependencies.arrows,
          group,
        )
      } else if (type === 'pnpm') {
        PNPM_getDeps(
          path,
          { name: key, version: dependencies[key] },
          depth,
          depSet,
          deps.dependencies.points,
          deps.dependencies.arrows,
          group,
        )
      }
    }
  }
  if (devDependencies && JSON.stringify(devDependencies) !== '{}') {
    deps.devDependencies = {
      points: getDevDependencies(devDependencies),
      arrows: [],
      top: Object.keys(devDependencies),
    }
  }
  return deps
}
