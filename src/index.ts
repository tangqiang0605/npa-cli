#! /usr/bin/env node

import { program } from 'commander'
import { createRequire } from 'module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import chalk from 'chalk'
import { createServer } from './server/index.js'
import { saveOption, scanDeps } from 'optimizer/scan.js'
import fs from 'fs'
import { resolveConfig } from 'config.js'

// 获取本模块的绝对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// const __baseDir = join(__dirname, '..')

// 使用require方法读取json文件（package.json)
const require = createRequire(import.meta.url)
const pkg = require(join(__dirname, '../package.json'))

program.version(`npa-cli@${pkg.version}`).usage('<command> [option]')

// 创建命令：介绍，参数选项，行为
program
  .command('analyze')
  .description('Build dependency tree')
  .option('-d --depth <n>', 'Limit the analysis of depth n')
  .option(
    '-j, --json <file-path>',
    'Save the output as JSON to the specified file',
  )
  .action(async (option) => {
    // option为该命令的参数选项
    // console.log(option.depth); // 访问深度选项参数
    // console.log(option.json); // 访问json选项参数
    saveOption(option) // 传递参数
    if (option.json) {
      // 判断是否存在json选项
      const config = await resolveConfig()
      // 调用方法写入文件
      fs.writeFile(
        `${process.cwd()}\\${option.json}`,
        JSON.stringify(await scanDeps(config), null, '\t'),
        () => {
          console.log('successfully save the output as JSON')
        },
      )
    }
    ;(async function () {
      const server = await createServer(option)
      server.listen(9999)
    })()
  })

program.addHelpText(
  'after',
  `\nRun ${chalk.blueBright(
    'npa-cli <command> --help',
  )} for detailed usage of given command.`,
)

// 直接解析用户参数
program.parse(process.argv)
