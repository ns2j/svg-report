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
## SvgRecipe(json) format
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
## opt properies
```
 "align"  specify text align.
     'one line text' can hold one character in "sme" (means start, middle, end).
     'Multiple line text'(text area) can hold one character in "TMB" (means Top, Middle, Bottom)
 "width"  specify text width.
 "height" specify text area height.
 "fontSize" specify font size.
 ```
