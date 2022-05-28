// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

GeoTagExamples = require('../models/geotag-examples');
GeoTag = require('../models/geotag');

class InMemoryGeoTagStore {

    storage = [];
    rad = 10;


    constructor() {
        this.loadEntries();
    }

    removeGeoTag(tag) {
        this.tags.splice(this.tags.find(entry => entry.latitude === tag.latitude
            & entry.longitude === tag.longitude
            & entry.name === tag.name
            & entry. hashtag === tag.hashtag), 1);
    }

    addGeoTag(tag) {
        this.tags.push(tag);
    }

    getNearbyGeoTags(entry_tag) {
        let entries = [];

        this.tags.find((tag) => {
            let longitude_difference = tag.longitude - entry_tag.longitude;
            let latitude_difference = tag.latitude - entry_tag.latitude;
            if(Math.sqrt(Math.pow(longitude_difference, 2) + Math.pow(latitude_difference, 2)) <= this.rad) entries.push(tag);
        })

        return entries;
    }

    searchNearbyGeoTags(entry_tag) {
        let entries = []
        entries = this.getNearbyGeoTags(entry_tag).find(tag => tag.name === entry_tag.name)
        return entries;
    }

    loadEntries() {
        GeoTagExamples.tagList.forEach((tagList) => {
            this.storage.push(new GeoTag(tagList[0], tagList[1], tagList[2], tagList[3]))
        })
        this.tags = GeoTagExamples.tagList;
    }
}

module.exports = InMemoryGeoTagStore
