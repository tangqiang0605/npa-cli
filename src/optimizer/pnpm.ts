import fs from 'fs'
import {
  ArrowsInt,
  PkgInfoInt,
  PointsInt,
  conveyPath,
  getPackageSize,
} from './until.js'
const root = process.cwd()

export function PNPM_getDeps(
  path: string,
  pkgInfo: PkgInfoInt,
  depth: number,
  depSet: Set<string>,
  points: PointsInt[],
  arrows: ArrowsInt[],
  group: string,
) {
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
    getDependencies(
      pkgInfo,
      depth,
      depSet,
      points,
      arrows,
      pkgJSON['dependencies'],
      group,
    )
  }
}

const reg = /\^|\~/g
// 查找开发依赖
function getDependencies(
  pkgInfo: PkgInfoInt,
  depth: any,
  depSet: Set<string>,
  points: PointsInt[],
  arrows: ArrowsInt[],
  info: any,
  group: string,
) {
  if (depth <= 0 && !Number.isNaN(depth)) return null
  !Number.isNaN(depth) && depth--
  for (const key in info) {
    if (depSet.has(`${key}${info[key]}`)) continue
    const _key = conveyPath(key) // 名称格式化

    let version_key = `${key}@${info[key]}`
    if (reg.test(info[key])) {
      // 判断版本是否存在 ~ ^
      // 版本号替换成 @x.x.x
      version_key = `${key}${info[key].replace(reg, '@')}`
    }

    // 路径 判断是否存在子依赖
    const path = [
      `${root}\\node_modules\\.pnpm\\${version_key}\\node_modules\\${_key}`,
      `${root}\\node_modules\\.pnpm\\${version_key}\\node_modules\\${_key}\\package.json`,
    ]
    const folder = fs.existsSync(path[0])
    const file = fs.existsSync(path[1])
    if (folder && file) {
      // 文件夹和package.json文件都存在
      // 缓存中不存在
      const pkgJSON = JSON.parse(
        fs.readFileSync(`${path[1]}`, {
          encoding: 'utf-8',
        }),
      )
      arrows.push({
        source: `${pkgInfo.name}${pkgInfo.version}`,
        target: `${key}${info[key]}`,
        value: 1,
      })
      points.push({
        id: `${key}${info[key]}`,
        name: `${key}`,
        version: info[key],
        ...getPackageSize(path[0]),
        group,
      })
      depSet.add(`${key}${info[key]}`)
      if (
        pkgJSON['dependencies'] &&
        JSON.stringify(pkgJSON['dependencies']) !== '{}'
      ) {
        getDependencies(
          { name: key, version: info[key] },
          depth,
          depSet,
          points,
          arrows,
          pkgJSON['dependencies'],
          group,
        )
      }
    }
  }
}
