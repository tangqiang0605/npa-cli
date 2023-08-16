import fs from 'fs'

const root = process.cwd()
export function getPackageSize(path: string) {
  // if(pkg.indexOf("/") !== -1) {
  //   pkg = pkg.split("/").join("\\")
  // }
  const filesList = []
  readFile(`${path}`, filesList)
  let totalSize = 0
  for (const size of filesList) {
    totalSize += size
  }
  return {
    size: (totalSize / 1024).toFixed(2) + 'KB',
    s: totalSize,
  }
}

export function conveyPath(pkg: string) {
  if (pkg.indexOf('/') !== -1) {
    pkg = pkg.split('/').join('\\')
  }
  return pkg
}

//遍历读取文件
function readFile(path: string, filesList: any[]) {
  const files = fs.readdirSync(path) //需要用到同步读取
  files.forEach(walk)
  function walk(file: any) {
    const states = fs.statSync(path + '/' + file)
    if (states.isDirectory()) {
      readFile(path + '/' + file, filesList)
    } else {
      filesList.push(states.size)
    }
  }
}
