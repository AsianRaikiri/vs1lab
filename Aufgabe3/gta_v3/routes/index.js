// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();
let app = express();
let entries = [];

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 *
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 *
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const {json} = require("express");
const {stringify} = require("nodemon/lib/utils");


let store = new GeoTagStore();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */
router.get('/', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  res.render('index', { taglist: [], tagsjson: '', lat: 0, long: 0});
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  store.addGeoTag(new GeoTag(body.name_field_name,  body.latitude_field_name, body.longitude_field_name,  body.hashtag_field_name));
  res.render('index', {taglist: [], tagsjson: '', lat: body.latitude_field_name, long: body.longitude_field_name});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  let entries = (store.searchNearbyGeoTags(new GeoTag(body.discovery_field_name, body.discovery_hidden_latitude, body.discovery_hidden_longitude, '')));
  res.render('index', {taglist: entries, tagsjson: JSON.stringify(entries), lat: body.latitude_field_name, long: body.longitude_field_name});
});

module.exports = router;
