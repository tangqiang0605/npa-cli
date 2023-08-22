import { createServer } from 'node:http'

export function detectPort(port): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = createServer()

    server.once('error', (err) => {
      // 端口被占用
      if (err.message.includes('EADDRINUSE')) {
        resolve(false)
      }
      reject(false)
    })

    server.listen(port, async () => {
      // console.log(`server running at: http://localhost:${port}`)
      server.close()
      server.once('close', () => {
        resolve(true)
      })
    })
  })
}
