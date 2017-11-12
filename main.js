var request = require('request')
const importEnv = require('import-env') //documentaiton: https://www.npmjs.com/package/import-env

const {
  PORT,
  GKEY,
  DARKSKYKEY
} = require('./config') //import env via config file

function weather(zip) {
  var postal_code = zip
  var getlatlng = {
    url: 'https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:' + postal_code + '&key=' + GKEY,
    headers: {
      'User-Agent': 'request'
    }
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      var lat = info['results'][0]['geometry']['location']['lat']
      var lng = info['results'][0]['geometry']['location']['lng']
      // console.log(`Latitude = ${lat} Longitude = ${lng}`)

      var options = {
        url: 'https://api.darksky.net/forecast/' + DARKSKYKEY + '/' + lat + ',' + lng,
        headers: {
          'User-Agent': 'request'
        }
      }

      function callback2(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          console.log('Minute Summary: ' + info['minutely']['summary']) //summary, icon
          // console.log(info['currently'])//temperature, windSpeed, windGust, visibility
          console.log('Hourly Summary: ' + info['hourly']['summary']) //summary, icon
          console.log('Daily Summary: ' + info['daily']['summary']) //summary, icon
        }
      }
      request(options, callback2);
    }
  };

  request(getlatlng, callback);
}
///////////////////////////////////
/////make a promise request//
//////////////////////////////////

var postal_code = '77006'
var google_api = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postal_code}&key=${GKEY}`;
var axios = require('axios')
axios.get(google_api)
  .then(function (response) {
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    return [lat,lng]
  })
  .then(function(response){
    var darksky_api = `https://api.darksky.net/forecast/${DARKSKYKEY}/${response[0]},${response[1]}`
    axios.get(darksky_api)
    .then(function(response){
      var minute_summary = response.data.minutely.summary
      var minute_icon = response.data.minutely.icon
      var daily_summary = response.data.daily.summary
      var daily_icon = response.data.daily.icon
      var hourly_summary = response.data.hourly.summary
      var hourly_icon = response.data.hourly.icon
      var currently_summary = response.data.currently.summary
      var currently_icon = response.data.currently.icon
      var currently_temp = response.data.currently.temperature
      return([minute_summary, minute_icon, daily_summary, daily_icon, hourly_summary, hourly_icon, currently_summary, currently_icon, currently_temp])
    })
    .then (function(response){
      console.log(response)
    })
  })
  .catch(function (error) {
    console.error(error);
  });

//////////////////////////////////////////
/////////////JQUERY////////////////////////
//////////////////////////////////////////
// $(document).ready(function() {
//       console.log('ready!');
//       $('h2').text('promise working');
//
//       $('#button').click(function() {
        // var postal_code = $('#postal_code').val();
        // console.log(postal_code);
        // var result = weather(postal_code);
        // console.log(result);
        // $('#result').text(result);
        // console.log('api called!');
//       });
// });
