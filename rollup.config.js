import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
// import { visualizer } from 'rollup-plugin-visualizer'
import externals from 'rollup-plugin-node-externals'

export default {
  input: 'src/index.ts',
  output: {
    inlineDynamicImports: true, // 去除多入口报错
    file: 'bin/index.cjs',
    format: 'cjs',
    banner: '#! /usr/bin/env node\nglobal.navigator = {userAgent: "node.js"}', // 补丁
    sourcemap: true,
  },

  plugins: [
    externals({
      exclude: ['ora', 'chalk'],
    }),
    // visualizer(),
    // 压缩打包的结果
    terser(),
    // 支持json引入
    json(),
    // 打包插件
    resolve({ preferBuiltins: true }), // 查找和打包node_modules中的第三方模块
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript(),
    babel({ babelHelpers: 'bundled' }), // babel配置,编译es6
  ],

  sourcemap: true,
}
