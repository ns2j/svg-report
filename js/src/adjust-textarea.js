'use strict'

import jQuery from 'jquery'
import splitStringByWidth from './utility/split-string-by-width'
import fixTextTransform from './utility/fix-text-transform'

const $ = jQuery

export default (textArea, opt, nowrap = false) => {
    //export default (textArea, lineHeight = 1.2, paddingX = 0.5, paddingY = 0.5, nowrap = false) => {
    //const originalFontSize = parseInt(textSvg.match(/.+font-size="(\d+)".+/)[1])
    let text = textArea.text;
    let rect = textArea.rect;
    
    let originalFontSize = 14;
    let m = text.attr("style").match(/.+font-size:(\d+)px.+/)
    if (m)
	originalFontSize = parseInt(m[1])
    let fontSize = originalFontSize
    console.log(fontSize)

    let lineHeight = 1.2
    let paddingX = 0.0
    let paddingY = 0.0
    m = text.attr("style").match(/.+;shape-padding:(\d+.\d+);.+/)
    if (m) {
	console.log(`padding: ${m[1]}`)
	let p = parseFloat(m[1])
	//paddingX = p / fontSize
	//paddingY = p / fontSize
	paddingX = p
	paddingY = p
    }
    
    
    // find the right-size font-size
    //const physicalLines = textContent.split("\n")
    const physicalLines = text.text().split("\n")
    console.log(physicalLines)
    let logicalLines = []
    while (true) {
//	let maxRows = Math.floor((rect.attr('height') - (2 * fontSize * paddingY)) / (fontSize * lineHeight))
//	let maxColumns = Math.floor((rect.attr('width') - (2 * fontSize * paddingX)) / fontSize) // doesn't care about proportional font

	let maxRows = Math.floor((rect.attr('height') - (2 * paddingY)) / (fontSize * lineHeight))
	let maxColumns = Math.floor((rect.attr('width') - (2 * paddingX)) / fontSize) // doesn't care about proportional font

	if (nowrap) {
	    logicalLines = physicalLines
	} else {
	    logicalLines = []
	    physicalLines.forEach(line => {
		logicalLines = logicalLines.concat(splitStringByWidth(line, maxColumns * 2)) // 2 single-byte characters can be placed in 1 column
	    })
	}

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

    // raise y-coordinate up because y-coordinate of <text transform="translate(x y)"> or <tspan y=""> is on lower base of text object
    let adjustY = fontSize - originalFontSize;  //for top
    if (opt) {
        if (opt.includes('c'))
            adjustY = fontSize - originalFontSize + dh / 2 - paddingY //for center
        else if (opt.includes('b'))
            adjustY = fontSize - originalFontSize + dh  - paddingY * 2//for bottom
    }

    
    //let adjustedTextSvg = fixTextTransform($(textSvg))
    //  adjustedTextSvg = adjustedTextSvg.replace(new RegExp('<tspan(.|\\s)+</text>'), '')
    //  adjustedTextSvg = adjustedTextSvg.replace(new RegExp('font-size="\\d+"'), `font-size="${fontSize}"`)
    //  adjustedTextSvg += '{tspan}</text>'
    //let adjustedText = fixTextTransform(text)
    fixTextTransform(text)

    let style = text.attr("style")
    text.attr("style", style.replace(/font-size:\d+px/, "font-size:" + fontSize + "px"))
    //text.attr("style", style.replace(/shape-padding.*?;/, ""))
    text.empty();
    
    //    const x = fontSize * paddingX
    const x = 0.0
    logicalLines.forEach((line, i) => {
	//const y = adjustY + fontSize * (paddingY + (i * lineHeight))
	const y = adjustY + fontSize * (i * lineHeight)
	//text.append(`<tspan x="${x}" y="${y}">${line}</tspan>`)
	$(`<tspan x="${x}" y="${y}">${line}</tspan>`).appendTo(text)
	
    })

    console.log(text.prop('outerHTML'))
    //text.replaceWith(text.prop('outerHTML'))
    //adjustedTextSvg = adjustedTextSvg.replace('{tspan}', tspan)

    //return adjustedTextSvg
}
