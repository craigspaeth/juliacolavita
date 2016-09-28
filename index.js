const express = require("express")
const http = require("http")
const path = require("path")
const app = express()
const _ = require('underscore')
const fs = require('fs')
const babelify = require('babelify')
const PORT = process.env.PORT || 3000

// Map artworks into their series
const collections = {}
const loadArtworks = (callback) => {
  fs.readFile('./artworks.json', (err, works) => {
    if (err) return callback(err)
    JSON.parse(works).forEach((artwork) => {
      if (!((artwork.category != null) && artwork.category !== '')) return
      const name = artwork.category
      if (!(collections[name] != null)) collections[name] = []
      collections[name].push(_.pick(artwork,
        'created_at',
        'images',
        'id',
        'title',
        'date',
        'medium',
        'height',
        'width',
        'metric'
      ))
    })
    callback()
  })
}

// Config
app.set("views", __dirname + "/views")
app.set("view engine", "jade")
app.locals._ = _

// Compile middleware
app.use(require("stylus").middleware({
  src: __dirname + "/assets",
  dest: __dirname + "/public"
}))
app.use(require("browserify-dev-middleware")({
  src: __dirname + "/assets",
  transforms: [babelify],
  insertGlobals: true
}))

// Routes
const home = (req, res) => res.render('index', { collections: collections })
app.get("/", home)
app.get("/artwork/:id", home)
app.use(express.static(path.join(__dirname, "public")))

// Init
app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT)
  loadArtworks(() => console.log('Loaded works'))
})
