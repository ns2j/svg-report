'use strict'

import jQuery from 'jquery'
import splitStringByWidth from './utility/split-string-by-width'
import { MMPPX, NINETYSIX_DPI } from './utility/const'

const $ = jQuery

function getAreaHeight(area, opt) {
  const h = opt.height ? opt.height / MMPPX : area.height
  return h ?? 12 / MMPPX
}

function getAreaWidth(area, opt) {
  const w = opt.width ? opt.width / MMPPX : area.width
  return w ?? 100 / MMPPX
}

function getOriginalFontSize(text) {
  const m = text.attr("style").match(/font-size:(.*?)px/)
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

  const originalFontSize =getOriginalFontSize(text) 
  const physicalLines = text.text().split("\n")
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
    console.log("fontSize: " + fontSize)

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

  text.attr("style", text.attr('style').replace(/font-size:.*?px/, `font-size:${fontSize * MMPPX}px`))
  text.attr("style", text.attr('style').replace(/line-height:.*?;/, `line-height:${lineHeight};`))
  text.empty()

  const x = 0.0
  logicalLines.forEach((line, i) => {
    const y = adjustY + fontSize * lineHeight * i
    $(`<tspan x="${x * MMPPX}" y="${y * MMPPX}">${line}</tspan>`).appendTo(text)
  })
  text.html(text.html())
} 
