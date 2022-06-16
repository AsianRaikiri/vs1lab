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

const Console = require("console");
GeoTagExamples = require('../models/geotag-examples');
GeoTag = require('../models/geotag');

class InMemoryGeoTagStore {

    #storage = [];
    rad = 0.1;


    constructor() {
        this.loadEntries();
    }

    removeGeoTag(id) {
        let diff = [];
        this.#storage.forEach((value, index, array) => {
            if(value.id !== id) {
                diff.push(value);
            }
        });
        this.#storage = diff;
    }

    /**
     *
     * @param tag Wants an GeoTag obj Param
     * @param id
     * @returns {number} Returns ID if necessary
     */
    addGeoTag(tag, id = this.getNewId) {
        const obj = {
            id: id,
            name: tag.name,
            latitude: tag.latitude,
            longitude: tag.longitude,
            hashtag: tag.hashtag
        }
        this.#storage.push(obj);
        return obj.id;
    }

    /**
     * Creates new unique ID
     * @returns {number}
     */
    get getNewId() {
        let id = 0;
        this.#storage.forEach((value, index, array) => {
            if((this.#storage[index + 1] == null && value.id != null)) {
                id = value.id + 1;
            }
        });
        return id;
    }

    searchGeoTagById(id) {
        return this.#storage.find(value => parseInt(value.id) === parseInt(id));
    }

    searchNearbyGeoTags(entry_tag) {
        return this.filterForSearchTerm(entry_tag.name, this.filterNearbyGeoTags(entry_tag, this.#storage));
    }

    updateGeoTagbyID(id, tag) {
        this.removeGeoTag(id);
        this.addGeoTag(tag, id);
    }

    /**
     *
     * @param reference_tag Reference Location for Searching nearby Tags
     * @param toFilter Array of tags to filter through; if toFilter is undefined, #storage is used
     * @returns {entries[]} Returns entries of toFilter near to reference_tag
     */
    filterNearbyGeoTags(reference_tag, toFilter = this.#storage) {

        let entries = [];
        toFilter.forEach((value, index, array) => {
            let longitude_difference = value.longitude - reference_tag.longitude;
            let latitude_difference = value.latitude - reference_tag.latitude;
            if(Math.sqrt(Math.pow(longitude_difference, 2) + Math.pow(latitude_difference, 2)) <= this.rad) {
                entries.push(value);
            }
        });
        return entries;
    }


    filterForSearchTerm(term, toFilter = this.#storage) {

        let entries = [];
        if(term === undefined || term.length === 0) {
            return toFilter;
        }
        toFilter.forEach((value) => {
            if(value.name === term || value.name.includes(term) || value.hashtag.includes(term)){

                entries.push(value);
            }
        });
        return entries;
    }

    get getAll() {
        return this.#storage;
    }

    loadEntries() {
        GeoTagExamples.tagList.forEach((tagList) => {
            let tag = new GeoTag(tagList[0], tagList[1], tagList[2], tagList[3])
            this.addGeoTag(tag);
        });
    }
}

module.exports = InMemoryGeoTagStore
