'use strict'
import jQuery from 'jquery'
import {MMPPX, NINETYSIX_DPI} from './utility/const' 

const $ = jQuery

function addTranslate(text, x, y) {
  let transform = text.attr("transform")
  if (!transform) {
    text.attr('transform', `translate(${x}, ${y})`)
    return
  }
    
  let dx = 0
  let dy = 0
  let match = transform.match(/translate\((.*),(.*)\)/)
  if (match) {
    dx = parseFloat(match[1])
    dy = parseFloat(match[2])
  }    

  text.attr('transform', `translate(${x + dx}, ${y + dy})`)
}

export default (text, area, opt, paperPixelRatio) => {
  if (!opt) opt = {}
  const boundingClientRectWidth = text[0].getBoundingClientRect().width

  if (opt.fontSize)
    text.attr('style', text.attr('style').replace(/font-size:.*?px/, `font-size:${opt.fontSize * NINETYSIX_DPI * MMPPX}px`))
  console.log(`opt.fontSize: ${opt.fontSize}`)

  let textLength
  if (opt.width) {
    textLength = opt.width
  } else {
    if (area.width)
      textLength = area.width
    else if (opt.align === 's')
      return
    else
      textLength = 10.0
  }
  text.attr('style', text.attr('style').replace(/inline-size:.*?;/, ';'))
  console.log(`textLength: ${textLength}`)

  const tspan = $(text.find('tspan')[0])
  text.empty()
    
  console.log(`boundingClientRectWidth: ${boundingClientRectWidth}`)
  if (boundingClientRectWidth* paperPixelRatio * MMPPX > textLength) {
    text.attr('textLength', textLength)
    text.attr('lengthAdjust', 'spacingAndGlyphs')
  }
  text.append(tspan);

  switch(opt.align) {
    case 'm':
      addTranslate(text, textLength / 2, 0)
      text.attr('text-anchor', 'middle')
      break;
    case 'e':
      addTranslate(text, textLength , 0)
      text.attr('text-anchor', 'end')
      break;
    default:
      break;
  }
}
