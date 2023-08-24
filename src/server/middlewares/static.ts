import serveStatic from 'serve-static'
import path from 'path'

function serveStaticMiddleware({ __baseDir }) {
  return serveStatic(path.resolve(__baseDir, 'public'))
}
function projectStatic({ root, pkg }) {
  return serveStatic(path.resolve(root, 'node_modules', pkg.name, 'public'))
}

function globalStatic({ __dirname, pkg }) {
  return serveStatic(path.resolve(__dirname, 'node_modules', pkg.name))
}

export { serveStaticMiddleware, globalStatic, projectStatic }
