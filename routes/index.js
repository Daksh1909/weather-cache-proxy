const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    skip: (req, res) => res.apicacheHit === true
});

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

const API_BASE_URL_2 = process.env.API_BASE_URL_2;

let cache = apicache.middleware;

router.get('/', cache('2 minutes'), limiter, async (req, res) => {
    try {
        // Search parameters for getting latitude and longitude
        const paramsGeocoding = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            limit: 3,
            ...url.parse(req.url, true).query
        });
        // console.log(url.parse(req.url, true).query);
        const apiRes = await needle('get', `${API_BASE_URL}?${paramsGeocoding}`);
        const dataGeocoding = apiRes.body;
        const dataLat = dataGeocoding[0].lat;
        const datalon = dataGeocoding[0].lon;

        // Search parameters for getting weather information from latitude and longitude
        const paramsWeather = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            lat: dataLat,
            lon: datalon
        });
        const apiRes2 = await needle('get', `${API_BASE_URL_2}?${paramsWeather}`);
        const dataWeather = apiRes2.body;

        // Terminal logger if the environment is not production
        if (process.env.NODE_ENV !== 'production') {
            console.log(`GEOCODING REQUEST: ${API_BASE_URL}?${paramsGeocoding}`);
            console.log(`WEATHER REQUEST: ${API_BASE_URL_2}?${paramsWeather}`);
        }

        res.status(200).json(dataWeather);
    } catch (error) {
        res.status(500).json({ error });
        console.log(error)
    }
})

module.exports = router;