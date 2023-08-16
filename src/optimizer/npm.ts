import fs from 'fs'
import { conveyPath, getPackageSize } from './until.js'
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
    pkgJSON['dependencies'] ||
    JSON.stringify(pkgJSON['dependencies']) !== '{}'
  ) {
    deps.dependencies = getDependencies(pkg, path, pkgJSON['dependencies'])
  }
  if (
    pkgJSON['devDependencies'] ||
    JSON.stringify(pkgJSON['devDependencies']) !== '{}'
  ) {
    deps.devDependencies = getDevDependencies(pkgJSON['devDependencies'])
  }
  return deps
}

function getDependencies(pkg: string, path: string, info: any) {
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
        dependencies: pkgJSON.dependencies
          ? getDependencies(key, innerPath[0], pkgJSON.dependencies)
          : null,
        devDependencies: pkgJSON.devDependencies
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
            ? getDependencies(key, outerPath[0], pkgJSON.dependencies)
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

function getDevDependencies(info: any) {
  const devDependencies = []
  for (const key in info) {
    devDependencies.push({
      name: key,
      version: info[key],
    })
  }
  return devDependencies
}

// export function NPM_getDeps(config: any, pkg: string) {
//   const root = config.root
//   let res = check(config, pkg)

//   if (!res) return null
//   pkg = conveyPath(pkg)
//   const deps = {
//     dependencies: null,
//     devDependencies: null
//   }
//   const pkgJSON = JSON.parse(fs.readFileSync(`${root}\\node_modules\\${pkg}\\package.json`, {
//     encoding: "utf-8"
//   }))
//   if (pkgJSON["dependencies"] || JSON.stringify(pkgJSON["dependencies"]) !== '{}') {
//     deps.dependencies = getDependencies(config, pkg)
//   }
//   if (pkgJSON["devDependencies"] || JSON.stringify(pkgJSON["devDependencies"]) !== '{}') {
//     deps.devDependencies = getDevDependencies(config, pkg, pkgJSON["devDependencies"])
//   }
//   return deps
// }

// // 获取依赖
// export function getDependencies(config: any, pkg: string) {
//   const root = config.root
//   let res = check(config, pkg)
//   if (!res) return null
//   pkg = conveyPath(pkg)
//   const pkgJSON = JSON.parse(fs.readFileSync(`${root}\\node_modules\\${pkg}\\package.json`, {
//     encoding: "utf-8"
//   }))
//   if (!pkgJSON["dependencies"] || JSON.stringify(pkgJSON["dependencies"]) === '{}') {
//     return null
//   }
//   const deps = []
//   // 递归查找依赖所属的依赖
//   for (let key in pkgJSON["dependencies"]) {
//     if (key.indexOf("/") !== -1) {
//       key = key.split("/").join("\\")
//     }
//     let existFolder = fs.existsSync(`${root}\\node_modules\\${key}`)
//     let existFile = fs.existsSync(`${root}\\node_modules\\${key}\\package.json`)
//     if (!existFolder || !existFile) continue
//     deps.push({
//       name: key,
//       version: pkgJSON["dependencies"][key],
//       ...getPackageSize(config, key),
//       dependencies: getDependencies(config, key)
//     })
//   }
//   return deps.length === 0 ? null : deps
// }

// // 获取开发依赖
// export function getDevDependencies(config: any, pkg: string, info: any) {
//   const deps = []
//   for (let key in info) {
//     deps.push({
//       name: key,
//       version: info[key],
//     })
//   }
//   return deps.length === 0 ? null : deps
// }
