const express = require("express")
const http = require("http")
const path = require("path")
const app = express()
const _ = require('lodash')
const fs = require('fs')
const babelify = require('babelify')
const request = require('superagent')
const MongoClient = require('mongodb').MongoClient

const { ACCESS_TOKEN, API_URL, PORT, MONGODB_URI } = process.env
let works

const connect = () => {
  if (works) return Promise.resolve()
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGODB_URI, (err, db) => {
      if (err) return reject(err)
      works = db.collection('works')
      resolve()
    })
  })
}

const fetch = async (endpoint) => {
  const req = await request
    .get(`${API_URL}/api/v1${endpoint}`)
    .set('X-Access-Token', ACCESS_TOKEN)
    .query({ size: 100 })
  return req.body
}

const downloadWorks = async () => {
  const worksData = {}
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
    worksData[show.name.toLowerCase().trim()] = data
  })
  const artworks = await fetch('/partner/direct-julia/artworks')
  worksData.slides = artworks.filter((a) => a.artist.id === 'julia-colavita')
  await works.remove()
  await works.save(worksData)
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
  await connect()
  const collections = await works.findOne()
  res.render('index', { collections })
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
