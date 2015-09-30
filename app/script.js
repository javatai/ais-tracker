var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [ 9.996006002132162, 53.50766131847098 ],
    zoom: 12
});

var mapLayers = {
  marker: {
    add: function (src, map) {
      if (!map.getSource("marker")) {
        map.addSource("marker", {
          "type": "geojson"
        });

        map.addLayer({
          "id": "marker",
          "type": "symbol",
          "source": "marker",
          "interactive": true,
          "layout": {
            "icon-image": "{marker-symbol}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          },
          "paint": {
              "text-size": 12
          }
        });
      }

      map.getSource("marker").setData(src);
    },
    remove: function (map) {
      map.removeLayer("marker");
      map.removeSource("marker");
    }
  },
  track: {
    add: function (src, map) {
      if (!map.getSource("track")) {
        map.addSource("track", {
          "type": "geojson"
        });

        map.addLayer({
          "id": "track",
          "type": "line",
          "source": "track",
          "paint": {
            "line-color": "#888",
            "line-width": 3
          }
        }, 'markers');
      }

      map.getSource("track").setData(src);
    },
    remove: function (map) {
      map.removeLayer("track");
      map.removeSource("track");
    }
  },
  features: {
    add: function (src, map) {
      if (!map.getSource("features")) {
        map.addSource("features", {
          "type": "geojson"
        });

        map.addLayer({
          "id": "features",
          "type": "circle",
          "source": "features",
          "interactive": true
        }, 'markers');
      }

      map.getSource("features").setData(src);
    },
    remove: function (map) {
      map.removeLayer("features");
      map.removeSource("features");
    }
  }
}

map.on('style.load', function () {

        mapLayers.marker.add("/api/ships?format=geojson", map);

        $('#reload').on('click', function () {
          mapLayers.track.remove(map);
          mapLayers.features.remove(map);

          map.setCenter([ 9.996006002132162, 53.50766131847098 ]);
          map.setZoom(12);

          mapLayers.marker.add("/api/ships?format=geojson", map);
        })

        map.on('click', function (e) {
            map.featuresAt(e.point, { layer: 'marker', radius: 10, includeGeometry: true }, function (err, features) {
                if (err) throw err;

                if (features[0]) {
                      var feature = features[0];

                      mapLayers.track.add("/api/track/" + feature.properties.id + "?format=geojson-line", map);
                      mapLayers.features.add("/api/track/" + feature.properties.id + "?format=geojson-features", map);

                      map.setZoom(16);
                      map.setCenter(feature.geometry.coordinates);

                      //console.log(feature);
                }
            });

            map.featuresAt(e.point, { layer: 'features', radius: 10, includeGeometry: true }, function (err, features) {
                if (err) throw err;

                if (features[0]) {
                      var feature = features[0];

                      //console.log(feature);
                }
            });
        });

});
