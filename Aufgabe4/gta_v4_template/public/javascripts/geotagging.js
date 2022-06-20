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

const paging = true;

export async function updateLocation(tags) {
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
    let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');
    setTimeout(function () {
        image_view.src = manager.getMapUrl(disc_hidden_lat.value, disc_hidden_long.value, tags, getZoom());
    }, 1000);
    return true;
}

function updateGeoTags(tags) {
    let list = "";
    for (let tag of tags) {
        list += "<li> " + tag.name + " ( " + tag.latitude + "," + tag.longitude + " ) " + tag.hashtag + "</li>"
    }
    document.getElementById("discoveryResults").innerHTML = list;
    return tags;
}

document.addEventListener('DOMContentLoaded', () => {
    let query;
    updateLocation().then(function (value) {
        query = {
            longitude: document.getElementById("discovery_hidden_longitude").value,
            latitude: document.getElementById("discovery_hidden_latitude").value,
            searchterm: document.getElementById("disc_name").value
        }
        getGeoTagsByPage(query, 1).then(updateGeoTags).then(updateLocation);
    });
});

document.getElementById("zoomSlider_input").addEventListener('change', () => {
    updateLocation().then(function (evt){
        let query = {
            longitude: document.getElementById("discovery_hidden_longitude").value,
            latitude: document.getElementById("discovery_hidden_latitude").value,
            searchterm: document.getElementById("disc_name").value
        }
        getGeoTagsByPage(query, 1).then(updateGeoTags).then(updateLocation);
    });
});

document.getElementById("button_refresh").addEventListener('click', () => {
    updateLocation().then(function (evt){
        let query = {
            longitude: document.getElementById("discovery_hidden_longitude").value,
            latitude: document.getElementById("discovery_hidden_latitude").value,
            searchterm: document.getElementById("disc_name").value
        }
        getGeoTagsByPage(query, 1).then(updateGeoTags).then(updateLocation);
    });
});

document.getElementById("next_page").addEventListener('click', function (evt) {
    evt.preventDefault();
    let query = {
        longitude: document.getElementById("discovery_hidden_longitude").value,
        latitude: document.getElementById("discovery_hidden_latitude").value,
        searchterm: document.getElementById("disc_name").value
    }
    let page = parseInt(document.getElementById("page").value);

    getGeoTagsByPage(query, page+1).then(function (value) {
        if(value.length === 0) {
            console.log(query, page);
            return getGeoTagsByPage(query, page);
        }else {
            document.getElementById("page").value = page+1;
            return value;
        }
    }).then(updateGeoTags);
});

document.getElementById("prev_page").addEventListener('click', function (evt) {
    evt.preventDefault();
    let query = {
        longitude: document.getElementById("discovery_hidden_longitude").value,
        latitude: document.getElementById("discovery_hidden_latitude").value,
        searchterm: document.getElementById("disc_name").value
    }
    let page = parseInt(document.getElementById("page").value);
    console.log("Page: " + page)
    getGeoTagsByPage(query, page-1).then(function (value) {
        if(page-1 === 0) {
            return getGeoTagsByPage(query, 1);
        }
        document.getElementById("page").value = page-1;
        return value;
    }).then(updateGeoTags).then(updateLocation);
});

function getZoom() {
    let zoomSlider = document.getElementById("zoomSlider_input");
    return zoomSlider.value;
}

document.getElementById("discoveryFilterForm").addEventListener('submit', function (evt) {
    evt.preventDefault();
    let query = {
        longitude: document.getElementById("discovery_hidden_longitude").value,
        latitude: document.getElementById("discovery_hidden_latitude").value,
        searchterm: document.getElementById("disc_name").value
    }

    console.log(query);

    if(paging) getGeoTagsByPage(query, 1).then(updateList).then(updateGeoTags);
    else getGeoTags(query).then(updateList).then(updateGeoTags);
});

document.getElementById("tag-form").addEventListener("submit", function (evt) {
    evt.preventDefault();

    let geotag = {
        name: document.getElementById("name").value,
        latitude: document.getElementById("lat").value,
        longitude: document.getElementById("long").value,
        hashtag: document.getElementById("hash").value
    }

    postGeoTag(geotag).then(updateLocation);
});

async function postGeoTag(geotag) {
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotag),
    });
    return await response.json();
}

async function getGeoTags(query) {
    let response = await fetch("http://localhost:3000/api/geotags?latitude=" + query.latitude + "&longitude=" + query.longitude + "&searchterm=" + query.searchterm);
    return await response.json();
}

async function getGeoTagsByPage(query, page) {
    let response = await fetch("http://localhost:3000/api/geotags/page/" + page + "/?latitude=" + query.latitude + "&longitude=" + query.longitude + "&searchterm=" + query.searchterm);
    return await response.json();
}