import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ.js';


const googleMap = new TileLayer({
  source: new XYZ({
    url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
    attributions:"GOOGLE-MAP",
    // cacheSize: 100,
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


//SERVICE-WORKERS.-GLOBAL CLIENTSIDE CACHING AND MORE CONTROL....
//bIZ NETWORK DE HEAD E GIDINCE DE STATUS DE DE FROM SERVICE WORKERS YAZDIGINI GOREBILIRZ
//SONRA APPLICATION DA YANI BROWSER DEVELOPER TOOLS DAN APPLICATION I ACTIKTAN SONRA SOL SIDEBAR EN USTTE SERVICE WORKERS A TIKLAYIP GELEN PENCEREDE OFFLINE MODA ALIRSAK VE ARDINDAN SAYFAYI YENILEYECEK OLURSAK EGER..SAYFA DAKI DATALARIMIZIN GELDIGINI GOREBILIIRIZ....HARIKA BESTPRACTISE....
//Biz bu caching isleminin bize gonderilen request sayisi konusunda ne kadar faydasi oldugnu gormek istedigmiz de sunu yapariz...Ayni projeyi caching islemlerini cikararak olustururuz birde ve sonrasinda browser da acip network kismina gidip en altta request sayisini gorebiliriz ama request sayisi zaten ayni sayida olacak ama, asil olarak gelen respoinse un nerden geldigine bakmmamiz gerekiyor bunu da netwerk deki tum request lerin karsilarina bakip orda serviceWorker yazanlar caching den gelenlerdir....Burda tek tek bakarak ilk andaki toplam request saysiindan kac tanesi cache den gelmis bunu gorebiliriz....COOOOK ONEMLI....
//Birde sunu goruruz....CACHINGGG ISLEMI... ILE NETWORK U KAPATIRSAK...APPLICATION DAN HALA DATAMIZIN GELDIGNI GOREBILIRIZI CACHING YAPTIGMIZ YERDE
//APPLICATION-CACHING...E GIDIP TILE-CACHE DE TIKLAYIP BIR ALT PENCERE DE PREVIEW DERSEK ORDA GORURUZ ZATEN
//3 BARIZ AVANTAJI SAGLIYOR
//1-BETTER PERFORMANCE
//2-LESS REQUEST
//3-OFFLINE SERVICE



//CACHING SIZE NASIL ETKI EDIYOR.....OLCEBILIRIZ...
//cachingSize i bir 0 yapariz, ve 3 once cachi sifirladiktan sonra 3 kez mouse tekerlegini zoom-in olacak sekilde ceviririz..sonra da 3 kez geri zoom-out yapacak sekilde cevirerek, request sayisinda nasil arttigini gorebiliriz ardindan da cachingSize:200 yaparak bunu kontrol edersek, 200 oldugunda zoom-in olurken ilk kez gonderilen request lerde cach devrede zaten olmuyor ondan dolayi birsey farkedilmez...ancak...zoom-out yaparak, mouse tekerlegini geri aldigmiz da asil farkederiz...farkliliigi ki request sayisinda cok ciddi azalmalar sagladigni fark edecegizdir......
//Openlyaers in kendi caching-library icindeki intern caching sistemnie biz intercepte olmaiyoruz mudahele edemiyoruz ancak openlayers in bize verdgi options lari kullanarak yapabiliriz....cacheSize gibi








