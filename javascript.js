
var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpzbGFnZXIiLCJhIjoiZUMtVjV1ZyJ9.2uJjlUi0OttNighmI-8ZlQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWpzbGFnZXIiLCJhIjoiZUMtVjV1ZyJ9.2uJjlUi0OttNighmI-8ZlQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var map = L.map('map', {layers:[light]}).fitWorld();

// control that shows info in the white info box in the top right
var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h4>Find Your Location</h4>' +  ('This app will not record your location at any moment!');
  };

  info.addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet from this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

    if (radius <= 100) {
          L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
      }
      else{
          L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
      }

    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours();
    var sunset = times.sunset.getHours();


    var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset){
          map.removeLayer(dark);
          map.addLayer(light);
        }
        else {
          map.removeLayer(light);
          map.addLayer(dark);
        }
}

map.on('locationfound', onLocationFound); //this is the event listener

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 16});

var baseMaps = {
  "Light": light,
  "Dark": dark
};
L.control.layers(baseMaps).addTo(map);

var helloPopup = L.popup().setContent('You are here!');

L.easyButton('fa-globe', function(btn, map){
    helloPopup.setLatLng(map.getCenter()).openOn(map);
}).addTo(map);
