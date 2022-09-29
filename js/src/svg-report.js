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
            console.log(r);
            return r;
        }
        
    }
    return null;
}

function makeMap(svg) {
    let map = {}
    let texts = svg.find("text")
    let re = /^%(([tcb]|[smeM])*)(%.*%)$/
    texts.each((index, t) => {
	let text = $(t)
	let m = text.text().match(re)
	if (m) {
            console.log(`${text.text()}: ${m[1]}, ${m[2]}, ${m[3]}`)
	    let rect = getRect(text)
	    if (rect != null) {
		console.log(text)
		let ph = m[3]
		if (!map[ph])
		    map[ph] = []
		map[ph].push({"text": text, "rect": rect, "opt": m[1]})
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
    constructor(recipeUrl, selector) {
	this.recipeUrl = recipeUrl
	this.selector = selector
	this.svgdivs = [];
    }

    render() {
	$.getJSON(this.recipeUrl, json => {
            console.log(json);
            if($.isArray(json)) {
		for (var i in json) {
		    console.log(i)
		    this.renderEach($(this.selector), json[i], i)
		}
            } else {
		this.renderEach($(this.selector), json, 0)
            }
	    
	    $('body').children().each((i, e) => setNoPrint($(e), this.selector))
	})
    }
    
    renderEach(svgArea, svgRecipe, i) {
	console.log(svgRecipe)
	console.log(svgRecipe['svgUrl'])
	let svgText = $.get({url: svgRecipe['svgUrl'], async: false}).responseText
	let svg = $(svgText)
	let r = (Math.random() + 1).toString(36).substring(7)
	console.log("random", r)
	let svgId = r + "_svg_" + i
	console.log(svgId)
	svg.attr('id', svgId) 
	let svgdiv = $("<div></div>");  //need to avoid extra blank page for chrome
	this.svgdivs.push(svgdiv)
	svgdiv.append(svg)
	svgArea.append(svgdiv)
	changeIdAll(svgId)

	const viewBoxWidth = svgArea.attr('viewBox')?.split(/ +/)[2] ?? null
	const paperPixelRatio = viewBoxWidth ? parseFloat(viewBoxWidth) / 0.254 / svgArea[0].getBoundingClientRect().width : 1

	var map = makeMap(svg);
	console.log(map);
	//let paper = new SvgPaper('#' + svgId);
	for (let ph in map) {
            console.log(ph)
            console.log(svgRecipe['placeHolderValueMap'][ph])
            if (!svgRecipe['placeHolderValueMap'][ph])
                continue
            let v = svgRecipe['placeHolderValueMap'][ph]['value']
            for (let item of map[ph]) {
                let text = item["text"]
                let rect = item["rect"]
                if (!text) continue;
	       let tspan = $(text.find('tspan')[0])
	       text.empty();
	       text.append(tspan);
                text.children(0).text(v ? v : "");
                //text.children(0).text(v? v + v + v + v + v: "")
                console.log(text.text())
                console.log(text.attr("id"))
                console.log(text.attr("transform"))
                console.log(rect.attr("width"))
                //        paper
                //.replace(ph, v + v + v + '\n' + v + v + v + v + v + v + v)
                //.adjustTextarea(text, rect.attr('width'), rect.attr('height'))
                //.adjustTextarea('#' + text.attr('id'), rect.attr('width'), rect.attr('height'))
                //.adjustTextarea(map[ph])
                //.adjustText(map[ph], "")
                console.log(`opt: ${item['opt']}`)
                if (item["opt"] && item["opt"].includes('M'))
		    adjustTextarea(item, item["opt"])
                else
		    adjustText(item, item["opt"], paperPixelRatio)
            // paper.replace(ph, v + v + v + v)
            // .adjustText(map[ph])
            }
	}
	$('#' + svgId).replaceWith($('#' + svgId).prop('outerHTML'));
	//    paper.apply()
    }

    select(index) {
	//	this.svgdivs[index].addClass('noscreen')
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

