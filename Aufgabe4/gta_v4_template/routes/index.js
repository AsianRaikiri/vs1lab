// File origin: VS1LAB A3, A4

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

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const {json} = require("express");
const {stringify} = require("nodemon/lib/utils");
const GeoTagStore = require('../models/geotag-store');

let store = new GeoTagStore();


// App routes (A3)

router.get('/', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  res.render('index', { taglist: [], tagsjson: '', lat: 0, long: 0});
});

router.post('/discovery', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  let entries = (store.searchNearbyGeoTags(new GeoTag(body.discovery_field_name, body.discovery_hidden_latitude, body.discovery_hidden_longitude, '')));
  res.render('index', {taglist: entries, tagsjson: JSON.stringify(entries), lat: body.latitude_field_name, long: body.longitude_field_name});
});

router.post('/tagging', (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  store.addGeoTag(new GeoTag(body.name_field_name,  body.latitude_field_name, body.longitude_field_name,  body.hashtag_field_name));
  res.render('index', {taglist: [], tagsjson: '', lat: body.latitude_field_name, long: body.longitude_field_name});
});

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

// API routes (A4)
/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  let longtitudeQuery = req.query.longitude;
  let latitudeQuery = req.query.latitude;
  let searchTermQuery = req.query.searchterm;

  let filtered = store.filterForSearchTerm(searchTermQuery);

  if(longtitudeQuery != null && latitudeQuery != null) {
    filtered = store.filterNearbyGeoTags(new GeoTag('', latitudeQuery,longtitudeQuery))
  }

  res.status(200).json(filtered);
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req, res) => {
  let name = req.body.name;
  let long = parseFloat(req.body.longitude);
  let lat = parseFloat(req.body.latitude);
  let hashtag = req.body.hashtag;

  let newEntry = new GeoTag(name, lat, long, hashtag);

  let id = store.addGeoTag(newEntry);

  res.append('URL', "api/geotags/" + id);

  res.status(201).json(store.getAll);
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  let id = req.params.id;

  let foundGeoTags = store.searchGeoTagById(id);
  console.log(foundGeoTags);

  res.status(200).json(foundGeoTags);
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', (req, res) => {
  let id = parseInt(req.params.id);

  let name = req.body.name;
  let long = parseFloat(req.body.longitude);
  let lat = parseFloat(req.body.latitude);
  let hashtag = req.body.hashtag;

  store.updateGeoTagbyID(id, new GeoTag(name, lat, long, hashtag));

  res.status(202).json(store.searchGeoTagById(id));
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let deleted = store.searchGeoTagById(id);
  store.removeGeoTag(id);

  res.status(202).json(deleted);
});

module.exports = router;
