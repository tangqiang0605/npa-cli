## 项目介绍

### 项目组成

前端项目：npa-display。
仓库：[tangqiang/npa-display (gitee.com)](https://gitee.com/tangqiangitee/npa-display)

后台项目：npa-cli。
仓库：[tangqiang/npa-cli (gitee.com)](https://gitee.com/tangqiangitee/npa-cli)

测试项目：npa-test-npm、npa-test-yarn、npa-test-pnpm。
仓库：无。自行本地搭建。



### 启动项目

1. 克隆项目 `git clone git.xxx`，
2. 安装依赖 `pnpm i`，
3. 安装 vscode 插件 eslint、prettier（必要），
4. 重启 vscode（必要），
5. 建立自己的分支（必要），
6. 运行项目查看【项目测试】。



### 代码提交

可以建立自己的分支 dev-xxx，如 dev-tqh。

提交前一定要使用 `git add` 添加需要 commit 的内容！！！

使用命令 `pnpm commit` 进行提交。subject 的内容（提示说，填写简短精炼的变更描述）必填，其它可以直接回车跳过。使用 `pnpm commit` 替代 `git commit`

如果提交时报错，说明 lint 失败，代码不规范，根据报错信息修改代码。

使用 `pnpm lint` 可以检查代码。使用 `pnpm format` 可以整理代码。



### 注意事项

如果 eslint、prettier 功能不生效，重启 vscode，稍后即可。



## 项目测试

### 直接运行 ts 文件

全局安装 `npm i ts-node -g`

`pnpm dev` 或 `ts-node src/index 参数`
注意，这是在本项目中运行，如果分析依赖结构，分析的是本项目的依赖。



### 直接运行 js 文件

首先打包 `pnpm build` 或 `rollup -c`，
然后运行 `node bin/index.cjs 参数`。

或者，执行构建并运行 `pnpm dev:js`。



### 调试方法

1. 全局安装 `npm i ts-node -g`
2. 配置 tsconfig（已配置）

```json
{
  "ts-node": {
    "esm": true
  }
}
```

3. 在 ts 文件中打断点，并在 ts 文件中打开 vscode 调试>JavaScript 调试终端
4. 输入命令 `ts-node 入口文件 cli参数`，如 `ts-node src/index analyze`，或者脚本 `pnpm dev`



## 外部测试

在 npa-cli 中执行 `npm link`
在外部测试项目引入 `npm link npa-cli`
在外部测试项目执行 `npx npa-cli -h`

注意：
如果更改了代码：需要在该项目重新构建 `pnpm build`
如果更改了 package. json 的内容，需要在测试项目重新执行 `npm link npa-cli`



## 单元测试

`pnpm test`

一定要写测试用例并保证覆盖率。