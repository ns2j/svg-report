import jQuery from 'jquery'

const $ = jQuery

export default (text) => {
  let transform = text.attr("transform")

  let dx = 0
  let dy = 0
  let match = transform.match(/translate\((.*),(.*)\)/)
  if (match) {
    dx = parseFloat(match[1])
    dy = parseFloat(match[2])
  }    
  //console.log(`dx: ${dx}`)
  //console.log(`dy: ${dy}`)
    
  let x = parseFloat(text.attr("x"))
  let y = parseFloat(text.attr("y"))
  //text.attr("transform", `matrix(1, 0, 0, 1, ${x + dx}, ${y + dy})`)text.attr("transform", `matrix(1, 0, 0, 1, ${x + dx}, ${y + dy})`)
  text.attr('transform', `translate(${x + dx}, ${y + dy})`)
  text.attr('x', 0)
  text.attr('y', 0)
}
