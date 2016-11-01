function initMap() {
    var myLatLng = { lat: 59.928846, lng: 30.361873 };

    var styleArray = [{
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "saturation": "30"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
            "hue": "#ff0000"
        }, {
            "gamma": "1.00"
        }, {
            "saturation": "-100"
        }]
    }];


    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 16,
        scrollwheel: false,
        styles: styleArray
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: '../img/marker.png'
    });
}

initMap();
