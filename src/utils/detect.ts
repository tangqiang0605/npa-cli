import { exec } from 'node:child_process'
const isPackageGlob = () => {
  return new Promise((resolve, reject) => {
    exec('npm config get prefix', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      // console.log(stdout)
      const globalPath = stdout.trim()
      resolve(globalPath == __dirname)
    })
  })
}

export { isPackageGlob }
