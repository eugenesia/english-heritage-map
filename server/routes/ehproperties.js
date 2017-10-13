/**
 * Get English Heritage properties from their API.
 * This can only be done server-side as they have a restrictive
 * Access-Control-Allow-Origin header.
 */
const express = require('express');
const router = express.Router();
const request = require('request');

const ehPropertyApiUrl =
  'http://www.english-heritage.org.uk/ehAjax/NM_Ajax/GetDataForMap.ashx?'
  + 'category=Property';

const ehBaseUrl = 'http://www.english-heritage.org.uk';

router.get('/', function(req, res, next) {
  request(ehPropertyApiUrl, (error, resp, body) => {

    // List of attraction objects in a standardised format.
    let attractions = {};

    let data = JSON.parse(body);

    Object.entries(data.Region).forEach(([region, regionData]) => {
      Object.entries(regionData).forEach(([county, countyData]) => {
        countyData.properties.map(property => {

          let attract = {
            id: property.id,
            name: property.t,
            lat: parseFloat(property.lt),
            lng: parseFloat(property.lg),
            address: property.add,
            description: property.s,
            region: property.r,
            county: property.c,
            link: ehBaseUrl + property.p,
            image: ehBaseUrl + property.tui,
            // Whether free entry for everyone (regardless of EH membership).
            freeEntry: property.fe === 'yes' ? true : false,
            // Whether it's one of the most popular attractions.
            popular: property.tp === 'yes' ? true : false,
            categories: property.ia,
            facilities: property.kf,
            discount: null,
            telephone: null,
            // Whether it belongs to English Heritage, or is an Associated
            // Attraction.
            ownership: 'ehProperty',
          };

          attractions[property.id] = attract;
        });
      });
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(attractions, null, 2));
  });
});

module.exports = router;

