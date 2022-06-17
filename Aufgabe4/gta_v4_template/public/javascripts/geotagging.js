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
    validateDiscorveryForm(discoveryForm.discovery_field_name.value);
});

function validateTaggingForm(name, hash){
    if(name.length <= 10 && /^#[A-Za-z]{1,10}$/.test(hash)){
        updateLocation();
    }
    return false;
}

function validateDiscorveryForm(name){
    if(name.length <=10){
        updateLocation();
    }
    return false;
}

