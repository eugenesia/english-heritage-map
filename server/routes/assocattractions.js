/**
 * Get English Heritage Associated Attractions from their API.
 * This can only be done server-side as they have a restrictive
 * Access-Control-Allow-Origin header.
 */
var express = require('express');
var router = express.Router();
const request = require('request');

const assocAttractBaseUrl = 'http://www.english-heritage.org.uk/ehAjax/NM_Ajax/GetDataForMap.ashx?category=MapGroup&itemid='
const itemIds = {
  southeast: 3196439,
  southwest: 3195805,
  east: 3196605,
  eastmidlands: 3196654,
  westmidlands: 3196719,
  yorkshire: 3196806,
  north: 3196857,
}

// TODO: Merge all the attractions into one large list, and return it.

/* GET users listing. */
router.get('/', function(req, res, next) {

  // Accumulate all requests then continue when all finished.
  // See https://stackoverflow.com/questions/10004112/how-can-i-wait-for-set-of-asynchronous-callback-functions
  let requestPromises = [];

  for (let region in itemIds) {
    let itemId = itemIds[region];
    let url = assocAttractBaseUrl + itemId;
    requestPromises.push(
      new Promise((resolve, reject) => {
        request(url, (error, resp, body) => {
          if (error) {
            console.log('rejected');
            return reject(error);
          }
          resolve(JSON.parse(body));
        });
      })
    );
  }

  // Consolidate all properties.
  let allProperties = {};
  Promise.all(requestPromises).then((regionsData) => {
    regionsData.map(regionData => {
      Object.entries(regionData.Region).forEach(([region, regData]) => {
        Object.entries(regData).forEach(([county, countyData]) => {
          countyData.properties.map(property => {
            // Make sure no properties are repeated, by setting the ID as key.
            allProperties[property.id] = property;
          });
        });
      });
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(allProperties, null, 2));
  })
});

module.exports = router;

