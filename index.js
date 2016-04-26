let express = require("express")
let http = require("http")
let path = require("path")
let app = express()
let _ = require('underscore')
let fs = require('fs')
let babelify = require('babelify')
let PORT = process.env.PORT || 3000

// Map artworks into their series
let collections = {}
const loadArtworks = (callback) => {
  fs.readFile('./assets/artworks.json', (err, works) => {
    if (err) return callback(err)
    JSON.parse(works).forEach((artwork) => {
      if (!((artwork.category != null) && artwork.category !== '')) return
      let name = artwork.category
      if (!(collections[name] != null)) collections[name] = []
      collections[name].push(_.pick(artwork,
        'created_at','images','images','images','id','title','date','medium',
        'height','width','metric'
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
let home = (req, res) => res.render('index', { collections: collections })
app.get("/", home)
app.get("/artwork/:id", home)
app.use(express.static(path.join(__dirname, "public")))

// Init
app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT)
  loadArtworks(() => console.log('Loaded works'))
})