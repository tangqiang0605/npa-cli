import { createRequire } from 'module'
import { exec } from 'child_process'
// @ts-ignore ignore 2307 error
import ora from 'ora'
import util from 'util'

const require = createRequire(import.meta.url)
const execPromisified = util.promisify(exec)

export const wrapLoading = async (message, fn) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn() // aop 将用户的逻辑包裹loading效果
  spinner.succeed()
  return result
}

export { require, execPromisified }
