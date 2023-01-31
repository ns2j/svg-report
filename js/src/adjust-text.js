'use strict'
import jQuery from 'jquery'
import {MMPPX, NINETYSIX_DPI} from './utility/const' 

const $ = jQuery

export default (text, opt, paperPixelRatio = 1) => {
  if (!opt) opt = {}
  const boundingClientRectWidth = text[0].getBoundingClientRect().width

  let m = text.attr('style').match(/font-size:(.*?)px/)
  const originalFontSize = m ? parseFloat(m[1]) / NINETYSIX_DPI / MMPPX : 4.2333 / MMPPX
  if (opt.fontSize) {
    text.attr('style', text.attr('style').replace(/font-size:.*?px/, `font-size:${opt.fontSize * NINETYSIX_DPI * MMPPX}px`))
    console.log(`originalFonSize: ${originalFontSize}, opt.fontSize: ${opt.fontSize}}`)
  } 

  let textLength
  if (opt && opt.width) {
     textLength = opt.width
   } else {
    m = text.attr('style').match(/inline-size:(\d+.\d+)/)
    textLength = m ? parseFloat(m[1]) : 10.0;
   }
   const areaW = textLength / MMPPX
                
  console.log(`textLength: ${textLength}`)

  // shrink text element to specified width
  if (!!textLength) {
    // for firefox
    text.css('display', 'block')

console.log(boundingClientRectWidth)
 console.log(paperPixelRatio)
console.log(areaW)

    text.attr('style', text.attr('style').replace(/inline-size:.*?px/, ''))
     console.log(text.attr('style'))
    const tspan = $(text.find('tspan')[0])

    text.empty()
    if (boundingClientRectWidth * paperPixelRatio > areaW) {
      tspan.attr('textLength', parseFloat(textLength))
      tspan.attr('lengthAdjust', 'spacingAndGlyphs')

      text.attr('textLength', parseFloat(textLength))
      text.attr('lengthAdjust', 'spacingAndGlyphs')
      
    }
    text.append(tspan);
  }

    //const areaH = textArea.rect.attr('height')
  //const textH = text.find('tspan')[0].getClientRects()[0].height
//  text.attr('transform', getMatrix(text.attr('transform'), 0, areaH / 2 - textH / 2))     

  // alignment
  let textAnchor = "start"
  switch(opt.align) {
    case 'm':
      text.attr('transform', `translate(${areaW / 2 * MMPPX}, 0)`)
      text.attr('text-anchor', 'middle')
      break;
    case 'e':
      text.attr('transform', `translate(${areaW * MMPPX}, 0)`)
      text.attr('text-anchor', 'end')
      break;
    default:
      break;
  }
}
