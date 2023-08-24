## npa

Also known as npm-package-analyzer, is a tool that generates tree or graph like relationship diagrams by traversing dependency packages in your project, helping developers have a clearer understanding of the project's dependencies.

- Support for Hot Module Replacement(HMR). When you add or remove dependencies, the view will automatically synchronize updates.
- Compatible with various package managers such as NPM, Yarn, and PNPM.

[![npm version](https://badge.fury.io/js/npm-package-analyzer.svg)](https://badge.fury.io/js/npm-package-analyzer)

## Installation

Either through cloning with git or by using [npm](http://npmjs.org/) (the recommended way):

`npm install -g npm-package-analyzer # or using yarn: yarn global add npm-package-analyzer`

And npa will be installed globally to your system path.

You can also install npm-package-analyzer as a development dependency:

```
npm install --save-dev  # or using yarn: yarn add npm-package-analyzer -D
```

With a local installation, npm-package-analyzer will not be available in your system path or you can't use it directly from the command line. Instead, the local installation of npm-package-analyzer can be run by calling it from within an npm script (such as `npm start`) or using `npx npm-package-analyzer -h`.

## Usage
For CLI options, use the `-h` (or `--help`) argument:

```
npa-cli -h
```

Analyze the dependency tree of your project:

```
npa-cli analyze
```

Export the result as a JSON file:

```
npa-cli analyze -j dir-path
```

Limit analysis depth:

```
npa-cli analyze -d <depth>`
```

## License

MIT