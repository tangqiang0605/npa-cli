const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

// packagjson :srcipt "node ./scripts/test.js"

const execPro = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      console.log(stdout || stderr)
      resolve(stdout || stderr)
    })
  })
}

async function execCommandsQueue(commands) {
  let result = []
  const execCommand = async () => {
    try {
      const res = await execPro(commands.shift())
      result.push({ state: 'fulfilled', value: res })
    } catch (err) {
      result.push({ state: 'rejected', value: err })
    }
    if (commands.length) {
      await execCommand()
    }
    return
  }

  await execCommand()
  return result
}

const str = fs.readFileSync(path.resolve(__dirname, 'publish.sh'), {
  encoding: 'utf-8',
})
let commands = str.split('\n')

execCommandsQueue(commands).then((res) => {
  // console.log(res)
})
