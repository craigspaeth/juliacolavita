let express = require("express");
let http = require("http");
let path = require("path");
let app = express();
let _ = require('underscore');
let fs = require('fs');
let babelify = require('babelify');
let PORT = process.env.PORT || 3000;

// Map artworks into their series
let artworks = JSON.parse(fs.readFileSync('./assets/artworks.json'));
let collections = {};
for (let i = 0, artwork; i < artworks.length; i++) {
  artwork = artworks[i];
  if (!((artwork.category != null) && artwork.category !== '')) { continue; }
  let name = artwork.category;
  if (!(collections[name] != null)) { collections[name] = []; }
  collections[name].push(artwork);
}

// Config
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));
app.locals._ = _;

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
app.get("*", (req, res) => res.render('index', { collections: collections }));

// Init
app.listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});