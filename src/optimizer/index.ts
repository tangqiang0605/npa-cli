import { scanDeps } from './scan.js'
/**
 * 分析项目依赖的第三方模块
 * @param {*} config
 */
async function createOptimizeDepsRun(config) {
  //存放依赖导入
  const deps = await scanDeps(config)
  return deps
}
export { createOptimizeDepsRun }
