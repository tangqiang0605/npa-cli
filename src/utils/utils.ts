import { createRequire } from 'module'
import { exec } from 'child_process'
// @ts-ignore ignore 2307 error
import ora from 'ora'
import util from 'util'
import chalk from 'chalk'
import { resolveConfig } from '../config.js'

const require = createRequire(import.meta.url)
const execPromisified = util.promisify(exec)
let config = null
const getConfig = async () => {
  if (!config) {
    config = await resolveConfig()
  }
  return config
}

export const logInfo = async (info: string) => {
  const config = await getConfig()
  console.log(chalk.green(`[${config.pkg.name}]: ${info}`))
}

export const wrapLoading = async (message, fn) => {
  const spinner = ora(message)
  const succeedCb = []
  const whenSucceedCb = (cb) => {
    succeedCb.push(cb)
  }
  const failCb = []
  const whenFailCb = (cb) => {
    failCb.push(cb)
  }
  spinner.start()
  let result = null
  try {
    result = await fn(whenSucceedCb, whenFailCb) // aop 将用户的逻辑包裹loading效果
    spinner.succeed()
    succeedCb.forEach((fn) => fn())
  } catch (err) {
    result = err
    spinner.fail()
    failCb.forEach((fn) => fn())
  }
  return result
}

export { require, execPromisified }
