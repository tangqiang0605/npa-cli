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
import path, { resolve } from 'path'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'
import { wrapLoading } from '../utils.js'
import { resolveConfig } from '../config.js'
import { createOptimizeDepsRun } from '../optimizer/index.js'
import moment from 'moment'
export default function (option) {
  return __awaiter(this, void 0, void 0, function () {
    var cwd, json, targetDir, time, outputFile, action, config, data
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cwd = process.cwd()
          json = option.json
          targetDir = path.join(cwd, json)
          time = moment().format('-YYYY-MM-DD-HH_mm_ss')
          outputFile = resolve(targetDir, 'result'.concat(time, '.json'))
          if (!existsSync(targetDir)) return [3 /*break*/, 3]
          return [
            4 /*yield*/,
            inquirer.prompt([
              {
                name: 'action',
                type: 'list',
                message: '目标目录已存在，是否继续？',
                choices: [
                  { name: 'overwrite', value: 'overwrite' },
                  { name: 'cancel', value: false },
                ],
              },
            ]),
          ]
        case 1:
          action = _a.sent().action
          if (!action) {
            return [2 /*return*/, console.log('用户取消创建')]
          }
          if (!(action === 'overwrite')) return [3 /*break*/, 3]
          return [
            4 /*yield*/,
            wrapLoading('remove', function () {
              rmSync(targetDir, { recursive: true })
            }),
          ]
        case 2:
          _a.sent()
          _a.label = 3
        case 3:
          return [4 /*yield*/, resolveConfig()]
        case 4:
          config = _a.sent()
          return [4 /*yield*/, createOptimizeDepsRun(config)]
        case 5:
          data = _a.sent()
          mkdirSync(targetDir)
          writeFileSync(outputFile, JSON.stringify(data))
          return [2 /*return*/]
      }
    })
  })
}
//# sourceMappingURL=create.js.map
