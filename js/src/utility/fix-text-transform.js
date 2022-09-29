import jQuery from 'jquery'
import getMatrix from './matrix'

const $ = jQuery

export default (text) => {
        /*
  let transform = text.attr("transform")
  let mx = 0
  let my = 0
  let match = transform.match(/matrix\(.*,(.*),(.*)\)/)
  if (match) {
    mx = parseFloat(match[1])
    my = parseFloat(match[2])
  }    
    
  const mmppx = 0.26458333 //mm per px (inkscape use 96dpi)
  */
  let tspan = text.find("tspan")
  let x = parseFloat(tspan.attr("x"))
  let y = parseFloat(tspan.attr("y"))
  tspan.attr("x", "0")
  tspan.attr("y", "0")
  //text.attr("transform", `matrix(${mmppx}, 0, 0, ${mmppx}, ${mx + x * mmppx}, ${my + y * mmppx})`)
  text.attr("transform", getMatrix(text.attr("transform"), x, y))
  //return text
  
        
/*
  let fixedTextSvg = textSvg

  // if <text> doesn't have transform="translate(x y)", just add it with (0 0)
  if (!fixedTextSvg.match(/<text [^>]*transform="[^"]*"[^>]*>/)) {
    fixedTextSvg = fixedTextSvg.replace(new RegExp('<text([^>]*)>'), '<text$1 transform="translate(0 0)">')
  }

  // if <tspan> doesn't have x="" y="", just add it with x="0" y="0"
  if (!fixedTextSvg.match(/<tspan [^>]*x="[^"]*"[^>]*>/)) {
    fixedTextSvg = fixedTextSvg.replace(new RegExp('<tspan([^>]*)>'), '<tspan$1 x="0">')
  }
  if (!fixedTextSvg.match(/<tspan [^>]*y="[^"]*"[^>]*>/)) {
    fixedTextSvg = fixedTextSvg.replace(new RegExp('<tspan([^>]*)>'), '<tspan$1 y="0">')
  }

  // copy x from <tspan x=""> and add it to <text transform="translate(x y)">
  fixedTextSvg = fixedTextSvg.replace(new RegExp('<text([\\s\\S]+)transform="translate\\((\\S+)\\s+(.+)\\)"([^>]*)>\s*<tspan([^>]+)x="([^"]+)"'), '<text$1transform="translate(###$2+$6### $3)"$4><tspan$5x="0"')
  const expression1 = fixedTextSvg.match(new RegExp('<text[\\s\\S]+transform="translate\\(###(.+)###.+\\)"'))[1]
  const x = expression1.match(/\d+\+\d+/) ? eval(expression1) : 0
  fixedTextSvg = fixedTextSvg.replace(new RegExp('<text([\\s\\S]+)transform="translate\\(###.+###(.+)\\)"'), `<text$1transform="translate(${x}$2)"`)

  // copy y from <tspan y=""> and add it to <text transform="translate(x y)">
  fixedTextSvg = fixedTextSvg.replace(new RegExp('<text([\\s\\S]+)transform="translate\\((.+)\\s+(\\S+)\\)"([^>]*)>\s*<tspan([^>]+)y="([^"]+)"'), '<text$1transform="translate($2 ###$3+$6###)"$4><tspan$5y="0"')
  const expression2 = fixedTextSvg.match(new RegExp('<text[\\s\\S]+transform="translate\\(.+###(.+)###\\)"'))[1]
  const y = expression2.match(/\d+\+\d+/) ? eval(expression2) : 0
  fixedTextSvg = fixedTextSvg.replace(new RegExp('<text([\\s\\S]+)transform="translate\\((.+)###.+###\\)"'), `<text$1transform="translate($2${y})"`)

  return fixedTextSvg
  */
}
