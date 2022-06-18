import { LocationHelper } from './location-helper.js';
import { MapManager } from './map-manager.js';
// File origin: VS1LAB A2

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */

export function updateLocation() {

    /* Input Field Variables */
    let disc_hidden_long = document.getElementById("discovery_hidden_longitude");

    let disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
    /* Hidden Input Field Variables */
    let tag_long = document.getElementById("long");
    let tag_lat = document.getElementById("lat");
    /* Map View Image Element */
    let image_view = document.getElementById("mapView");

    if (document.getElementById("discovery_hidden_longitude").value === '' || document.getElementById("discovery_hidden_latitude").value === '') {
        LocationHelper.findLocation((helper) => {

            /* Constant lat and long */
            const latitude = helper.latitude;
            const longitude = helper.longitude;

            /* Readonly Input change */
            tag_lat.value = latitude;
            tag_long.value = longitude;

            /* Hidden Input change */
            disc_hidden_lat.value = latitude;
            disc_hidden_long.value = longitude;
        });
    }

    let dataTags = image_view.getAttribute('data-tags');
    let tags = [];
    if(dataTags.length > 0) {
        tags = JSON.parse(dataTags);
    }

    fetch("/api/geotags/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
    let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');
    
    setTimeout(function () {
        image_view.src = manager.getMapUrl(disc_hidden_lat.value, disc_hidden_long.value, tags, getZoom());
    }, 1000);

    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    updateLocation();
});

document.getElementById("zoomSlider_input").addEventListener('change', () => {
    updateLocation();
});

document.getElementById("button_refresh").addEventListener('click', () => {
    updateLocation();
});

function getZoom() {
    let zoomSlider = document.getElementById("zoomSlider_input");
    return zoomSlider.value;
}

const taggingForm = document.getElementById("tag-form");
taggingForm.addEventListener('submit', () => {
    validateTaggingForm(taggingForm.name_field_name.value, taggingForm.hashtag_field_name.value);
});

const discoveryForm = document.getElementById("discoveryFilterForm");
discoveryForm.addEventListener('submit', () => {
    validateDiscoveryForm(discoveryForm.discovery_field_name.value);
});

function validateTaggingForm(name, hash){
    if(name.length <= 10 && /^#[A-Za-z]{1,10}$/.test(hash)){
        postTagging();
    }
    return false;
}

function validateDiscoveryForm(name){
    if(name.length <=10){
        getDiscovery();
    }
    return false;
}

function getDiscovery(){
    let disc_hidden_long = document.getElementById("discovery_hidden_longitude");
    let disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
    let disc_name = document.getElementById("disc_name");

    let ReqBody = {
        longtitude: disc_hidden_long,
        latitude: disc_hidden_lat,
        searchterm: disc_name
    }
    fetch("/api/geotags/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        query: JSON.stringify(ReqBody)
    })
}

function postTagging(){
    let tag_long = document.getElementById("long");
    let tag_lat = document.getElementById("lat");
    let tag_name = document.getElementById("name");
    let tag_hash = document.getElementById("hash");

    let reqBody = {
        name: tag_name,
        longtitude: tag_long,
        latitdude: tag_lat,
        hashtag: tag_hash,
    }

    fetch("/api/geotags/", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
            "Content-Type": "application/json"
        }
    })
}