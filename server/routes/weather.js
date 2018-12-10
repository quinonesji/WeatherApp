var express = require('express');
var router = express.Router();

var request = require('request');

/* GET weather details listing. */
router.get('/', function(req, res) {   
    console.log(req);
  res.json(
    [{"coord":{"lon":-81.38,"lat":28.54},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":62.35,"pressure":1027,"humidity":77,"temp_min":60.08,"temp_max":64.94},"visibility":11265,"wind":{"speed":6.93,"deg":20},"clouds":{"all":1},"dt":1544233560,"sys":{"type":1,"id":6017,"message":0.0038,"country":"US","sunrise":1544270756,"sunset":1544308141},"id":4167147,"name":"Orlando","cod":200}]);
});

router.post('/', function(req, res) {
    // console.log(req.body.city);
    var city = req.body.city;
    //build api URL with user zip
    const baseUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}`;	
    const apiId = '&appid=dbde6193d22358bb0ec03702d0d5d2a7&units=imperial';

    var weather_json = {};
    request( baseUrl + apiId , function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body.weather[0].description); // Print 
        //console.log('body:', body.weather[0].icon);
        weather_json = JSON.parse(body);
        // console.log(weather_json);
        // console.log(weather_json.main.temp);
        // console.log(weather_json.weather[0].description);
        // console.log(weather_json.weather[0].icon);
        res.json(weather_json);
        });
});

module.exports = router;
