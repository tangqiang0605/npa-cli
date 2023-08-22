import fs from 'fs'
import { getPackageSize, getDevDependencies, initPkgMap } from './until.js'
import { NPM_getDepInfo, NPM_getDeps } from './npm.js'
import { PNPM_getDeps } from './pnpm.js'

let depth = NaN,
  json = null
/**
 * @description 通过该函数注入参数（depth、json）
 * @param _option
 */
export function saveOption(_option: { depth: number; json: string }) {
  depth = _option.depth
  json = _option.json
}

export async function scanDeps(config: any) {
  let deps = null
  if (depth <= 0 && !Number.isNaN(depth)) return deps // 如果传入的层次为 0
  initPkgMap()
  const type = buildType(config)
  if (type === 'none') return deps
  deps = getRootDeps(config, type, depth)
  return deps
}

// 判斷项目构建类型
function buildType(config: any) {
  if (
    !fs.existsSync(`${config.root}\\node_modules`) ||
    !fs.existsSync(`${config.root}\\package.json`)
  )
    return 'none'
  if (fs.existsSync(`${config.root}\\pnpm-lock.yaml`)) {
    return 'pnpm'
  } else if (fs.existsSync(`${config.root}\\yarn.lock`)) {
    return 'yarn'
  } else if (fs.existsSync(`${config.root}\\package-lock.json`)) {
    return 'npm'
  }
  return 'none'
}

async function getRootDeps(config: any, type: string, depth: number) {
  const { root } = config
  const deps = {
    dependencies: null, // 依赖
    devDependencies: null, // 开发依赖
  }

  // 读取根package.json
  const pkgJSON = JSON.parse(
    fs.readFileSync(`${config.root}\\package.json`, 'utf-8'),
  )
  const dependencies = pkgJSON.dependencies // 获取依赖
  const devDependencies = pkgJSON.devDependencies // 获取开发依赖
  let depMapped = null

  // 判断项目构建类型
  switch (type) {
    case 'npm':
    case 'yarn':
      depMapped = NPM_getDepInfo(dependencies)
      break
  }
  console.log(depMapped, '----')

  !Number.isNaN(depth) && depth--
  if (dependencies && JSON.stringify(dependencies) !== '{}') {
    deps.dependencies = []
    for (const key in dependencies) {
      let _deps = null
      const path = `${root}\\node_modules\\${key}`
      switch (type) {
        case 'npm':
        case 'yarn':
          _deps = NPM_getDeps(key, path, depth, depMapped)
          break
        case 'pnpm':
          _deps = PNPM_getDeps(key, path, depth)
          break
      }
      deps.dependencies.push({
        name: key,
        version: dependencies[key],
        ...getPackageSize(path),
        dependencies: _deps.dependencies,
        devDependencies: _deps.devDependencies,
      })
    }
  }
  if (devDependencies && JSON.stringify(devDependencies) !== '{}') {
    deps.devDependencies = getDevDependencies(devDependencies)
  }

  return deps
}
