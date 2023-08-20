export default function sum() {
  var numbers = []
  for (var _i = 0; _i < arguments.length; _i++) {
    numbers[_i] = arguments[_i]
  }
  return numbers.reduce(function (total, number) {
    return total + number
  }, 0)
}
//# sourceMappingURL=sum.js.map
