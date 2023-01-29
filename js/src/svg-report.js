'use strict'

import jQuery from 'jquery'
import adjustText from './adjust-text.js'
import adjustTextarea from './adjust-textarea.js'
const $ = jQuery

function getRect(text) {
    let s = text.attr("style");
    let sp = s.split(";");
    for (let spi of sp) {
        let re = /shape-inside:url\((.*)\)/;
        if (spi.match(re)) {
            let rid = spi.replace(re, '$1');
            let r = $(rid);
            return r;
        }
        
    }
    return null;
}

function makeMap(svg) {
    const map = {}
    const texts = svg.find("text")
    const re = /^(%.*%)$/
    texts.each((index, t) => {
        let text = $(t)
        let m = text.text().match(re)
        if (m) {
            let rect = getRect(text)
            if (rect != null) {
                let ph = m[1]
                if (!map[ph])
                    map[ph] = []
                map[ph].push({"text": text, "rect": rect})
            }
        }
    })
    return map
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

        const map = makeMap(svg);
        for (let ph in map) {
          console.log(svgRecipe['holderMap'][ph])
          const value = svgRecipe['holderMap'][ph]
          if (!value) continue
          const v = value['value']
          const o = value['opt']
          for (let item of map[ph]) {
            const text = item["text"]
            const rect = item["rect"]
            if (!text) continue;
            const tspan = $(text.find('tspan')[0])
            text.empty();
            text.append(tspan);
            text.children(0).text(v ? v : "");
            console.log(text.text())
            console.log(text.attr("id"))
            console.log(text.attr("transform"))
            console.log(rect.attr("width"))
 
            if (o && o.alignx && o.alignx.includes('M'))
               adjustTextarea(item, o)
            else
               adjustText(item, o, paperPixelRatio)
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

