import resolve from 'resolve'
import path from 'path'
import fs from 'fs'

export async function scanDeps(config) {
  const deps = {}

  return deps
}

// async function tyrResolve(id: string, config) {
//     // 例如：vue/package.json
//     const pkgPath = resolve.sync(`${id}/package.json`, { basedir: config.root });
//     const pkgDir = path.dirname(pkgPath);
//     const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
//     const dependencies = pkg.dependencies;
//     const devDependencies = pkg.devDependencies
//     return { dependencies, devDependencies }
// }
