import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ.js';


const googleMap = new TileLayer({
  source: new XYZ({
    url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    attributions:"GOOGLE-MAP",
    cacheSize: 100,
  }),
  visible:true,
})

const map = new Map({
  target: 'map',
  layers: [
    googleMap
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});


//CACHING SIZE NASIL ETKI EDIYOR.....OLCEBILIRIZ...
//cachingSize i bir 0 yapariz, ve 3 once cachi sifirladiktan sonra 3 kez mouse tekerlegini zoom-in olacak sekilde ceviririz..sonra da 3 kez geri zoom-out yapacak sekilde cevirerek, request sayisinda nasil arttigini gorebiliriz ardindan da cachingSize:200 yaparak bunu kontrol edersek, 200 oldugunda zoom-in olurken ilk kez gonderilen request lerde cach devrede zaten olmuyor ondan dolayi birsey farkedilmez...ancak...zoom-out yaparak, mouse tekerlegini geri aldigmiz da asil farkederiz...farkliliigi ki request sayisinda cok ciddi azalmalar sagladigni fark edecegizdir......
//Openlyaers in kendi caching-library icindeki intern caching sistemnie biz intercepte olmaiyoruz mudahele edemiyoruz ancak openlayers in bize verdgi options lari kullanarak yapabiliriz....cacheSize gibi

//Standart screen size:  1920*1080 = (256x256) standart tile-grid=> 8*5=40
//Large screen size:2560*1440 = (256x256) standart tile-grid=> 10*6=60
