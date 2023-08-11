## 项目介绍
1. 项目组成
前端项目：npa-display。
仓库：git@gitee.com:tangqiangitee/npa-display.git

后台项目：npa-cli。
仓库：git@gitee.com:tangqiangitee/npa-cli.git

测试项目：npa-test-npm、npa-test-yarn、npa-test-pnpm。
仓库：无。自行本地搭建。

1. 启动项目
克隆项目`git clone git.xxx`，

安装依赖`pnpm i`，

安装vscode插件eslint、prettier（必要），

重启vscode（必要），

建立自己的分支，

运行项目查看【项目测试】。

3. 代码提交
可以建立自己的分支dev-xxx，如dev-tqh。

提交前一定要使用git add添加需要commit的内容。

使用命令pnpm commit进行提交。subject的内容必填，其它可以直接回车跳过。

如果提交时报错，说明lint失败，代码不规范，根据报错信息修改代码。

使用`pnpm lint`可以检查代码。使用`pnpm format`可以整理代码。

4. 注意事项
如果eslint、prettier功能不生效，重启vscode，稍后即可。

## 项目调试
### 直接运行ts文件
`pnpm dev`或`ts-node src/index 参数`
注意，这是在本项目中运行，如果分析依赖结构，分析的是本项目的依赖。
### 运行js文件
首先打包`pnpm build`或`rollup -c`，
然后运行`node bin/index.cjs 参数`。

或者，执行构建并运行`pnpm dev:js`。

### 调试方法
1. 全局安装`npm i ts-node -g`
2. 配置tsconfig（已配置）
```json
{
  "ts-node": {
    "esm": true
  }
}
```
3. 在ts文件中打断点，并在ts文件中打开vscode调试>JavaScript调试终端
4. 输入命令`ts-node 入口文件 cli参数`，如`ts-node src/index analyze`，或者脚本`pnpm dev`

## 外部测试
在npa-cli中执行npm link
在外部测试项目引入 `npm link npa-cli`
在外部测试项目执行 `npx npa-cli -h`

注意：
如果更改了代码：需要在该项目重新构建`pnpm build`
如果更改了package.json的内容，需要在测试项目重新执行`npm link npa-cli`
## 单元测试
pnpm test