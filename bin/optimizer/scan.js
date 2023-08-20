var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
import fs from 'fs'
import { getPackageSize } from './until.js'
import { NPM_getDeps } from './npm.js'
export function scanDeps(config) {
  return __awaiter(this, void 0, void 0, function () {
    var type, deps
    return __generator(this, function (_a) {
      type = buildType(config)
      deps = null
      if (type === 'npm' || type === 'yarn') {
        deps = getRootDeps(config, type)
      }
      return [2 /*return*/, deps]
    })
  })
}
// 判斷项目构建类型
function buildType(config) {
  if (
    !fs.existsSync(''.concat(config.root, '\\node_modules')) ||
    !fs.existsSync(''.concat(config.root, '\\package.json'))
  )
    return 'none'
  if (fs.existsSync(''.concat(config.root, '\\pnpm-lock.yaml'))) {
    return 'pnpm'
  } else if (fs.existsSync(''.concat(config.root, '\\yarn.lock'))) {
    return 'yarn'
  } else if (fs.existsSync(''.concat(config.root, '\\package-lock.json'))) {
    return 'npm'
  }
  return 'none'
}
function getRootDeps(config, type) {
  return __awaiter(this, void 0, void 0, function () {
    var root, deps, pkgJSON, dependencies, devDependencies, key, _deps, path_1
    return __generator(this, function (_a) {
      root = config.root
      deps = {
        dependencies: null,
        devDependencies: null, // 开发依赖
      }
      pkgJSON = JSON.parse(
        fs.readFileSync(''.concat(config.root, '\\package.json'), 'utf-8'),
      )
      dependencies = pkgJSON.dependencies // 获取依赖
      devDependencies = pkgJSON.devDependencies // 获取开发依赖
      if (dependencies && JSON.stringify(dependencies) !== '{}') {
        deps.dependencies = []
        for (key in dependencies) {
          _deps = null
          path_1 = ''.concat(root, '\\node_modules\\').concat(key)
          switch (type) {
            case 'npm' || 'yarn':
              _deps = NPM_getDeps(key, path_1)
              break
          }
          deps.dependencies.push(
            __assign(
              __assign(
                { name: key, version: dependencies[key] },
                getPackageSize(path_1),
              ),
              {
                dependencies: _deps.dependencies,
                devDependencies: _deps.devDependencies,
              },
            ),
          )
        }
      }
      return [
        2 /*return*/,
        deps,
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
      ]
    })
  })
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
//# sourceMappingURL=scan.js.map
