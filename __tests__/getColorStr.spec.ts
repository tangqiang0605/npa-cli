import getColorStr from '../src/getColorStr'
// import { test, expect } from 'jest'
test('test getColorStr', () => {
  const result = [
    '\x1B[38;2;255;0;255mt\x1B[39m',
    '\x1B[38;2;255;0;85me\x1B[39m',
    '\x1B[38;2;255;85;0ms\x1B[39m',
    '\x1B[38;2;255;255;0mt\x1B[39m',
    '\x1B[38;2;85;255;0m \x1B[39m',
    '\x1B[38;2;0;255;85mc\x1B[39m',
    '\x1B[38;2;0;255;255mo\x1B[39m',
    '\x1B[38;2;0;85;255md\x1B[39m',
    '\x1B[38;2;0;0;255me\x1B[39m',
  ].join('')
  expect(getColorStr('test code')).toEqual(result)
})
