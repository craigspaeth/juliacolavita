const express = require("express")
const http = require("http")
const path = require("path")
const app = express()
const _ = require('lodash')
const fs = require('fs')
const babelify = require('babelify')
const request = require('superagent')
const mongojs = require('promised-mongo')

const { ACCESS_TOKEN, API_URL, PORT, MONGODB_URI } = process.env
const db = mongojs(MONGODB_URI, ['works'])

const fetch = async (endpoint) => {
  const req = await request
    .get(`${API_URL}/api/v1${endpoint}`)
    .set('X-Access-Token', ACCESS_TOKEN)
    .query({ size: 100 })
  return req.body
}

const downloadWorks = async () => {
  const works = {}
  const shows = await fetch('/partner/julia-colavita/shows')
  const artworkGroups = await Promise.all(shows.map((show) =>
    fetch(`/partner/julia-colavita/show/${show.id}/artworks`)))
  shows.forEach((show, i) => {
    const data = artworkGroups[i].map((a) => _.pick(a,
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
    works[show.name.toLowerCase().trim()] = data
  })
  const artworks = await fetch('/partner/direct-julia/artworks')
  works.slides = artworks.filter((a) => a.artist.id === 'julia-colavita')
  await db.works.drop()
  await db.works.save(works)
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
const home = async (req, res) => {
  const works = await db.works.findOne()
  res.render('index', { collections: works })
  try { await downloadWorks() }
  catch (e) { console.log(e) }
}
app.get("/", home)
app.get("/artwork/:id", home)
app.use(express.static(path.join(__dirname, "public")))

// Init
app.listen(PORT, async () => {
  console.log("Express server listening on port " + PORT)
})
