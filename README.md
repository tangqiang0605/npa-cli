## there are some useful scripts

1. run your code with ts-node-dev
   "start": "ts-node-dev ./src/index.ts -P tsconfig.json --no-cache",
2. build your code with tsc
   "build": "tsc -P tsconfig.json",
3. test your code with jest
   "test": "jest --config jestconfig.json --coverage",
4. format your code with prettier
   "format": "prettier --write \"./\*_/_.{html,vue,ts,js,json,md}\"",
5. commit your code with git-cz
   "commit": "git-cz",
6. publish your npm package by command

```sh
./scripts/publish.sh
```

## 调试方法

1. npm i ts-node -g
2. 配置tsconfig

```json
{
  "ts-node": {
    "esm": true
  }
}
```

3. 打断点，在入口文件打开调试>JavaScript调试终端
4. 输入ts-node 文件名 cli参数，如`ts-node src/index analyze`
