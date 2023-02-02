'use strict'

import jQuery from 'jquery'
import splitStringByWidth from './utility/split-string-by-width'
import {MMPPX, NINETYSIX_DPI} from './utility/const'

const $ = jQuery

function fixTextTransform(text) {
  const x = parseFloat(text.attr("x"))
  const y = parseFloat(text.attr("y"))
  let transform = text.attr("transform")
  if (!transform) {
    //text.attr('transform', `translate(,0})`)
    //return
    transform = ""
  }

  let dx = 0
  let dy = 0
  let match = transform.match(/translate\((.*),(.*)\)/)
  if (match) {
    dx = parseFloat(match[1])
    dy = parseFloat(match[2])
  }    
  //console.log(`dx: ${dx}`)
  //console.log(`dy: ${dy}`)
    
  //text.attr("transform", `matrix(1, 0, 0, 1, ${x + dx}, ${y + dy})`)text.attr("transform", `matrix(1, 0, 0, 1, ${x + dx}, ${y + dy})`)
  text.attr('transform', `translate(${x + dx}, ${y + dy})`)
  text.attr('x', 0)
  text.attr('y', 0)
}

export default (text, area, opt) => {
    console.log(opt);
    console.log(area)
    if (!opt) opt = {}
    
    let areaH = opt.height ? opt.height / MMPPX : area.height
    
    let m = text.attr("style").match(/font-size:(.*?)px/)
    let originalFontSize = m ? parseFloat(m[1]) / MMPPX : 4.9389 / MMPPX
    let fontSize = opt.fontSize ? opt.fontSize * NINETYSIX_DPI : originalFontSize
    console.log(fontSize)
    
    const physicalLines = text.text().split("\n")
    console.log(physicalLines)
    const areaW = area.width ? area.width : 100 / MMPPX
    areaH = areaH ? areaH : 12 / MMPPX

    // find the right-size font-size
    const lineHeight = 1.2
    let logicalLines;
    while (true) {
	let maxRows = Math.floor(areaH / (fontSize * lineHeight))
	let maxColumns = Math.floor(areaW / fontSize) // doesn't care about proportional font

       logicalLines = []
       physicalLines.forEach(line => {
         logicalLines = logicalLines.concat(splitStringByWidth(line, maxColumns * 2)) // 2 single-byte characters can be placed in 1 column
        })

	if (logicalLines.length > maxRows) {
	    fontSize *= 0.95
	} else {
	    break
	}
    }
    console.log(`fontSize: ${fontSize}, logicalLines.length: ${logicalLines.length}`)

    let height = fontSize * lineHeight * logicalLines.length
    let dh = areaH - height 
    console.log(`dh: ${dh}`)
    let adjustY = fontSize - originalFontSize
    switch(opt.align) {
      case 'M':
        adjustY += dh / 2
        break
      case 'B':
        adjustY += dh
      default:
        break;       
    }

    fixTextTransform(text)

    text.attr("style", text.attr('style').replace(/font-size:.*?px/, `font-size:${fontSize * MMPPX}px`))
    text.attr("style", text.attr('style').replace(/line-height:.*?;/, `line-height:${lineHeight};`))
    text.empty()

    const x = 0.0
    logicalLines.forEach((line, i) => {
       const y = adjustY + fontSize * lineHeight * i
	$(`<tspan x="${x * MMPPX}" y="${y * MMPPX}">${line}</tspan>`).appendTo(text)
    })
} 
