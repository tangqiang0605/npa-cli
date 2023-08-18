import fs from 'fs'
import { DEP, conveyPath, getPackageSize } from './until.js'
import { getDevDependencies } from './until.js'
const root = process.cwd()

export function PNPM_getDeps(pkg: string, path: string) {
  // 存储依赖信息 避免重复计算
  const depMap = new Map<string, DEP>()
  const deps = {
    dependencies: null,
    devDependencies: null,
  }
  const pkgJSON = JSON.parse(
    fs.readFileSync(`${path}\\package.json`, {
      encoding: 'utf-8',
    }),
  )
  if (
    pkgJSON['dependencies'] &&
    JSON.stringify(pkgJSON['dependencies']) !== '{}'
  ) {
    // 查找普通依赖
    deps.dependencies = getDependencies(pkgJSON['dependencies'], depMap)
  }
  if (
    pkgJSON['devDependencies'] &&
    JSON.stringify(pkgJSON['devDependencies']) !== '{}'
  ) {
    // 查找开发依赖
    deps.devDependencies = getDevDependencies(pkgJSON['devDependencies'])
  }
  return deps
}

const reg = /\^|\~/g
// 查找开发依赖
function getDependencies(info: any, depMap: Map<string, DEP>) {
  const dependencies = []
  for (let key in info) {
    key = conveyPath(key) // 名称格式化
    let version_key = `${key}@${info[key]}`
    if (reg.test(info[key])) {
      // 判断版本是否存在 ~ ^
      // 版本号替换成 @x.x.x
      version_key = `${key}${info[key].replace(reg, '@')}`
    }
    // 路径 判断是否存在子依赖
    const path = [
      `${root}\\node_modules\\.pnpm\\${version_key}\\node_modules\\${key}`,
      `${root}\\node_modules\\.pnpm\\${version_key}\\node_modules\\${key}\\package.json`,
    ]
    const folder = fs.existsSync(path[0])
    const file = fs.existsSync(path[1])
    if (folder && file) {
      // 文件夹和package.json文件都存在
      if (depMap.has(`${key}${info[key]}`)) {
        // 判断缓存中是否存在
        dependencies.push(depMap.get(`${key}${info[key]}`))
      } else {
        // 缓存中不存在
        const pkgJSON = JSON.parse(
          fs.readFileSync(`${path[1]}`, {
            encoding: 'utf-8',
          }),
        )
        const depInfo = {
          // 递归查找
          name: key,
          version: info[key],
          ...getPackageSize(path[0]),
          dependencies:
            pkgJSON.dependencies && JSON.stringify(pkgJSON.dependencies) != '{}'
              ? getDependencies(pkgJSON.dependencies, depMap)
              : null,
          devDependencies:
            pkgJSON.devDependencies &&
            JSON.stringify(pkgJSON.devDependencies) != '{}'
              ? getDevDependencies(pkgJSON['devDependencies'])
              : null,
        }
        // 放入缓存
        depMap.set(`${key}${info[key]}`, depInfo)
        dependencies.push(depInfo) // 加入结果数组
      }
    }
  }
  return dependencies
}

// 获取开发依赖
// function getDevDependencies(info: any) {
//   const devDependencies = []
//   for (const key in info) {
//     devDependencies.push({
//       name: key,
//       version: info[key],
//     })
//   }
//   return devDependencies
// }
