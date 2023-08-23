import { program } from 'commander'
import chalk from 'chalk'
import { createServer } from '../server/index.js'
import { saveOption, scanDeps } from '../optimizer/scan.js'
import { resolveConfig } from '../config.js'
import type { ServerConfig } from '../config.js'

// 解析参数
const resolveOption = async (option) => {
  const config: ServerConfig = await resolveConfig()
  const { depth, json } = option
  saveOption(option) // 保存参数
  if (json) {
    ;(await import('./create.js')).default(option)
  } else {
    ;(async function () {
      await createServer(config)
    })()
  }
}

// 解析命令
export async function resolveCommend() {
  const { version } = await resolveConfig()

  program.version(`npa-cli@${version}`).usage('<command> [option]')

  program
    .command('analyze')
    .description('Build dependency tree')
    .option('-d --depth <n>', 'Limit the analysis of depth n')
    .option(
      '-j, --json <file-path>',
      'Save the output as JSON to the specified file',
    )
    .action(resolveOption)

  program.addHelpText(
    'after',
    `\nRun ${chalk.blueBright(
      'npa-cli <command> --help',
    )} for detailed usage of given command.`,
  )

  program.parse(process.argv)
}
