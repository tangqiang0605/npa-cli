import serveStatic from 'serve-static'
import path from 'path'
function serveStaticMiddleware({ root }) {
  return serveStatic(path.resolve(root, 'public'))
}
export { serveStaticMiddleware }
