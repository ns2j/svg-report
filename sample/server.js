const path = require('path')
const express = require('express')
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(path.join(DIST_DIR, 'static')))
app.use(express.static(path.join(DIST_DIR, '../dist')))

const svgrecipeRouter = require('./svgrecipe')
app.use('/svgrecipe', svgrecipeRouter) 

app.get('/json', (req, res) => {
    res.json({"abc": "def"})
})
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
