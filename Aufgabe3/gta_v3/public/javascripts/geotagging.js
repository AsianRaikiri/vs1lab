// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

LocationHelper = require('../javascripts/location-helper');
MapManager = require('../javascripts/map-manager');

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    /* Input Field Variables */
    let l = new LocationHelper();

    let disc_hidden_long = document.getElementById("discovery_hidden_longitude");
    let disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
    /* Hidden Input Field Variables */
    let tag_long = document.getElementById("long");
    let tag_lat = document.getElementById("lat");
    /* Map View Image Element */
    let image_view = document.getElementById("mapView");

    l.findLocation((helper) => {

        /* Constant lat and long */
        const latitude = helper.latitude;
        const longitude = helper.longitude;

        /* Readonly Input change */
        tag_lat.value = latitude;
        tag_long.value = longitude;

        /* Hidden Input change */
        disc_hidden_lat.value = latitude;
        disc_hidden_long.value = longitude;

        /* Map Image update */
        let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');
        let mapUrl = manager.getMapUrl(disc_hidden_lat.value, disc_hidden_long.value,[], getZoom());
        image_view.src = mapUrl;
    });
    /* Zugriff auf src von <img src=""> mit image_view.src = ... */
    /* Zugriff auf die long und lat für die MAP über disc_hidden_lat.value. Analog beim anderen auch*/
}

function getLocation() {

    let ret = [];
    LocationHelper.findLocation((helper) => {

        /* Constant lat and long */
        const latitude = helper.latitude;
        const longitude = helper.longitude;

        ret.push(latitude, longitude);

        /* Map Image update */
        let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');
    });
    return ret;
}

// Wait for the page to fully load its DOM content, then call updateLocation


function getZoom() {
    let zoomSlider = document.getElementById("zoomSlider_input");
    return zoomSlider.value;
}