'use strict'

import jQuery from 'jquery'
import adjustText from './adjust-text.js'
import adjustTextarea from './adjust-textarea.js'
import {MMPPX} from './utility/const'

const $ = jQuery

function getAreaHeight(text) {
  const style = text.attr('style')
  let m = style.match(/font-size:(.*?)px/)
  const fontSize = m ? parseFloat(m[1]) / MMPPX : 4.2333 / MMPPX
  m = style.match(/line-height:(\d+.\d+)/)
  const lineHeight = m ? parseFloat(m[1]) : 1.25;
  console.log(`lineHeight: ${lineHeight}`)
  const lineCount = text.find('tspan').length
  console.log(`lineCount: ${lineCount}`)
  return lineCount * lineHeight * fontSize;
}

function getRect(svg, text) {
  let s = text.attr('style');
  let m = s.match(/shape-inside:url\((.*?)\)/)
  if (m) {
    let rect = svg.find(m[1])
    return {"width": parseFloat(rect.attr('width')),
     "height": parseFloat(rect.attr('height'))}
  }
  const h = getAreaHeight(text)
  m = text.attr('style').match(/inline-size:(\d+.\d+)/);
  const w = m ? parseFloat(m[1]) / MMPPX : null 
    
  return {"width": w, "height": h}
}

function makeMap(svg) {
  const map = {}
  const texts = svg.find("text")
  const re = /^(%.*%)/
  texts.each((index, t) => {
    let text = $(t)
    let m = text.text().match(re)
    if (m) {
      let ph = m[1]
      if (!map[ph])
        map[ph] = []
      map[ph].push({"text": text, "area" : getRect(svg, text)})
     }
  })
  return map
}  

function fixTransform(text) {
  let scale = 1.0
  let dx = 0.0
  let dy = 0.0
  let transform = text.attr('transform')
  if (!transform) transform = ""
         
  let m = transform.match(/scale\((\d+.\d+)\)/)
  if (m)
    scale = parseFloat(m[1])
  else {
    m = transform.match(/matrix\((.*),(.*),(.*),(.*),(.*),(.*)\)/)
    if (m) {
      scale = parseFloat(m[1])
      dx = parseFloat(m[5])
      dy = parseFloat(m[6])
    } else {
      m = transform.match(/translate\((.*),(.*)\)/)
      if (m) {
        dx = parseFloat(m[1])  
        dy = parseFloat(m[2])  
      }
    }
  }
  console.log(`scale: ${scale}, dx: ${dx}, dy: ${dy}`)
  m = text.attr('style').match(/font-size:(.*?)px/)
  if (m) {
    const fontSize = parseFloat(m[1]) * scale
    console.log(`fontSize: ${fontSize}`)
    text.attr('style', text.attr('style').replace(/font-size:.*?px/, `font-size:${fontSize}px`))
    console.log(text.attr('style'))
  }
  let x = 0
  let y = 0
  let tspan = text.find('tspan').first()
  if (!text.attr('x')) {
    x = parseFloat(tspan.attr('x')) * scale
    y = parseFloat(tspan.attr('y')) * scale
  } else {
    x = parseFloat(text.attr('x')) * scale
    y = parseFloat(text.attr('y')) * scale
  }
  
  console.log(`x: ${x}, y: ${y}`)
  text.attr('transform', `translate(${x + dx}, ${y + dy})`)
  tspan.attr('x', '0')
  tspan.attr('y', '0') 
  text.attr('x', '0')
  text.attr('y', '0') 
}

function setNoPrint(p, selector) {
    if (p.is(selector))
        return
    let print = p.find(selector)
    if (print.length == 0) {
        p.addClass('noprint')
        return
    }
    p.children().each((i,c) => setNoPrint($(c), selector))
}

export class SvgReport {
    constructor(recipeUrlOrObject, selector) {
        this.recipeUrlOrObject = recipeUrlOrObject
        this.selector = selector
        this.svgdivs = []
    }

    async render() {
        const tmp = this.recipeUrlOrObject;
        if (typeof tmp === "string" || tmp instanceof String) {
            const res = await fetch(tmp)
            this.doRender(await res.json())   
        } else {
            this.doRender(tmp)
        }
    }
    
    doRender(obj) {
        console.log(obj);
        const objs = Array.isArray(obj) ? obj : [obj];
        this.renderEach($(this.selector), objs, 0)
    }

    async renderEach(svgArea, svgRecipes, i) {
      const svgRecipe = svgRecipes[i]
      const res = await fetch(svgRecipe['svgUrl'])
      const svg = $(await res.text())
      const r = (Math.random() + 1).toString(36).substring(7)
      const svgId = r + "_svg_" + i
      console.log(svgId)
      svg.attr('id', svgId) 
      const svgdiv = $("<div></div>");  //need to avoid extra blank page for chrome
      this.svgdivs.push(svgdiv)
      svgdiv.append(svg)
      svgArea.append(svgdiv)

      const viewBoxWidth = svg.attr('viewBox')?.split(/ +/)[2] ?? null
      const paperPixelRatio = viewBoxWidth ? parseFloat(viewBoxWidth) / 0.254 / svgArea[0].getBoundingClientRect().width : 1
      console.log(`paperPixelRatio: ${paperPixelRatio}`)

      const map = makeMap(svg)
      console.log(map)
      for (let ph in map) {
        console.log(svgRecipe['holderMap'][ph])
        const value = svgRecipe['holderMap'][ph]
        if (!value) continue
        const v = value['value']
        const o = value['opt']
        for (let item of map[ph]) {
          const text = item.text
          fixTransform(text)
          const tspan = text.find('tspan').first()
          text.empty();
          text.append(tspan);
          text.children(0).text(v ?? "")
          console.log(text.text())
 
          if (o && o.align && o.align.match(/[TMB]/))
            adjustTextarea(text, item.area, o)
          else
            adjustText(text, item.area, o, paperPixelRatio)
          }
      }
        
      //svg.replaceWith(svg.prop('outerHTML'))
        
      console.log(`i: ${i}, svgRecipes.length: ${svgRecipes.length}`)
      i++;
      if (i < svgRecipes.length) //loop continue
        this.renderEach(svgArea, svgRecipes, i)
      else  //loop end
        $('body').children().each((i, e) => setNoPrint($(e), this.selector))
    }

    select(index) {
        //        this.svgdivs[index].addClass('noscreen')
        for (let i in this.svgdivs) {
            let d = this.svgdivs[i]
            if (i == index)
                d.removeClass('noscreen')
            else 
                d.addClass('noscreen')
        }
    }

    show(index) {
        this.svgdivs[index].removeClass('noscreen')
    }
}

