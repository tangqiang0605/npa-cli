#! /usr/bin/env node

import { program } from 'commander'
import { createRequire } from 'module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import chalk from 'chalk'
import { createServer } from './server/index.js'

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
    ;(async function () {
      const server = await createServer()
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
