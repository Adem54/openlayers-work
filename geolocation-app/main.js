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
var geolocation = new Geolocation({
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



//Bestpractise bos bir feature olusturuz ardindan da coordinat lara erisince de setGeometry uzerinden feature in icerisine geometry atamis oluruz setGeometry() parametresine coordinat lari atayarak
var accuracyFeature =  new Feature();

//Bu da dikkatimiz cekti...Yani, burda sunu yapiyor...optionslar icinde bu ozelligin hangi map de kullanilacagini verirsek artik bizim ayrica gidip de bunu map e eklememize gerek kalmiyor...map.addLayer() islemine gerek kalmiyor..
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


/*
Geolocation uzerindenn biz nelere erisiyoruz onu bir anlayalim!!!!
1-currentPositions Coordinates = geolocation.getPosition();
2-accuracy-getAccuracy()
Coordinates = geolocation.getAccuracyGeometry() -
getAccuracyGeometry()
Accuracy coordinates demek, pozisyonun etrefainda circle yani ne kadar net veya ne kadar dogrulugu var... Verilen pozisyon ne kadar guvenilir ne kadar isabetli oldugunu anlayabilecegimiz degerdir..ve hesaplanmis bir radius degeri vardir..Accuracy value su demek, hareket eden cismin, pozisyonu konumu mesafesiii muhtemelen, verilen accuracy icerisinde bir yerdedir..Yani verilen asil pozisyonun yerinden ornegin eger accuracy degeri y ani accuracy daire nin 10 metrelik bir radius u var ise bu su demektir, pozisyonu verilen kullanici 10 metre daire icerisindedir..Verilen actaual position kesin garanti edilen pozisyon degildir ondan dolayi accuracy degeri de veriliyor..Cunku bu deger kullanicinin cihazinin donanimi, signal gucu, cevresel etmenler ve de location i alirken kullanilan, GPS,WIFI vs gibi bircok etken vardir..
3-getAltitude-rakim, yukseklik
getAltitudeAccuracy()
4-getHeading 
5-getSpeed()
6-getTracking()Determine if the device location is being tracked.
*/
function startAutolocate(){
  var coordinates = geolocation.getPosition();
  //BESTPRACTISE...ILK DEFA GORUYORUMM.... BOS BIR FEATURE OLUSTRUUP ICERISINE GEOMETRY SET ETMEK...VE DIKKAT EDELIM..POSITIONFEATURE HER ZAMAN KULLANCI POZISYONU ALARAK OLUSTURULUYOR...VE SUREKLI GUNCELLENEREK MAP-VIEW-CENTER A SET EDILEREK SUREKLI OLARAK BU UYGULAMAYI KULLANAN KULLANICI NEREDE ISE ORAYI GOSTERIYOR...
  //setGeometry yi alarak surekli olarak, guncellenyor positionFeature...dikkat edelim..Ayrica bir feature in, guncellenmesi, getGEometry().setCoordinates ile olabildigi gibi bu sekilde de olabiliyor...BESTPRACTISE...
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  //guncellenen pozisyon her zaman map in center ina set ediliyor bunu unutmayalim bu cook onemli ve belirleyici bir ozelliktir ve ayrica da zoom degeri 16 olarak ataniyor...
  mapView.setCenter(coordinates);
  mapView.setZoom(13);
  
  //Ayrica accuracy de, zaten position i gosteren, point i etrafinda olusturulan dairedir...
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());

  //Kullanici locationtakibine baslama iconuna tiklayinca once setInteraval a girmeden ilk kez, getPosition-coordinates, accuracyFeature vs bunlari bir kez alir, ardindan ondan sonra setInterval ile bu datalarin guncellenmesini saglar

  intervalAutolocate = setInterval(function(){

    var coordinates = geolocation.getPosition();
    var accuracy = geolocation.getAccuracyGeometry();
    var currentTimeStamp = new Date().getTime();
   //Yapilcak is sudur normalde..Tam olarak burda, her location geldiginde burdaki location surekli guncelliyor kendini, belirli araliklarla ajax ile post request gondererek bu pozisyon, accuracy, timestamp, deviceId vs gibi bircok bilgiyi veritabanina kaydedecegiz surekli olarak, ve ayni sekilde de o veritabanindan verilerei cekerek, bu uygulamayi ve araci takip etmek isteyen kullanicinin onune surekli olarak rotayi ve aracin nerde oldugunu sunabilmis oluyoruz...BUU COOK ONEMLIDIR...HARIKA...

    positionFeature.setGeometry(coordinates ?  new Point(coordinates) : null); 
    map.getView().setCenter(coordinates);
    mapView.setZoom(13);
    accuracyFeature.setGeometry(accuracy);
  }, 10000)
  
}//Bu ozellikleri biz her 10 saniye de yeniden almak istiyoruz ki, kullanici hareket halinde iken kullanicinin ilerledigi pozisyona gore location guncellensin diye...BURASI COOK ONEMLIDIR..

function stopAutolocate(){
  clearInterval(intervalAutolocate);
  positionFeature.setGeometry(null);
  accuracyFeature.setGeometry(null);
}