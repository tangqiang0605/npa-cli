import fs from 'fs'
import {
  ArrowsInt,
  PkgInfoInt,
  PointsInt,
  conveyPath,
  getPackageSize,
} from './until.js'
const root = process.cwd()

type MappedInt = Map<string, Set<string>>

export function NPM_getDeps(
  path: string,
  pkgInfo: PkgInfoInt,
  depth: number,
  depSet: Set<string>,
  points: PointsInt[],
  arrows: ArrowsInt[],
  group: string,
) {
  const pkgJSON = JSON.parse(
    fs.readFileSync(`${path}\\package.json`, {
      encoding: 'utf-8',
    }),
  )
  if (
    pkgJSON['dependencies'] &&
    JSON.stringify(pkgJSON['dependencies']) !== '{}'
  ) {
    getDependencies(
      pkgInfo,
      path,
      depth,
      depSet,
      points,
      arrows,
      pkgJSON['dependencies'],
      group,
    )
  }
}

function getDependencies(
  pkgInfo: PkgInfoInt,
  path: string,
  depth: any,
  depSet: Set<string>,
  points: PointsInt[],
  arrows: ArrowsInt[],
  info: any,
  group: string,
) {
  for (const key in info) {
    if (depSet.has(`${key}${info[key]}`)) continue
    const _key = conveyPath(key)
    const innerPath = [
      `${path}\\node_modules\\${_key}`,
      `${path}\\node_modules\\${_key}\\package.json`,
    ]
    const innerExistFolder = fs.existsSync(innerPath[0])
    const innerExistFile = fs.existsSync(innerPath[1])
    if (innerExistFolder && innerExistFile) {
      const pkgJSON = JSON.parse(
        fs.readFileSync(`${innerPath[1]}`, {
          encoding: 'utf-8',
        }),
      )
      arrows.push({
        source: `${pkgInfo.name}${pkgInfo.version}`,
        target: `${key}${info[key]}`,
        value: 1,
      })
      points.push({
        id: `${key}${info[key]}`,
        name: `${key}`,
        version: info[key],
        ...getPackageSize(innerPath[0]),
        group,
      })
      depSet.add(`${key}${info[key]}`)
      if (
        pkgJSON['dependencies'] &&
        JSON.stringify(pkgJSON['dependencies']) !== '{}'
      ) {
        getDependencies(
          { name: key, version: info[key] },
          innerPath[0],
          depth,
          depSet,
          points,
          arrows,
          pkgJSON['dependencies'],
          group,
        )
      }
    } else {
      const outerPath = [
        `${root}\\node_modules\\${_key}`,
        `${root}\\node_modules\\${_key}\\package.json`,
      ]
      const outerExistFolder = fs.existsSync(outerPath[0])
      const outerExistFile = fs.existsSync(outerPath[1])

      if (outerExistFolder && outerExistFile) {
        const pkgJSON = JSON.parse(
          fs.readFileSync(`${outerPath[1]}`, {
            encoding: 'utf-8',
          }),
        )
        arrows.push({
          source: `${pkgInfo.name}${pkgInfo.version}`,
          target: `${key}${info[key]}`,
          value: 1,
        })
        points.push({
          id: `${key}${info[key]}`,
          name: `${key}`,
          version: info[key],
          ...getPackageSize(outerPath[0]),
          group,
        })
        depSet.add(`${key}${info[key]}`)
        if (
          pkgJSON['dependencies'] &&
          JSON.stringify(pkgJSON['dependencies']) !== '{}'
        ) {
          getDependencies(
            { name: key, version: info[key] },
            outerPath[0],
            depth,
            depSet,
            points,
            arrows,
            pkgJSON['dependencies'],
            group,
          )
        }
      }
    }
  }
}
