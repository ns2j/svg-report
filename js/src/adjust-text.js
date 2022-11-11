'use strict'
import jQuery from 'jquery'
import getMatrix from './utility/matrix'
import fixTextTransform from './utility/fix-text-transform'

const $ = jQuery

//export default (selector, config, paperPixelRatio = 1) => {
export default (textArea, textAnchor, paperPixelRatio = 1) => {
  //const $this = document.querySelector(selector)
  let text = $('#' + textArea.text.attr('id'));
  const boundingClientRectWidth = text[0].getBoundingClientRect().width;
  const textLength = textArea.rect.attr('width')
  //if (!$this) {
  //  return
  //}

  // shrink text element to specified width
  //if (!!config['textLength']) {
  if (!!textLength) {
    // for firefox
    // @see https://developer.mozilla.org/ja/docs/Web/API/Element/clientWidth
    //$this.style.display = 'block'
    text.css('display', 'block')
console.log(boundingClientRectWidth)
 console.log(paperPixelRatio)
console.log(textArea.rect.attr('width'))
    const tspan = $(text.find('tspan')[0])

    text.empty()
    if (boundingClientRectWidth * paperPixelRatio > textArea.rect.attr('width')) {
      //if (tspan.length > 0)
        //tspan = $(tspan[0]);
      //$this.querySelector('tspan').setAttribute('textLength', textArea.rect.attr('width'))
      //$this.querySelector('tspan').setAttribute('lengthAdjust', 'spacingAndGlyphs')
      tspan.attr('textLength', textLength)
      tspan.attr('lengthAdjust', 'spacingAndGlyphs')

      // for firefox
      // @see https://bugzilla.mozilla.org/show_bug.cgi?id=890692
      //$this.setAttribute('textLength', textArea.rect.attr('width'))
      //$this.setAttribute('lengthAdjust', 'spacingAndGlyphs')
      text.attr('textLength', textLength)
      text.attr('lengthAdjust', 'spacingAndGlyphs')
      
    }
    text.append(tspan);
  }

  //vertical alignment (always center)
  const areaH = textArea.rect.attr('height')
  const textH = text.find('tspan')[0].getClientRects()[0].height
  text.attr('transform', getMatrix(text.attr('transform'), 0, areaH / 2 - textH / 2))     

  // alignment
  //if (!!config['text-anchor'] && config['text-anchor'] !== 'start') {
  if (!!textAnchor && textAnchor !== 'start') {
    //const w = parseFloat(config['textLength'])
    const areaW = parseFloat(textLength);
    const textW = text.find('tspan')[0].getClientRects()[0].width;
    console.log(textW);

    let x = 0

    //if ($this.getAttribute('transform')) {
    //  x = parseFloat($this.getAttribute('transform').match(/translate\((\S+) .+\)/)[1])
    //  y = parseFloat($this.getAttribute('transform').match(/translate\(\S+ (.+)\)/)[1])
   // }

    //if (config['text-anchor'] === 'middle') {
    //  $this.setAttribute('transform', `translate(${x + (w / 2)} ${y})`)
   // }
   if (textAnchor === 'm') {
        text.attr('transform', getMatrix(text.attr('transform'), areaW / 2 - textW / 2, 0))     
   }

    //if (config['text-anchor'] === 'end') {
    //  $this.setAttribute('transform', `translate(${x + w} ${y})`)
    //}
    if (textAnchor === 'e') {
        text.attr('transform', getMatrix(text.attr('transform'), areaW - textW , 0))     
    }

    //$this.setAttribute('text-anchor', config['text-anchor'])
    text.attr('text-anchor', textAnchor)
  }
}
