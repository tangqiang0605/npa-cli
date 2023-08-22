import fs from 'fs'
import { DEP, conveyPath, getDevDependencies, getPackageSize } from './until.js'
const root = process.cwd()

type MappedInt = Map<string, Set<string>>
// npm
export function NPM_getDeps(
  pkg: string,
  path: string,
  depth: number,
  depMapped: MappedInt,
) {
  const deps = {
    dependencies: null,
    devDependencies: null,
  }
  // 存储依赖信息 避免重复计算
  const depMap = new Map<string, DEP>()
  const pkgJSON = JSON.parse(
    fs.readFileSync(`${path}\\package.json`, {
      encoding: 'utf-8',
    }),
  )
  if (
    pkgJSON['dependencies'] &&
    JSON.stringify(pkgJSON['dependencies']) !== '{}'
  ) {
    deps.dependencies = getDependencies(
      pkg,
      path,
      pkgJSON['dependencies'],
      depMap,
      depth,
      depMapped,
    )
  }
  if (
    pkgJSON['devDependencies'] &&
    JSON.stringify(pkgJSON['devDependencies']) !== '{}'
  ) {
    deps.devDependencies = getDevDependencies(pkgJSON['devDependencies'])
  }
  return deps
}

// 获取普通依赖
function getDependencies(
  pkg: string,
  path: string,
  info: any,
  depMap: Map<string, DEP>,
  depth: number,
  depMapped: MappedInt,
) {
  if (depth <= 0 && !Number.isNaN(depth)) return null
  !Number.isNaN(depth) && depth--
  const dependencies = []
  for (let key in info) {
    // 如果存在循环依赖
    if (depMapped.has(key) && depMapped.get(key).has(pkg)) {
      console.log('circle')

      dependencies.push({
        name: `${key}(circular dependence with ${pkg})`,
        version: info[key],
      })
    } else {
      key = conveyPath(key)
      // 判断缓存中是否存在
      if (depMap.has(`${key}${info[key]}`)) {
        dependencies.push(depMap.get(`${key}${info[key]}`))
      } else {
        // 判断内部是否存在 node_modules
        const innerPath = [
          `${path}\\node_modules\\${key}`,
          `${path}\\node_modules\\${key}\\package.json`,
        ]
        const innerExistFolder = fs.existsSync(innerPath[0])
        const innerExistFile = fs.existsSync(innerPath[1])

        // 判断内部node_modules
        if (innerExistFolder && innerExistFile) {
          const pkgJSON = JSON.parse(
            fs.readFileSync(`${innerPath[1]}`, {
              encoding: 'utf-8',
            }),
          )
          const depInfo = {
            name: key,
            version: info[key],
            ...getPackageSize(innerPath[0]),
            dependencies:
              pkgJSON.dependencies &&
              JSON.stringify(pkgJSON.dependencies) !== '{}'
                ? getDependencies(
                    key,
                    innerPath[0],
                    pkgJSON.dependencies,
                    depMap,
                    depth,
                    depMapped,
                  )
                : null,
            devDependencies:
              pkgJSON.devDependencies &&
              JSON.stringify(pkgJSON.devDependencies) !== '{}'
                ? getDevDependencies(pkgJSON.devDependencies)
                : null,
          }
          depMap.set(`${key}${info[key]}`, depInfo)
          dependencies.push(depInfo) // 加入结果数组
        } else {
          // 判断顶部node_modules
          const outerPath = [
            `${root}\\node_modules\\${key}`,
            `${root}\\node_modules\\${key}\\package.json`,
          ]
          const outerExistFolder = fs.existsSync(outerPath[0])
          const outerExistFile = fs.existsSync(outerPath[1])

          if (outerExistFolder && outerExistFile) {
            const pkgJSON = JSON.parse(
              fs.readFileSync(`${outerPath[1]}`, {
                encoding: 'utf-8',
              }),
            )

            const depInfo = {
              name: key,
              version: info[key],
              ...getPackageSize(outerPath[0]),
              dependencies:
                pkgJSON.dependencies &&
                JSON.stringify(pkgJSON.dependencies) !== '{}'
                  ? getDependencies(
                      key,
                      outerPath[0],
                      pkgJSON.dependencies,
                      depMap,
                      depth,
                      depMapped,
                    )
                  : null,
              devDependencies:
                pkgJSON.devDependencies &&
                JSON.stringify(pkgJSON.devDependencies) !== '{}'
                  ? getDevDependencies(pkgJSON.devDependencies)
                  : null,
            }
            depMap.set(`${key}${info[key]}`, depInfo)
            dependencies.push(depInfo) // 加入结果数组
          }
        }
      }
    }
  }
  return dependencies.length ? dependencies : null
}

export function NPM_getDepInfo(deps: any) {
  const depMap: MappedInt = new Map()

  for (const key in deps) {
    depMap.set(`${key}`, new Set<string>())
    const pkgJSON = JSON.parse(
      fs.readFileSync(`${root}\\node_modules\\${key}\\package.json`, 'utf-8'),
    )

    for (const _key in pkgJSON.dependencies) {
      depMap.get(`${key}`).add(`${_key}`)
    }
  }
  return depMap
}
