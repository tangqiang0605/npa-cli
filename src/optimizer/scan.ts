import fs from 'fs'
import { getPackageSize } from './until.js'
import { NPM_getDeps } from './npm.js'

export async function scanDeps(config: any) {
  const type = buildType(config)
  let deps = null
  if (type === 'npm' || type === 'yarn') {
    deps = getRootDeps(config, type)
  }
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

async function getRootDeps(config: any, type: string) {
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

  if (dependencies && JSON.stringify(dependencies) !== '{}') {
    deps.dependencies = []
    for (const key in dependencies) {
      let _deps = null
      const path = `${root}\\node_modules\\${key}`
      switch (type) {
        case 'npm' || 'yarn':
          _deps = NPM_getDeps(key, path)
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

  return deps

  // const deps = {
  //   dependencies: [],
  //   devDependencies: []
  // }
  // // 读取package.json
  // const pkgPath = `${config.root}\\package.json`
  // const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  // const dependencies = pkg.dependencies;  // 获取依赖
  // const devDependencies = pkg.devDependencies  // 获取开发依赖

  // for (let key in dependencies) {
  //   let _deps = null
  //   switch(type) {
  //     case 'npm' || 'yarn':
  //       _deps = NPM_getDeps(config, key)
  //       break
  //   }

  //   deps.dependencies.push({
  //     name: key,
  //     version: dependencies[key],
  //     ...getPackageSize(config, key),
  //     dependencies: _deps.dependencies,
  //     devDependencies: _deps.devDependencies
  //   })
  // }

  // for(let key in devDependencies) {
  //   deps.devDependencies.push({
  //     name: key,
  //     version: devDependencies[key]
  //   })
  // }
  // return deps
}

// async function tyrResolve(id: string, config) {
//     // 例如：vue/package.json
//     const pkgPath = resolve.sync(`${id}/package.json`, { basedir: config.root });
//     const pkgDir = path.dirname(pkgPath);
//     const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
//     const dependencies = pkg.dependencies;
//     const devDependencies = pkg.devDependencies
//     return { dependencies, devDependencies }
// }
