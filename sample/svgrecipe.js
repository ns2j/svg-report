const express = require('express');
const router = express.Router();

const items = [
  {
    "name": "商品1",
    "price": "2,000",
    "quantity": "1",
    "amount": "2,000",
    "comment": "あああ"          
  },
  {
    "name": "商品2ああああああああ",
    "price": "13,000",
    "quantity": "2",  
    "amount": "26,000",
    "comment": "あああああああああ\nあああああああああああああ"          
  },
  {
    "name": "商品3",
    "price": "100,000,000,000,000,000",
    "quantity": "1",  
    "amount": "100,000,000,000,000,000",
    "comment": "長い商品の説明長い商品の説明長い商品の説明長い商品の説明長い商品の説明長い商品の説明長い商品の説明長い商品の説明"          
  }
]


router.get('/', (req, res) => {
  const reci0 = {};
  reci0['svgUrl'] = "templ1.svg"
  reci0['holderMap'] = {}
  const map = reci0['holderMap']
  
  for (const i in items) {
    const item = items[i]
    const row = parseInt(i) + 1
    map[`%n${row}%`] = { "value": `${100 ** i}`, "opt": {"align": "m", "width": 8}}
    map[`%i${row}%`] = { "value": item.name, "opt": {"align": "M"}}
    map[`%up${row}%`] = { "value": item.price, "opt": {"align": "e"}}
    map[`%u${row}%`] = { "value": "個", "opt": {"align": "m"}}
    map[`%q${row}%`] = { "value": item.quantity, "opt": {"align": "e"}}
    map[`%a${row}%`] = { "value": item.amount, "opt": {"align": "e"}}
    map[`%d${row}%`] = { "value": item.comment, "opt": {"align": "T", "fontSize": 18}}
  }

  let row = 4
  map[`%n${row}%`] = {"value": ""}
  map[`%i${row}%`] = {"value": "値引き", "opt": {"align": "M"}}
  map[`%u${row}%`] = { "value": ""}
  map[`%up${row}%`] = { "value": ""}
  map[`%q${row}%`] = { "value": ""}
  map[`%a${row}%`] = { "value": "-100,000,000,000,000,000", "opt": {"align": "e"}}
  map[`%d${row}%`] = { "value": ""}

  row = 7
  map[`%n${row}%`] = {"value": "計", "opt": {"align": "m"}} 
  map[`%i${row}%`] = { "value": ""}
  map[`%up${row}%`] = { "value": ""}
  map[`%u${row}%`] = { "value": ""}
  map[`%q${row}%`] = { "value": ""}
  map[`%a${row}%`] = { "value": "27,000", "opt": {"align": "e", "fontSize": 14}}
  map[`%d${row}%`] = { "value": ""}

  for (let i = items.length; i < 7 - 2; i ++) {
    const row = parseInt(i) + items.length - 1 
    map[`%n${row}%`] = { "value": `${row}`, "opt": {"align": "m"}}
    map[`%i${row}%`] = { "value": ""}
    map[`%up${row}%`] = { "value": ""}
    map[`%u${row}%`] = { "value": ""}
    map[`%q${row}%`] = { "value": ""}
    map[`%a${row}%`] = { "value": ""}
    map[`%d${row}%`] = { "value": ""}
  }


  //page 2  
  const reci1 =
 {
  "svgUrl": "templ2.svg",
  "holderMap": {
    "%no1%": { "value": "1" },
    "%name1%": { "value": "商品a12"},
    "%price1%": { "value": "1,000", "opt": {"align": "e"}},
    "%comment1%": { "value": "some\n comment", "opt": {"align": "T"}}, 
    "%no2%": { "value": "2" },
    "%name2%": { "value": "商品a11aaaaaaa", "opt": {"width": 15}},
    "%no3%": { "value": "3" },
    "%name3%": { "value": "商品a21"}
  }
 }

  res.json([reci0, reci1])
})

module.exports = router;

