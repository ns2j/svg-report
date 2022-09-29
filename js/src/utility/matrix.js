export default (transformAttr, x, y) => {
  let mx = 0
  let my = 0
  let match = transformAttr.match(/matrix\(.*,(.*),(.*)\)/)
  if (match) {
    mx = parseFloat(match[1])
    my = parseFloat(match[2])
  }    
    
  const mmppx = 0.26458333 //mm per px (inkscape use 96dpi)
  return `matrix(${mmppx}, 0, 0, ${mmppx}, ${mx + x * mmppx}, ${my + y * mmppx})`
}