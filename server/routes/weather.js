var express = require('express');
var router = express.Router();

var async = require('async');

var mysql = require('mysql');

var host = process.env.DB_URL || 'localhost';
var user = process.env.DB_USER || 'root';
var pass = process.env.DB_PASS || '';
var dbName = process.env.DB_DBNAME || 'weatherapp';

var connection = mysql.createConnection({
    host     : host,
    user     : user,
    password : pass,
    database : dbName
  });

connection.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("connected to db...");
});

var request = require('request');

//`SELECT * FROM `geo_states` WHERE latitude <= 28.8117 and (-1*longitude) >= (-1*-81.2681) and abv=${state}`

/* GET weather details listing. */
router.get('/', function(req, res) {   
    console.log(req);
  res.json(
    [{"coord":{"lon":-81.38,"lat":28.54},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":62.35,"pressure":1027,"humidity":77,"temp_min":60.08,"temp_max":64.94},"visibility":11265,"wind":{"speed":6.93,"deg":20},"clouds":{"all":1},"dt":1544233560,"sys":{"type":1,"id":6017,"message":0.0038,"country":"US","sunrise":1544270756,"sunset":1544308141},"id":4167147,"name":"Orlando","cod":200}]);
});

router.post('/', function(req, res) {
    // console.log(req.body.city);
    var city = req.body.city;
    var state = req.body.state;
    console.log(state);
    //build api URL with user zip
    const baseUrl = `http://api.openweathermap.org/data/2.5/find?q=${city},us`;	
    const apiId = '&appid=dbde6193d22358bb0ec03702d0d5d2a7&units=imperial';

    var weather_json = {};
    request( baseUrl + apiId , function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body.weather[0].description); // Print 
        //console.log('body:', body.weather[0].icon);
        weather_json = JSON.parse(body);

        //console.log(weather_json);
        //console.log(weather_json.list.length);
        if(weather_json.cod === "400"){
            res.json(weather_json);
        }
        else if(weather_json.list.length !== 0) {
            const sql = `SELECT latitude, longitude FROM geo_states WHERE abv='${state}' and country='US'`;
                
                // const sql = `SELECT abv as ABV FROM geo_states WHERE latitude <= ${lat} and (-1*longitude) >= (-1*${lon}) and abv='${state}'`;
               
                connection.query(sql, function(err, rows, fields) {
                    if (err) throw err;
                    try {
                       //res.json(rows);
                        for (var i in rows) {
                            for( var t in weather_json.list) {
                                if(weather_json.list[t].coord.lat >= rows[i].latitude && (-1*weather_json.list[t].coord.lon) <= (-1*rows[i].longitude)) {
                                    console.log("Got it! ", weather_json.list[t]);
                                    return res.json(weather_json.list[t]);
                                    //ret = weather_json.list[t];
                                }
                                else {
                                    return res.json({cod:"400", message: "Something wrong happened."})
                                }
                            }
                            //res.json(ret);
                        //    console.log('lat: ', rows[i].latitude);
                        //    console.log('lon: ', rows[i].longitude);
                        //    config.lat = rows[i].latitude;
                        //    config.lon = rows[i].longitude;
                        //    console.log('config.lat: ',config.lat);
                        //    console.log('config.lon: ', config.lon);
                        }
                    } catch (e) {
                        throw e;
                    }
                });
        }
        else {
            var final_weather_json = {
                message:  "city not found",
                cod: "404"
            };
            res.json(final_weather_json);
        }
        // console.log(weather_json);
        // console.log(weather_json.main.temp);
        // console.log(weather_json.weather[0].description);
        // console.log(weather_json.weather[0].icon);
        
        });
});

module.exports = router;
