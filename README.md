## there are some useful scripts
1. run your code with ts-node-dev
    "start": "ts-node-dev ./src/index.ts -P tsconfig.json --no-cache",
2. build your code with tsc
    "build": "tsc -P tsconfig.json",
3. test your code with jest
    "test": "jest --config jestconfig.json --coverage",
4. format your code with prettier
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
5. commit your code with git-cz
    "commit": "git-cz",
6. publish your npm package by command
```sh
./scripts/publish.sh
```
