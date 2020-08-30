var slider = document.getElementById("range");
var output = document.getElementById("km");
output.innerHTML = slider.value;

var myPosition;
var addresses;

slider.oninput = function () {
    output.innerHTML = this.value;
}

// mevcut konum bilgimizi aldık.
function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            myPosition = position;
        });
    } else {
        console.log("Tarayıcınız HTML5 Geolocation sistemini desteklemiyor.");
    }
}

function initMap() {
    if (myPosition) {

        if (addresses) {
            markLocation();
        }
        else {
            getLocations();
        }

    }
    else {
        alert('konum bilgilerine izin vermediğiniz için işleme devam edemiyoruz.');
    }
}

function getLocations() {
    $.ajax({
        url: '/Home/GetLocations',
        type: 'GET',
        dataType: "json",
        success: function (data) {
            addresses = data;
            markLocation();
        },
        error: function (error) {
            alert(error);
        }
    });
}

function markLocation() {
    const myLatLng = {
        lat: myPosition.coords.latitude,
        lng: myPosition.coords.longitude
    };

    // haritanın merkezini mevcut konumumuza eşitledik.
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: myLatLng
    });

    // haritada kullanılacak ikonlar için nesne oluşturuldu.
    var iconBase =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/';

    var icons = {
        parking: {
            icon: iconBase + 'parking_lot_maps.png'
        },
        library: {
            icon: iconBase + 'library_maps.png'
        }
    };


    // haritada işaretlenecek olan noktalar için bir dizi oluşturuldu, ilk eleman olarak kendi konum bilgimiz eklendi.
    var features = [
        {
            position: myLatLng,
            type: 'library',
            name: 'Konumum'
        },
    ];

    // harita üzerinde kendi konum bilgimize göre bir daire oluşturduk. (daire yarıçapı ayarladığımız kilometre bilgisine göre ayarlanıyor.)
    var radius_circle = new google.maps.Circle({
        center: features[0].position,
        radius: slider.value * 1000,
        clickable: false,
        map: map
    });

    // haritada kendimizi işaretledik.
    var marker = new google.maps.Marker({
        position: features[0].position,
        icon: icons[features[0].type].icon,
        title: features[0].name,
        map: map
    });


    // gelen adres bilgilerini işaretlenecek noktaların tutulduğuyu diziye ekledik.
    addresses.forEach(item => {
        features.push({
            position: {
                lat: item.latitude,
                lng: item.longitude
            },
            type: 'parking',
            name: item.name
        });
    });

    // kendi konum bilgimizi değişkende saklıyoruz.
    var myLocation = new google.maps.LatLng(features[0].position);



    clearAddressList();
    // haritada işaretlenecek olan diziyi dönüyoruz.
    for (var i = 1; i < features.length; i++) {
        var targetLocation = new google.maps.LatLng(features[i].position);

        // konumumuzdan, hedef lokasyon arasındaki mesafeyi hesaplıyoruz.
        var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(targetLocation, myLocation);


        // hesaplanan mesafe kullanıcının seçtiği mesafeden az ise bunu harita üzerinde işaretliyoruz.
        if (distance_from_location <= (slider.value * 1000)) {


            var marker = new google.maps.Marker({
                position: features[i].position,
                icon: icons[features[i].type].icon,
                title: features[i].name,
                map: map
            });

            addAddressList(features[i]);
        };

    }
}

// haritada üzerinde işaretlenen nokta için Liste üzerinde link oluşturuyoruz.
function addAddressList(features) {
    $("#addressList").append(`<a href="https://maps.google.com/?q=${features.position.lat},${features.position.lng}&z=14" target="_blank">
                                                          <li class="list-group-item list-group-item-action mt-1">${features.name}</li>
                                                          </a>`);
}

// adres listemizi temizleyen fonksiyon
function clearAddressList() {
    $("#addressList").empty();
}