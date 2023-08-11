import sum from '../src/sum'

describe('#sum', () => {
  it('returns 0 with no numbers', () => {
    expect(sum()).toBe(0)
  })
})
