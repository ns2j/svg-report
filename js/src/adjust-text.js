'use strict'
import {MMPPX, NINETYSIX_DPI} from './utility/const' 

function addTranslate(text, x, y) {
  let transform = text.getAttribute("transform")
  if (!transform) {
    text.setAttribute('transform', `translate(${x}, ${y})`)
    return
  }
    
  let dx = 0
  let dy = 0
  let match = transform.match(/translate\((.*),(.*)\)/)
  if (match) {
    dx = parseFloat(match[1])
    dy = parseFloat(match[2])
  }    

  text.setAttribute('transform', `translate(${x + dx}, ${y + dy})`)
}

export default (text, area, opt, paperPixelRatio) => {
  if (!opt) opt = {}
  
  const boundingClientRectWidth = text.getBoundingClientRect().width

  if (opt.fontSize)
    text.style.fontSize = `${opt.fontSize * NINETYSIX_DPI * MMPPX}px`
  console.log(`opt.fontSize: ${opt.fontSize}`)

  let textLength
  if (opt.width) {
    textLength = opt.width
  } else {
    if (area.width)
      textLength = area.width * MMPPX
    else if (opt.align === 's')
      return
    else
      textLength = 10.0
  }
  text.style.inlineSize = ''
  console.log(`textLength: ${textLength}`)

  const tspan = text.querySelector('tspan')
  text.innerHTML = ''
    
  console.log(`boundingClientRectWidth: ${boundingClientRectWidth}`)
  if (boundingClientRectWidth * paperPixelRatio * MMPPX > textLength) {
    tspan.setAttribute('textLength', textLength)
    tspan.setAttribute('lengthAdjust', 'spacingAndGlyphs')

    text.setAttribute('textLength', textLength)
    text.setAttribute('lengthAdjust', 'spacingAndGlyphs')
  }
  text.appendChild(tspan);

  switch(opt.align) {
    case 'm':
      addTranslate(text, textLength / 2, 0)
      text.setAttribute('text-anchor', 'middle')
      break;
    case 'e':
      addTranslate(text, textLength , 0)
      text.setAttribute('text-anchor', 'end')
      break;
    default:
      break;
  }
}
