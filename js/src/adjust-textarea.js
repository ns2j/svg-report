'use strict'

import jQuery from 'jquery'
import splitStringByWidth from './utility/split-string-by-width'
import fixTextTransform from './utility/fix-text-transform'
import {MMPPX, NINETYSIX_DPI} from './utility/const'

const $ = jQuery

export default (text, areaH, opt) => {
    console.log(opt);
    if (!opt) opt = {}
    
    areaH = opt.height ? opt.height / MMPPX : areaH
    
    let m = text.attr("style").match(/font-size:(.*?)px/)
    let originalFontSize = m ? parseFloat(m[1]) / MMPPX : 4.9389 / MMPPX
    let fontSize = opt.fontSize ? opt.fontSize * NINETYSIX_DPI : originalFontSize
    console.log(fontSize)
    
    // find the right-size font-size
    const physicalLines = text.text().split("\n")
    console.log(physicalLines)
    m = text.attr('style').match(/inline-size:(\d+.\d+)/);
    const areaW = m ? parseFloat(m[1]) / MMPPX : 100 / MMPPX
    areaH = areaH ? areaH : 12 / MMPPX

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
    //let height = fontSize * lineHeight * (logicalLines.length - 1) + fontSize;
    let height = fontSize * lineHeight * logicalLines.length
    let dh = areaH - height 
    console.log(`dh: ${dh}`)
    let adjustY = fontSize - originalFontSize  //for top
    switch(opt.align) {
      case 'M':
        adjustY += dh / 2
        break
      case 'B':
        adjustY += dh //for bottom
      default:
        break;       
    }

    fixTextTransform(text)

    text.attr("style", text.attr('style').replace(/font-size:.*?px/, `font-size:${fontSize * MMPPX}px`))
    text.attr("style", text.attr('style').replace(/line-height:.*?;/, 'line-height:${lineHeight};'))
    console.log(text.attr('style'))
    text.empty();

    const x = 0.0
    logicalLines.forEach((line, i) => {
       const y = adjustY + fontSize * lineHeight * i
	$(`<tspan x="${x * MMPPX}" y="${y * MMPPX}">${line}</tspan>`).appendTo(text)
    })
}
