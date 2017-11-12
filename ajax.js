var GKEY = 'AIzaSyCwFDOhey8R8DBS0uPpf4de5Ax8wJ9nn-o'
var DARKSKYKEY = '5da02e8833bd1009ad0a6cbb58770bf8'
$(document).ready(function() {
  $('h2').text('AJAX working')
  $('#button').click(function() {
    var postal_code = $('#postal_code').val();
    $('#postal_code').val("");
////////////////////
///weather function//
////////////////////
// function weather(response){
//     $('#latitude').html("Latitude: " + response.results[0].geometry.location.lat);
//     $('#longitude').html("Longitude: " + response.results[0].geometry.location.lng);
//     var latitude = response.results[0].geometry.location.lat
//     var longitude = response.results[0].geometry.location.lng
//
//     $.ajax({
//       url:`https://api.darksky.net/forecast/${DARKSKYKEY}/${latitude},${longitude}`,
//       type:'GET',
//       data: {
//         format: 'json'
//       },
//     success:function(response){
//       console.log(response)
//     },
//     error: function(){
//       console.log("There was an error.");
//       $('#errors').text("There was an error processing your request. Please try again.");
//     }
//     });
// }

////////
// var promise = new Promise(function(resolve, reject) {
//   // do a thing, possibly async, then…
//   var google_api = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postal_code}&key=${GKEY}`;
//   var jqxhr = $.ajax(google_api)
//     .done(function(response) {
//       return response;
//     })
//     .fail(function(jqXHR, textStatus, errorThrown) {
//       console.error(errorThrown);
//     })
//     .always(function() {
//       console.log("complete");
//     });
// /////////////
//   if (/* everything turned out fine */) {
//     resolve("Stuff worked!");
//   }
//   else {
//     reject(Error("It broke"));
//   }
// });
////////
var google_api = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${postal_code}&key=${GKEY}`;

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        console.log(req.response);
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error("Network Error shiittt"));
    };
    req.send();
  });
}
function getJSON(url) {
  return get(url).then(JSON.parse);
}

getJSON(google_api).then(function(response){
  console.log(response.results[0]);
  var lat = response.results[0].geometry.location.lat
  var lng = response.results[0].geometry.location.lng
  return [lat, lng]
}).then(function(response){
  $('#latitude').val(response[0]);
  $('#longitude').val(response[1]);
  return response;
}).then(function(response) {
  let url = `https://api.darksky.net/forecast/${DARKSKYKEY}/${response[0]},${response[1]}`
  return url;
});

function darkSky(lat, long) {
  let url = `https://api.darksky.net/forecast/${DARKSKYKEY}/${lat},${long}`
  getJSON(url).then(function(response){
    console.log(response)
  })
}


// var darksky_api = `https://api.darksky.net/forecast/${DARKSKYKEY}/${response[0]},${response[1]}`


$("#weather").click(function(){
  let lat = $('#latitude').val();
  let long = $("#longitude").val();
  darkSky(lat,long)
});

///////

});
});
