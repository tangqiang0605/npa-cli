import fs from 'fs'
import { join } from 'node:path'
export type PointsInt = {
  id: string
  name: string
  version: string
  size: string
  s: number
}
export type ArrowsInt = { target: string; source: string; value: 1 }
export type PkgInfoInt = { name: string; version: string }

let pkgMap = null
/**
 * 保存包的大小信息 避免重复计算
 */
export function initPkgMap() {
  pkgMap = new Map<
    string,
    {
      size: string
      s: number
    }
  >()
}

export function getPackageSize(path: string) {
  if (pkgMap && pkgMap.has(path)) {
    return pkgMap.get(path)
  }
  const filesList = []
  readFile(`${path}`, filesList)
  let totalSize = 0
  for (const size of filesList) {
    totalSize += size
  }
  const info = {
    size: (totalSize / 1024).toFixed(2) + 'KB',
    s: totalSize,
  }
  pkgMap.set(path, info)
  return info
}

export function conveyPath(pkg: string) {
  // if (pkg.indexOf('/') !== -1) {
  //   pkg = pkg.split('/').join('\\')
  // }
  return pkg
}

//遍历读取文件
function readFile(path: string, filesList: any[]) {
  const files = fs.readdirSync(path) //需要用到同步读取
  files.forEach(walk)
  function walk(file: any) {
    const states = fs.statSync(join(path, file))
    if (states.isDirectory()) {
      readFile(join(path, file), filesList)
    } else {
      filesList.push(states.size)
    }
  }
}

// 获取开发依赖
export function getDevDependencies(info: any) {
  const devDependencies = []
  for (const key in info) {
    devDependencies.push({
      id: `${key}${info[key]}`,
      name: `${key}`,
      version: `${info[key]}`,
      group: getRandomCode(),
    })
  }
  return devDependencies
}

export function getRandomCode() {
  return Math.random().toString(36).slice(-8)
}
