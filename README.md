# svg-report
Original idea is [svg-paper](https://github.com/ttskch/svg-paper).   
This is javascript library merging value to svg template file.   
it can be same web browser's looks and printing looks.   
Svg template file should be created by inkscape.   

## build   
```
npm install   
npm run build:prod   
```
## build sample    
```
cd sample   
npm install   
```
## run sample   
```
npm start   
access http://localhost:8080/ by browser   
```
##SvgRecipe(json) format
```
[   
{"svgUrl": "someSvgTemplateFile.svg",
 "holderMap": {
   "%somePlaceHolder%": {
     "value": "someValue",
     "opt": {
        "align": "M",
        "width": 30
     }
   },
   "%otherPlaceHolder%": {
     "value": ""
   },
       :
       :
}.
{"svgUrl" "otherSvgTemplateFile.svg",
  "hoderMap": {
    "%somePlaceHolder2%: {
       "value": ""
     }
        :
 }
 ]
 ```
