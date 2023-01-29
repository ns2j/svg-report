'use strict'

import jQuery from 'jquery'
import splitStringByWidth from './utility/split-string-by-width'
import fixTextTransform from './utility/fix-text-transform'

const $ = jQuery

export default (textArea, opt) => {
    //export default (textArea, lineHeight = 1.2, paddingX = 0.5, paddingY = 0.5, nowrap = false) => {
    //const originalFontSize = parseInt(textSvg.match(/.+font-size="(\d+)".+/)[1])
    console.log(opt);
    if (!opt) opt = {}
    let text = textArea.text
    let rect = textArea.rect
    
    let originalFontSize = 14
    let m = text.attr("style").match(/.+font-size:(\d+)px.+/)
    if (m)
	originalFontSize = parseInt(m[1])
    let fontSize = originalFontSize
    console.log(fontSize)

    const lineHeight = 1.2
    let paddingX = opt.padx ? opt.padx : 0.0
    let paddingY = opt.pady ? opt.pady : 0.0
    m = text.attr("style").match(/.+;shape-padding:(\d+.\d+);.+/)
    if (m) {
	console.log(`padding: ${m[1]}`)
	let p = parseFloat(m[1])
	//paddingX = p / fontSize
	//paddingY = p / fontSize
	paddingX += p
	paddingY += p
    }
    
    // find the right-size font-size
    const physicalLines = text.text().split("\n")
    console.log(physicalLines)
    let logicalLines;
    while (true) {
	let maxRows = Math.floor((rect.attr('height') - (2 * paddingY)) / (fontSize * lineHeight))
	let maxColumns = Math.floor((rect.attr('width') - (2 * paddingX)) / fontSize) // doesn't care about proportional font

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
    let height = fontSize * lineHeight * (logicalLines.length - 1) + fontSize;
    console.log(`rect.height: ${rect.attr('height')}, height: ${height}`)
    let dh = rect.attr('height') - height
    console.log(`dh: ${dh}`)

    let adjustY = fontSize - originalFontSize  //for top
    let startY = paddingY   
    if (opt.aligny && !opt.aligny.includes('t')) {
        startY = 0.0
        if (opt.aligny.includes('c'))
            adjustY = fontSize - originalFontSize + dh / 2 - (logicalLines.length - 1) * (fontSize - originalFontSize) / 2 //for center
        else if (opt.aligny.includes('b'))
            adjustY = fontSize - originalFontSize + dh  - paddingY * 2//for bottom
     }

    fixTextTransform(text)

    let style = text.attr("style")
    text.attr("style", style.replace(/font-size:\d+px/, "font-size:" + fontSize + "px"))
    text.empty();
    
    const x = paddingX
    logicalLines.forEach((line, i) => {
	//const y = adjustY + fontSize * (paddingY + (i * lineHeight))
	//text.append(`<tspan x="${x}" y="${y}">${line}</tspan>`)
       const y = startY + adjustY + fontSize * lineHeight * i
	$(`<tspan x="${x}" y="${y}">${line}</tspan>`).appendTo(text)
    })
}
