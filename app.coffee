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
    name = artwork.series || 'Artworks'
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
          all: ['/assets/style_embed.styl']
  nap.package()
  js = fs.readFileSync('./public/assets/all.js')
  css = fs.readFileSync('./public/assets/all.css')
  html = jade.compile(fs.readFileSync './assets/template.jade')
    collections: collections
    js: js
    css: css
  
# Start a server that just serves up static assets and the compiled html
app = connect().use(nap.middleware).use(connect.static("public")).use((req, res) ->
  init()
  res.writeHead 200, "Content-Type": "text/HTML"
  res.end html
).listen(3000)