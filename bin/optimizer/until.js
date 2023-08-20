import fs from 'fs'
var root = process.cwd()
export function getPackageSize(path) {
  // if(pkg.indexOf("/") !== -1) {
  //   pkg = pkg.split("/").join("\\")
  // }
  var filesList = []
  readFile(''.concat(path), filesList)
  var totalSize = 0
  for (var _i = 0, filesList_1 = filesList; _i < filesList_1.length; _i++) {
    var size = filesList_1[_i]
    totalSize += size
  }
  return {
    size: (totalSize / 1024).toFixed(2) + 'KB',
    s: totalSize,
  }
}
export function conveyPath(pkg) {
  if (pkg.indexOf('/') !== -1) {
    pkg = pkg.split('/').join('\\')
  }
  return pkg
}
//遍历读取文件
function readFile(path, filesList) {
  var files = fs.readdirSync(path) //需要用到同步读取
  files.forEach(walk)
  function walk(file) {
    var states = fs.statSync(path + '/' + file)
    if (states.isDirectory()) {
      readFile(path + '/' + file, filesList)
    } else {
      filesList.push(states.size)
    }
  }
}
//# sourceMappingURL=until.js.map
