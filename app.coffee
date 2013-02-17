http = require 'http'
fs = require 'fs'
jade = require 'jade'
stylus = require 'stylus'
coffee = require 'coffee-script'
nap = require 'nap'
_ = require 'underscore'
connect = require 'connect'

html = null

init = ->

  # Map artworks into their series
  artworks = JSON.parse fs.readFileSync('./assets/artworks.json')
  collections = {}
  for artwork in artworks
    continue unless artwork.category? and artwork.category isnt ''
    name = artwork.category
    collections[name] ?= []
    collections[name].push artwork
  
  # Package assets and compile them all into one jade template
  nap
    mode: 'production'
    embedFonts: true
    assets:
        js:
          all: ['/assets/main.coffee']
        css:
          all: ['/assets/main_embed.styl']
  nap.package()
  for file in fs.readdirSync('./public/assets/')
    js = fs.readFileSync('./public/assets/' + file) if file.match /\.js$/
    css = fs.readFileSync('./public/assets/' + file) if file.match /\.css$/
  html = jade.compile(fs.readFileSync './assets/main.jade')
    collections: collections
    js: js
    css: css
  
# Start a server that just serves up static assets and the compiled html
init()
port = if process.env.NODE_ENV is 'production' then 80 else 4000
app = connect().use(connect.static("public")).use((req, res) ->
  res.writeHead 200, "Content-Type": "text/HTML"
  res.end html
).listen(port)
console.log "NODE_ENV is #{process.env.NODE_ENV}, listening on #{port}"