/**
 * Get English Heritage properties from their API.
 * This can only be done server-side as they have a restrictive
 * Access-Control-Allow-Origin header.
 */
var express = require('express');
var router = express.Router();
const request = require('request');

const ehPropertyUrl = 'http://www.english-heritage.org.uk/ehAjax/NM_Ajax/GetDataForMap.ashx?category=Property';

/* GET users listing. */
router.get('/', function(req, res, next) {
  request(ehPropertyUrl, (error, resp, body) => {
    let data = JSON.parse(body);
    // Extract only property data.
    let allProperties = {};

    Object.entries(data.Region).forEach(([region, regionData]) => {
      Object.entries(regionData).forEach(([county, countyData]) => {
        countyData.properties.map(property => {
          allProperties[property.id] = property;
        });
      });
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(allProperties, null, 2));
  });
});

module.exports = router;

