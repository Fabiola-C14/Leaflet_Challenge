//Select map title layers

var grayScalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "light-v10",
    accessToken: API_KEY
  });

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "satellite-streets-v11",
    accessToken: API_KEY
});

    var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Define basemaps to hold base layers
var baseMaps = {
    Satellite: satelliteMap,
    Grayscale: grayScalemap,
    Outdoors: outdoorMap
  };

var myMap = L.map("map", {
    center: [34.05, -118.24],
    zoom: 5,
    layers: [grayScalemap, satelliteMap, outdoorMap]
})

//Create a control layer
var controlLayers=L.control.layers(baseMaps, {}, {
    collapsed:false
}).addTo(myMap);


  //Create marker size for earthquakes
  function markerSize(magnitude) {
    return magnitude * 3;
};

function circleColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#54278f";
    case magnitude > 4:
      return "#756bb1";
    case magnitude > 3:
      return "#9e9ac8";
    case magnitude > 2:
      return "#bcbddc";
    case magnitude > 1:
      return "#dadaeb";
    default:
      return "#f2f0f7";
    }
} 

//Retrieve earthquake geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response){
    //console.log(response)  
    geoEarthquakes=L.geoJSON(response, {
      pointToLayer: function(feature) {
        return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
          fillColor: circleColor(+feature.properties.mag),
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
          radius: markerSize(+feature.properties.mag)
        });
      },
      //Create popup with earthquake info
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<p><h4>Magnitude: " + feature.properties.mag + "</h4></p><hr><p>Location: "
            + feature.properties.place + 
            "</p><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p>");
      }
  }).addTo(myMap);
  controlLayers.addOverlay(geoEarthquakes, "earthquakes")
});
//Retrive Tectonic Plate geoJSON data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
 function(response){
  geoPlates=L.geoJSON(response,{
     style: {
       color: "purple",
       weight: 3,
     }
   }).addTo(myMap);

   //Ass as an overlay to map
   controlLayers.addOverlay(geoPlates, "Tectonic Plates");
 });

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
    grades=[0, 1, 2, 3, 4, 5],
    labels=[];

    div.innerHTML += '<h3>Magnitude</h3>'
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          console.log(circleColor(grades[i] + 1))
    }
    return div;
  };

  legend.addTo(myMap);