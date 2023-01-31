'use strict'
import jQuery from 'jquery'

const $ = jQuery

export default (text, opt, paperPixelRatio = 1) => {
  const mmppx = 0.26458333 //mm per px (inkscape use 96dpi)
  if (!opt) opt = {}
  const boundingClientRectWidth = text[0].getBoundingClientRect().width

  let m = text.attr('style').match(/font-size:(.*?)px/)
  const originalFontSize = m ? parseFloat(m[1]) / 1.3333 / mmppx : 4.2333 / mmppx
  if (opt && opt.fontSize) {
    text.attr('style', text.attr('style').replace(/font-size:.*?px/, `font-size:${opt.fontSize * 1.3333 * mmppx}px`))
    console.log(`originalFonSize: ${originalFontSize}, opt.fontSize: ${opt.fontSize}}`)
  } 

  let textLength
  if (opt && opt.width) {
     textLength = opt.width
   } else {
    m = text.attr('style').match(/inline-size:(\d+.\d+)/)
    textLength = m ? parseFloat(m[1]) : 10.0;
   }
   const areaW = textLength / mmppx
                
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
  if (!!opt.align && opt.align !== 's') {
   if (opt.align === 'm') {
        //text.attr('transform', getMatrix(text.attr('transform'), areaW / 2 - textW / 2, 0))
//        text.attr('transform', getMatrix(text.attr('transform'), areaW / 2, 0))
        text.attr('transform', `translate(${areaW / 2 * mmppx}, 0)`)
        textAnchor = 'middle'     
   }

    if (opt.align === 'e') {
        //text.attr('transform', getMatrix(text.attr('transform'), areaW , 0))
        text.attr('transform', `translate(${areaW * mmppx}, 0)`)
        textAnchor = 'end'     
    }

    text.attr('text-anchor', textAnchor)
  }
}
