import serveStatic from 'serve-static'
import path from 'path'
function serveStaticMiddleware(_a) {
  var root = _a.root
  return serveStatic(path.resolve(root, 'public'))
}
export { serveStaticMiddleware }
//# sourceMappingURL=static.js.map
