async function resolveConfig() {
  //root指的是当前命令所在的目录，也就是根目录
  // 执行命令的位置
  const root = process.cwd()
  const config = {
    root,
  }
  return config
}
export { resolveConfig }
