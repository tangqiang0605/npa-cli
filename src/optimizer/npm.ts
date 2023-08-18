import fs from 'fs'
import { conveyPath, getDevDependencies, getPackageSize } from './until.js'
const root = process.cwd()

// npm
export function NPM_getDeps(pkg: string, path: string) {
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
    deps.dependencies = getDependencies(path, pkgJSON['dependencies'])
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
function getDependencies(path: string, info: any) {
  const dependencies = []
  for (let key in info) {
    key = conveyPath(key)
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
      dependencies.push({
        name: key,
        version: info[key],
        ...getPackageSize(innerPath[0]),
        dependencies:
          pkgJSON.dependencies && JSON.stringify(pkgJSON.dependencies) !== '{}'
            ? getDependencies(innerPath[0], pkgJSON.dependencies)
            : null,
        devDependencies:
          pkgJSON.devDependencies &&
          JSON.stringify(pkgJSON.devDependencies) !== '{}'
            ? getDevDependencies(pkgJSON['devDependencies'])
            : null,
      })
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
        dependencies.push({
          name: key,
          version: info[key],
          ...getPackageSize(outerPath[0]),
          dependencies: pkgJSON.dependencies
            ? getDependencies(outerPath[0], pkgJSON.dependencies)
            : null,
          devDependencies: pkgJSON.devDependencies
            ? getDevDependencies(pkgJSON.devDependencies)
            : null,
        })
      }
    }
  }
  return dependencies.length ? dependencies : null
}
