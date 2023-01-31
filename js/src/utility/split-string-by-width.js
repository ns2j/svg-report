import stringWidth from 'string-width'

function subStringByWidth(string, start, width) {
  let currentWidth = 0
  let subString = ''

  for (let i = start; ; i++) {
    const char = string.substr(i, 1)
    currentWidth += stringWidth(char)
    if (currentWidth <= width && i <= string.length) {
      subString += char
    }
    if (currentWidth >= width || i >= string.length) {
      return subString
    }
  }
}


export default (string, width) => {
  let splits = []

  while (true) {
    let split = subStringByWidth(string, 0, width)
    splits.push(split)
    string = string.replace(split, '')
    if (!string) {
      break
    }
  }

  return splits
}
