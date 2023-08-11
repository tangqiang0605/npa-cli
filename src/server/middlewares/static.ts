import serveStatic from 'serve-static'
function serveStaticMiddleware({ root }) {
  return serveStatic(root)
}
export { serveStaticMiddleware }
