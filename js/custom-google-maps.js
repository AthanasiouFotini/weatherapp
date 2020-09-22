var map, marker, infoWindow;

function initMap() {
    var location = {lat: 40.629269, lng: 22.947412};
    // Create google.maps map item
    map = new google.maps.Map(document.getElementById("googlemap"), {
        zoom: 8,
        center: location
    });

    // Create google.maps marker item
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
    
    map.addListener('click', function(e) {
        placeMarker(e.latLng, map);
    });

    function placeMarker(positionParam, mapParam) {
        if (marker == null) {
            marker = new google.maps.Marker({
                position: positionParam,
                map: mapParam
            }); 
        }
        else {
            map.panTo(positionParam);
            marker.setPosition(positionParam);
        }
        // save lat/lng values to hidden input fields so we can feed them to Draxis API later
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        $('#lat-input').val(lat);
        $('#lng-input').val(lng);
    }
    
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        $('#lat-input').val(pos.lat);
        $('#lng-input').val(pos.lng);
        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pos);
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}