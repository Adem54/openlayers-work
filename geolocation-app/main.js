import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Control from 'ol/control/Control.js';
import Point from 'ol/geom/Point.js';
import Geolocation from 'ol/Geolocation.js';
//Helper class for providing HTML5 Geolocation capabilities. The Geolocation API is used to locate a user's position.
import Feature from 'ol/Feature.js';
import {Circle, Fill, Stroke, Style} from 'ol/style.js';
import CircleStyle from 'ol/style/Circle';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';


let mapView  = new View({
  center: [0, 0],
  zoom: 2
});
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: mapView
});

//Burda dogrudan javascript dom uzerinden bir div elementi onun class ve id si, o div elementine child olarak button-class ve id si olusturuyoruz
var geolocationBtn = document.createElement("button");
geolocationBtn.innerHTML = `
<i class="fa-solid fa-location-crosshairs" style='font-size:2rem; cursor:pointer;
vertical-align:middle; margin-left:14px; color:black;'></i>
`;
geolocationBtn.className = "geolocationBtn";
geolocationBtn.id = "geolocationBtn";
var geolocationElement = document.createElement("div");
geolocationElement.className = "geolocationContent";
geolocationElement.appendChild(geolocationBtn);

var geolocationControl = new Control({
  element:geolocationElement
})

let isGeolocationActive = false;
geolocationBtn.onclick = function(event){
  console.log("event-taraget: ", event.target);
  
 
  if(!isGeolocationActive){
     //Make geolocation enabled
    event.target.style.color = "#e01304";
     startAutolocate();
    isGeolocationActive = !isGeolocationActive;

  }else{
    //Make geolocation disabled
    //Geolocation ozelligini
    event.target.style.color = "#000";
     stopAutolocate();
    isGeolocationActive = !isGeolocationActive;
  }
  console.log("event-Currentarget: ", event.currentTarget);

}

map.addControl(geolocationControl);



/*
LIVELOCATION FUNCTIONALITY IN OPENLAYERS 
Kullanici smartphone-location iconuna bastiginda map will zoom to users location, circle-marker will be added in the circle polygon. the marker inthe center indicates the users position, the circle polygon which is the usersposition cover,indicates the accuracy of the position, Her 10 saniye de kullanicinin pozisyonunu belirleyecek, bu gelocation ozelligi nin basladigini biz, iconun renginden anlayacagiz ilk once siyah renkle gelecek olan icon, eger tiklandi ise yani geolocation ozelligi aktif edildi ise o zaman kirmizi renkte gozukecek, kirmizi renkli ise biz bilecegiz ki artik kullanicinin location ini takip e basladi
It will live-locate user every 10 second
Eger biz ornegin, haritayi mouse ile kaydirirsak, yani tutup farkli yerleri getirirsek geolocation ozelligi 10 saniye bekledikten sonra tekrardan bizim location imizi getirecek...Biz kendimz locate etmeye calisirsak kendimzi o zaman da geolocation 10 saniye sonra tekrar bizim konumuzu gosterecektir..Biz tabi disabled edene kadar geolocation ozelligi caisacaktir...
Geolocation ozelligini kaldirinca artik her 10 saniye de bir location i gostermeyecektir

*/

//jquery ozelliginin taninabilmesi ve uygulanabilmesi icin bizim jquery yi sisteme dahil etmemiz gerekiyor 
//<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

//Helper class for providing HTML5 Geolocation capabilities. The Geolocation API is used to locate a user's position.
//To get notified of position changes and errors, register listeners for the generic change event and the error event on your instance of Geolocation.
var intervalAutolocate;
var posCurrent;

//tracking:true yapip bu sekilde tanimladigmi zaman uygulama baslar baslamaz geolocation da user in location ini takip etmeye baslayacak ve location-accuracy bilgini memory de ram de tutacak
const geolocation = new Geolocation({
  trackingOptions:{
    enableHighAccuracy:true,
  },
  tracking:true,
  // take the projection to use from the map's view
  projection: map.getView().getProjection()
});

var positionFeature = new Feature();
positionFeature.setStyle(
  new Style({
    image:new CircleStyle({
      radius:6,
      fill:new Fill({
        color:"#3399CC"
      }),
      stroke:new Stroke({
        color:"#fff",
        width:2,
      })
    })
  })
);

var accuracyFeature =  new Feature();

var currentPositionLayer = new VectorLayer({
map:map,
source: new VectorSource({
  features:[accuracyFeature, positionFeature]
}) 
})

// listen to changes in position
geolocation.on('change', function(evt) {
  console.log(geolocation.getPosition());
});

// listen to error
geolocation.on('error', function(evt) {
  window.console.log(evt.message);
});


function startAutolocate(){
  var coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  mapView.setCenter(coordinates);
  mapView.setZoom(16);
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  intervalAutolocate = setInterval(function(){
    var coordinates = geolocation.getPosition();
    var accuracy = geolocation.getAccuracyGeometry();
    positionFeature.setGeometry(coordinates ?  new Point(coordinates) : null); 
    map.getView().setCenter(coordinates);
    mapView.setZoom(16);
    accuracyFeature.setGeometry(accuracy);
  }, 10000)
  
}

function stopAutolocate(){
  clearInterval(intervalAutolocate);
  positionFeature.setGeometry(null);
  accuracyFeature.setGeometry(null);
}