import path, { resolve } from 'path'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'
import { wrapLoading } from '../utils/utils.js'
import { resolveConfig } from '../config.js'
import { createOptimizeDepsRun } from '../optimizer/index.js'
// @ts-ignore ignore 2307 error
import dayjs from 'dayjs'

export default async function (option) {
  const config = await resolveConfig()
  const { root: cwd } = config
  const { json } = option
  const targetDir = path.join(cwd, json)
  const time = dayjs().format('-YYYY-MM-DD-HH_mm_ss')
  const outputFile = resolve(targetDir, `result${time}.json`)
  if (existsSync(targetDir)) {
    // 询问用户是否要删除
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: '目标目录已存在，是否继续？',
        choices: [
          { name: 'overwrite', value: 'overwrite' },
          { name: 'cancel', value: false },
        ],
      },
    ])
    if (!action) {
      return console.log('用户取消创建')
    }
    if (action === 'overwrite') {
      await wrapLoading('remove', () => {
        rmSync(targetDir, { recursive: true })
      })
    }
  }
  const data = await createOptimizeDepsRun(config)
  mkdirSync(targetDir)
  writeFileSync(outputFile, JSON.stringify(data))
}
