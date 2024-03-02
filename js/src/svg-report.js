'use strict'

import adjustText from './adjust-text.js'
import adjustTextarea from './adjust-textarea.js'
import { MMPPX } from './utility/const'

function getAreaHeight(text) {
  let m = text.style.fontSize.match(/(.*?)px/)
  const fontSize = m ? parseFloat(m[1]) / MMPPX : 4.2333 / MMPPX
  m = text.style.lineHeight.match(/(\d+.\d+)/)
  const lineHeight = m ? parseFloat(m[1]) : 1.25;
  const lineCount = text.getElementsByTagName('tspan').length
  return lineCount * lineHeight * fontSize;
}

function getRect(svg, text) {
  const s = text.getAttribute('style');
  let m = s.match(/shape-inside:url\((.*?)\)/)
  if (m) {
    const rect = svg.querySelector(m[1])
    console.log(rect)
    return {
      "width": parseFloat(rect.getAttribute('width')),
      "height": parseFloat(rect.getAttribute('height'))
    }
  }
  const h = getAreaHeight(text)
  m = s.match(/inline-size:(\d+.\d+)/);
  const w = m ? parseFloat(m[1]) / MMPPX : null

  return { "width": w, "height": h }
}

function makeMap(svg) {
  const map = {}
  const texts = svg.querySelectorAll('text')
  const re = /^(%.*%)/
  texts.forEach(t => {
    let m = t.textContent?.match(re)
    if (m) {
      let ph = m[1]
      if (!map[ph])
        map[ph] = []
      map[ph].push({ "text": t, "area": getRect(svg, t) })
    }
  })
  return map
}

function fixTransform(text) {
  let scale = 1.0
  let dx = 0.0
  let dy = 0.0
  let transform = text.getAttribute('transform')
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
  m = text.getAttribute('style').match(/font-size:(.*?)px/)
  if (m) {
    const fontSize = parseFloat(m[1]) * scale
    console.log(`fontSize: ${fontSize}`)
    text.setAttribute('style', text.getAttribute('style').replace(/font-size:.*?px/, `font-size:${fontSize}px`))
  }
  let x = 0
  let y = 0
  let tspan = text.querySelectorAll('tspan')[0]
  if (!text.getAttribute('x')) {
    x = parseFloat(tspan.getAttribute('x')) * scale
    y = parseFloat(tspan.getAttribute('y')) * scale
  } else {
    x = parseFloat(text.getAttribute('x')) * scale
    y = parseFloat(text.getAttribute('y')) * scale
  }

  console.log(`x: ${x}, y: ${y}`)
  text.setAttribute('transform', `translate(${x + dx}, ${y + dy})`)
  tspan.setAttribute('x', '0')
  tspan.setAttribute('y', '0')
  text.setAttribute('x', '0')
  text.setAttribute('y', '0')
}

function setNoPrint(p, selector) {
  if (p == document.querySelector(selector))
    return
  const print = p.querySelectorAll(selector)
  if (print.length == 0) {
    p.classList.add('noprint')
    return
  }
  Array.from(p.children).forEach(c => setNoPrint(c, selector))
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

  async createSvg(svgRecipe, index) {
    const res = await fetch(svgRecipe['svgUrl'])
    const svgtext = await res.text()
    const r = (Math.random() + 1).toString(36).substring(7)
    const svgId = r + "_svg_" + index
    console.log(svgId)
    const svgdiv = document.createElement('div');  //need to avoid extra blank page for chrome

    this.svgdivs.push(svgdiv)
    svgdiv.innerHTML = svgtext
    document.querySelector(this.selector).appendChild(svgdiv)

    const svg = svgdiv.querySelector('svg')
    svg.setAttribute('id', svgId)
    return svg;
  }

  async doRender(obj) {
    console.log(obj);
    const svgRecipes = Array.isArray(obj) ? obj : [obj];
    svgRecipes.forEach(async (svgRecipe, i) => {
      this.renderEach(await this.createSvg(svgRecipe, i), svgRecipe)
    })
    Array.from(document.querySelector('body').children).forEach(e => setNoPrint(e, this.selector))
  }

  renderEach(svg, svgRecipe) {
    const viewBoxWidth = svg.getAttribute('viewBox')?.split(/ +/)[2] ?? null
    const paperPixelRatio = viewBoxWidth ? parseFloat(viewBoxWidth) / 0.254 / svg.getBoundingClientRect().width : 1
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

        const tspan = text.querySelectorAll('tspan')[0]
        while (text.firstChild)
          text.removeChild(text.firstChild)
        text.appendChild(tspan);
        text.children[0].textContent = v ?? ''

        if (o?.align?.match(/[TMB]/))
          adjustTextarea(text, item.area, o)
        else
          adjustText(text, item.area, o, paperPixelRatio)
      }
    }
  }

  select(index) {
    this.svgdivs.forEach((d, i) => {
      if (index < 0 || i == index)
        d.classList.remove('noscreen')
      else
        d.classList.add('noscreen')
    })
    /*
      for (let i in this.svgdivs) {
          let d = this.svgdivs[i]
          if (index < 0 || i == index)
              d.classList.remove('noscreen')
          else 
              d.classList.add('noscreen')
      }
      */
  }

  show(index) {
    this.svgdivs[index].classList.remove('noscreen')
  }

  getNumPage() {
    return this.svgdivs.length
  }
}

