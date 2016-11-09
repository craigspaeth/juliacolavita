const express = require("express")
const http = require("http")
const path = require("path")
const app = express()
const _ = require('lodash')
const fs = require('fs')
const babelify = require('babelify')
const request = require('superagent')

const { ACCESS_TOKEN, API_URL, PORT } = process.env

// Map artworks into their series
const collections = {}

const fetch = async (endpoint) => {
  const req = await request
    .get(`${API_URL}/api/v1${endpoint}`)
    .set('X-Access-Token', ACCESS_TOKEN)
    .query({ size: 100 })
  return req.body
}

const loadArtworks = async () => {
  const shows = await fetch('/partner/julia-colavita/shows')
  const artworkGroups = await Promise.all(shows.map((show) =>
    fetch(`/partner/julia-colavita/show/${show.id}/artworks`)))
  shows.forEach((show, i) => {
    collections[show.name.toLowerCase().trim()] = artworkGroups[i].map((a) => _.pick(a,
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
  const artworks = await fetch('/partner/direct-julia/artworks')
  collections.slides = artworks.filter((a) => a.artist.id === 'julia-colavita')
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
const home = (req, res) => res.render('index', { collections })
app.get("/", home)
app.get("/artwork/:id", home)
app.use(express.static(path.join(__dirname, "public")))

// Init
app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT)
  loadArtworks().then(() => console.log('Loaded works'))
})
