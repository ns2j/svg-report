'use strict'

import jQuery from 'jquery'
import adjustText from './adjust-text.js'
import adjustTextarea from './adjust-textarea.js'
import {MMPPX} from './utility/const'

const $ = jQuery

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
      map[ph].push(text)
     }
  })
  return map
}  

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

function changeIdAll(svgId) {
    let svg = $('#svgreport').find("#" + svgId);
    console.log(svg);
    let re = /(^id|\s+id)="(.+?)(">|"\s|"$)/g
    let newId = svg.html().replace(re, ' id="$2_'+ svgId + '$3')
    re = /shape-inside:url\((#.+?)\);/g;
    newId = newId.replace(re, 'shape-inside:url($1_' + svgId + ');');
    //console.log(newId)
    svg.html(newId);
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

    render() {
        const tmp = this.recipeUrlOrObject;
        if (typeof tmp === "string" || tmp instanceof String)
            $.getJSON(tmp, json => this.doRender(json))
        else
            this.doRender(tmp)
    }
    
    doRender(obj) {
        console.log(obj);
        if(Array.isArray(obj)) {
            for (var i in obj)
                this.renderEach($(this.selector), obj[i], i)
        } else {
            this.renderEach($(this.selector), obj, 0)
        }
        $('body').children().each((i, e) => setNoPrint($(e), this.selector))
    }

    renderEach(svgArea, svgRecipe, i) {
      $.get(svgRecipe['svgUrl'])
      .done((data) => {
        const svg = $(data.rootElement)
        const r = (Math.random() + 1).toString(36).substring(7)
        const svgId = r + "_svg_" + i
        console.log(svgId)
        svg.attr('id', svgId) 
        const svgdiv = $("<div></div>");  //need to avoid extra blank page for chrome
        this.svgdivs.push(svgdiv)
        svgdiv.append(svg)
        svgArea.append(svgdiv)
        changeIdAll(svgId)

        const viewBoxWidth = svgArea.attr('viewBox')?.split(/ +/)[2] ?? null
        const paperPixelRatio = viewBoxWidth ? parseFloat(viewBoxWidth) / 0.254 / svgArea[0].getBoundingClientRect().width : 1

        const map = makeMap(svg)
        console.log(map)
        for (let ph in map) {
          console.log(svgRecipe['holderMap'][ph])
          const value = svgRecipe['holderMap'][ph]
          if (!value) continue
          const v = value['value']
          const o = value['opt']
          for (let text of map[ph]) {
            const areaH = getAreaHeight(text)
            console.log(`areaH: ${areaH}`)
            const tspan = $(text.find('tspan')[0])
            text.empty();
            text.append(tspan);
            text.children(0).text(v ? v : "")
            console.log(text.text())
            console.log(text.attr("id"))
            console.log(text.attr("transform"))
 
            if (o && o.align && o.align.match(/[tcb]/))
               adjustTextarea(text, areaH, o)
            else
               adjustText(text, o, paperPixelRatio)
           }
         }
        $('#' + svgId).replaceWith($('#' + svgId).prop('outerHTML'));
     })
     .fail((xhr, textStatus, error) => {
        console.log(xhr)
        console.log(textStatus)
        console.log(error)
      }) 
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

