'use strict'

import splitStringByWidth from './utility/split-string-by-width'
import { MMPPX, NINETYSIX_DPI } from './utility/const'

function getAreaHeight(area, opt) {
  const h = opt.height ? opt.height / MMPPX : area.height
  return h ?? 12 / MMPPX
}

function getAreaWidth(area, opt) {
  const w = opt.width ? opt.width / MMPPX : area.width
  return w ?? 100 / MMPPX
}

function getOriginalFontSize(text) {
  const m = text.style.fontSize?.match(/(.*)px/)
  console.log(m[1])
  return m ? parseFloat(m[1]) / MMPPX : 4.9389 / MMPPX
}

function getFontSize(originalFontSize, opt) {
  return opt.fontSize ? opt.fontSize * NINETYSIX_DPI : originalFontSize
}

function getAdjustY(originalFontSize, fontSize, dh, opt) {
  const adjustY = fontSize - originalFontSize 
  switch (opt.align) {
    case 'M':
      return adjustY + dh / 2
    case 'B':
      return adjustY + dh
    default:
      return adjustY 
  }
}

export default (text, area, opt) => {
  console.log(opt);
  console.log(area)
  if (!opt) opt = {}

  const originalFontSize = getOriginalFontSize(text) 
  const physicalLines = text.textContent.split("\n")
  const areaW = getAreaWidth(area, opt) 
  const areaH = getAreaHeight(area, opt)

  console.log("originalFontSize: " + originalFontSize)
  console.log("physicalLines: " + physicalLines)
  console.log("areaW: " + areaW)
  console.log("areaH: " + areaH)

  // find the right-size font-size
  const lineHeight = 1.2
  let logicalLines;
  let fontSize = getFontSize(originalFontSize, opt)
  while (true) {
    const maxRows = Math.floor(areaH / (fontSize * lineHeight))
    const maxColumns = Math.floor(areaW / fontSize) // doesn't care about proportional font

    logicalLines = []
    physicalLines.forEach(line => {
      logicalLines = logicalLines.concat(splitStringByWidth(line, maxColumns * 2)) // 2 single-byte characters can be placed in 1 column
    })

    if (logicalLines.length > maxRows)
      fontSize *= 0.95
    else
      break
  }
  console.log(`fontSize: ${fontSize}, logicalLines.length: ${logicalLines.length}`)

  const dh = areaH - fontSize * lineHeight * logicalLines.length
  console.log(`dh: ${dh}`)
  const adjustY = getAdjustY(originalFontSize, fontSize, dh, opt)

  text.style.fontSize = `${fontSize * MMPPX}px`
  text.style.lineHeight = `${lineHeight}`
  text.textContent = ''

  const x = 0.0
  logicalLines.forEach((line, i) => {
    const y = adjustY + fontSize * lineHeight * i
    const tspan = document.createElement('tspan')
    tspan.setAttribute('x', `${x * MMPPX}`)
    tspan.setAttribute('y', `${y * MMPPX}`)
    tspan.textContent = line
    text.appendChild(tspan)
  })
  
  text.innerHTML = text.innerHTML
}
