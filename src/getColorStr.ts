import * as chalk from 'chalk'

enum COLORBEGIN {
  RED = 0,
  ORANGE = 30,
  YELLOW = 60,
  GREEN = 120,
  CYAN = 180,
  BLUE = 240,
  PURPLE = 370,
  PINK = 300,
}

const getColorStr = (str) => {
  // str.split('').map((s: string, i: number, { length })=>chalk.hsl(COLORBEGIN.PINK + i * (360 /length),100, 50)(s)).join('')
  const len = str.length
  let pos = COLORBEGIN.PINK
  const step = 360 / len
  let resultStr = ''
  // const strArr = []
  for (let i = 0; i < len; i++) {
    const c = chalk.hsl(pos, 100, 50)(str[i])
    // strArr.push(c)
    resultStr += c
    pos += step
  }
  // console.log(strArr)

  return resultStr
}

export default getColorStr
