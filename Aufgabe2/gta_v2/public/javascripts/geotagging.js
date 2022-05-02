// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...

/**
 * A class to help using the HTML5 Geolocation API.
 */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper();
            helper.#latitude = location.coords.latitude.toFixed(5);
            helper.#longitude = location.coords.longitude.toFixed(5);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
            alert(error.message)
        });
    }
}

/**
 * A class to help using the MapQuest map service.
 */
class MapManager {
    #apiKey = '';

    /**
     * Create a new MapManager instance.
     * @param {string} apiKey Your MapQuest API Key
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * Generate a MapQuest image URL for the specified parameters.
     * @param {number} latitude The map center latitude
     * @param {number} longitude The map center longitude
     * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
     * @param {number} zoom The map zoom, defaults to 10
     * @returns {string} URL of generated map
     */
    getMapUrl(latitude, longitude, tags = [], zoom = 10) {
        if (this.#apiKey === '') {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        let tagList = `You,${latitude},${longitude}`;
        tagList += tags.reduce((acc, tag) => `${acc}|${tag.name},${tag.latitude},${tag.longitude}`, "");

        const mapQuestUrl = `https://www.mapquestapi.com/staticmap/v4/getmap?key=${this.#apiKey}&size=600,400&zoom=${zoom}&center=${latitude},${longitude}&pois=${tagList}`;
        console.log("Generated MapQuest URL:", mapQuestUrl);

        return mapQuestUrl;
    }
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {

    /* Input Field Variables */
    let disc_hidden_long = document.getElementById("discovery_hidden_longitude");
    let disc_hidden_lat = document.getElementById("discovery_hidden_latitude");
    /* Hidden Input Field Variables */
    let tag_long = document.getElementById("long");
    let tag_lat = document.getElementById("lat");
    /* Map View Image Element */
    let image_view = document.getElementById("mapView");

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

        /* Map Image update */
        let manager = new MapManager('f64689zc2fhvhu0miIiVlLaUAchTYDWv');
        let mapUrl = manager.getMapUrl(disc_hidden_lat.value, disc_hidden_long.value,[], 15);
        image_view.src = mapUrl;
    });
    /* Zugriff auf src von <img src=""> mit image_view.src = ... */
    /* Zugriff auf die long und lat für die MAP über disc_hidden_lat.value. Analog beim anderen auch*/
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});