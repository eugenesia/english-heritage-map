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
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
});

module.exports = router;

