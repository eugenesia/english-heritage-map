/**
 * Get English Heritage Associated Attractions from their API.
 * This can only be done server-side as they have a restrictive
 * Access-Control-Allow-Origin header.
 */
const express = require('express');
const router = express.Router();
const request = require('request');

const ehBaseUrl = 'http://www.english-heritage.org.uk';

const assocAttractApiUrl = 'http://www.english-heritage.org.uk/ehAjax/NM_Ajax/GetDataForMap.ashx?category=MapGroup&itemid='

const itemIds = {
  southeast: 3196439,
  southwest: 3195805,
  east: 3196605,
  eastmidlands: 3196654,
  westmidlands: 3196719,
  yorkshire: 3196806,
  north: 3196857,
}


/**
 * Parse the description field of an Associated Attraction retrieved from the
 * API, and split it up into useful parts. The field contains too much info
 * mashed together.
 */
function parseRawDesc(desc) {
  const regexStr = '^\\n<p>\\n?' +
    // Address (may be enclosed by <strong>)
    '(<strong>)?(.+?) ?(</strong>)?\\n</p>\\n' +
    // Description (optional).
    '(<p>\\n([\\s\\S]+\\S)\\s?\\n</p>\\n)?' +
    // Discount info.
    '<p>\\s?(<strong>[\\s\\S]+?)\\s?\\n</p>\\n' +
    // Telephone.
    '<p>\\n(&nbsp;)?(\\d[\\d\\s]+\\d)' +
    '(&nbsp;|\\s)?\\|(&nbsp;)? ' +
    // Link to webpage.
    '<a\\b.+?\\bhref="(.+?)(\\r\\n){0,2}"';

  const re = new RegExp(regexStr);

  const matches = desc.match(re);

  return {
    address: matches[2],
    description: matches[5],
    discount: matches[6],
    telephone: matches[8],
    link: matches[11],
  }
}



router.get('/', function(req, res, next) {

  // Accumulate all requests then continue when all finished.
  // See https://stackoverflow.com/questions/10004112/how-can-i-wait-for-set-of-asynchronous-callback-functions
  let requestPromises = [];

  for (let region in itemIds) {
    let itemId = itemIds[region];
    let url = assocAttractApiUrl + itemId;
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
  let attractions = {};

  Promise.all(requestPromises).then((regionsData) => {
    regionsData.map(regionData => {
      Object.entries(regionData.Region).forEach(([region, regData]) => {
        Object.entries(regData).forEach(([county, countyData]) => {
          countyData.properties.map(property => {

            // Split description up into useful fields.
            let info = parseRawDesc(property.so);

            let attract = {
              id: property.id,
              name: property.t,
              lat: parseFloat(property.lt),
              lng: parseFloat(property.lg),
              region: region,
              county: county,
              image: property.tui,
              // Whether free entry for everyone (regardless of EH membership).
              freeEntry: false,
              // Whether it's one of the most popular attractions.
              popular: false,
              categories: [],
              facilities: [],

              // Fields extracted from parsed description.
              description: info.description,
              discount: info.discount,
              address: info.address,
              link: info.link,
              telephone: info.telephone,
              // Whether it belongs to English Heritage, or is an Associated
              // Attraction.
              ownership: 'assocAttraction',
            };

            // Make all links open externally.
            /*
            let description = property.so;
            let linkRegex = /<a ([^>]+)>/;
            if (description.match(linkRegex)) {
              description = description.replace(linkRegex, '<a target="_blank" $1>'); 
            }
            property.so = description;
            */

            // Make sure no properties are repeated, by setting the ID as key.
            attractions[property.id] = attract;
          });
        });
      });
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(attractions, null, 2));
  })
});

module.exports = router;

