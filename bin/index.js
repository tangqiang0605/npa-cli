#! /usr/bin/env node
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
import { program } from 'commander'
import { createRequire } from 'module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import chalk from 'chalk'
import { createServer } from './server/index.js'
// 获取本模块的绝对路径
var __filename = fileURLToPath(import.meta.url)
export var __dirname = dirname(__filename)
// const __baseDir = join(__dirname, '..')
// 使用require方法读取json文件（package.json)
var require = createRequire(import.meta.url)
var pkg = require(join(__dirname, '../package.json'))
program.version('npa-cli@'.concat(pkg.version)).usage('<command> [option]')
// 创建命令：介绍，参数选项，行为
program
  .command('analyze')
  .description('Build dependency tree')
  .option('-d --depth <n>', 'Limit the analysis of depth n')
  .option(
    '-j, --json <file-path>',
    'Save the output as JSON to the specified file',
  )
  .action(function (option) {
    return __awaiter(void 0, void 0, void 0, function () {
      var depth, json
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            ;(depth = option.depth), (json = option.json)
            if (!json) return [3 /*break*/, 2]
            return [4 /*yield*/, import('./commands/create.js')]
          case 1:
            _a.sent().default(option)
            return [3 /*break*/, 3]
          case 2:
            ;(function () {
              return __awaiter(this, void 0, void 0, function () {
                var server
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, createServer(depth, json)]
                    case 1:
                      server = _a.sent()
                      server.listen(9999)
                      return [2 /*return*/]
                  }
                })
              })
            })()
            _a.label = 3
          case 3:
            return [2 /*return*/]
        }
      })
    })
  })
program.addHelpText(
  'after',
  '\nRun '.concat(
    chalk.blueBright('npa-cli <command> --help'),
    ' for detailed usage of given command.',
  ),
)
// 直接解析用户参数
program.parse(process.argv)
//# sourceMappingURL=index.js.map
