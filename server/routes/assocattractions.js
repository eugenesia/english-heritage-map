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
  for (let region in itemIds) {
    let itemId = itemIds[region];
    let url = assocAttractBaseUrl + itemId;
    request(url, (error, resp, body) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(body);
    });
  }
  /*
  request(ehPropertyUrl, (error, resp, body) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
  */
});

module.exports = router;

