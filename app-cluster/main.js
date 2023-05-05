import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';
import {Cluster, OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {boundingExtent} from 'ol/extent.js';

const distanceInput = document.getElementById('distance');
const minDistanceInput = document.getElementById('min-distance');

const count = 20000;
const features = new Array(count);
const e = 4500000;
for (let i = 0; i < count; ++i) {
  const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new Feature(new Point(coordinates));
}

//2000 tane feature olusturup bir dizi icine atiyor bunu birbirine yakinligina gore gruplayan clustor in kendisi oluyor ve her yaklastikca bunlarin yakinliklarina gore, yine grupliyor ve uzerinde ki sayi kac ise ona yaklasirsan onun altinda bir o kadar daha point gelecek demektir
//Yani 

const source = new VectorSource({
  features: features,
});






const clusterSource = new Cluster({
  distance: parseInt(distanceInput.value, 10),//input value sinden 40 geliyor
  //10 sayisi arttikca haritadaki noktalar azaliyor aralrindanki mesafe artiyor..ama 10 sayisi 5 olunca nokta sayisi artarken aralarindaki distance azaliyor
  minDistance: parseInt(minDistanceInput.value, 10),
  source: source,
});


const styleCache = {};

//Burdaki feature lar harita da ilk actigimzda karsimiza gelen pointlerdir noktalardir ve biz zoom-in yaptgmizda bu noktlarin sayisi artiyor
const clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
   // console.log("feature.get('features'): ",feature.get('features'));
    //Her bir feature icerisinde o feature ye ait features isminde key var ve onun value si de onun alt feature leridir yani dizi icerisindeki feature lerdir... 
    console.log(feature.getKeys());
    //2000 tane feature olusturup bir dizi icine atiyor bunu birbirine yakinligina gore gruplayan clustor in kendisi oluyor ve her yaklastikca bunlarin yakinliklarina gore, yine grupliyor ve uzerinde ki sayi kac ise ona yaklasirsan onun altinda bir o kadar daha point gelecek demektir
//Yani burdaki feature.get("features").length dedigi sudur ki, 
    const size = feature.get('features').length;
    console.log("size: ",size);//features icerisinde bulunan adet sayisini verecek
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: '#3399CC',
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      });
      styleCache[size] = style;
    }
    return style;
  },
});

const raster = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  layers: [raster, clusters],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

distanceInput.addEventListener('input', function () {
  //Burda da distance arttiriliyor, ayarlama cubugu ile ve bu sekilde cluster lar arasi mesafe artiyor ve daha cok cluster lar map uzerine geliyor
  console.log("DistanceINput triggered: ",distanceInput.value);
  clusterSource.setDistance(parseInt(distanceInput.value, 10));
});

minDistanceInput.addEventListener('input', function () {
  clusterSource.setMinDistance(parseInt(minDistanceInput.value, 10));
});

map.on('click', (e) => {
  
  clusters.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      console.log("features.length: ",features.length);
      if (features.length > 1) {
        const extent = boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates())
        );
        map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
      }
    }
  });
});


/*
 Ilk once elimzdeki tum feature leri biz bir array icine atip bunu sources e veriyoruz
 Ardindan da bu cluster da source olarak kullanililiyor ve cluster in yapisi su sekildedir
 Kendisi point lerin koordinatlarinin birbirine yakinliklarina gore, onlari grupluyor ve bizim karsimiza da grupladigi pointler icin
 yuvarlak bir style olusturup uzerinde kac adet point barindiriyo ise onu gosteriyor
 Bunu kendisi coordinatlarin yakinligina gore yapiyor ve biz zoom-in i kullandikca da dinamik olarak tekrar bir gruplama yapiyor 
 Bunu asagidaki yerde yapiyor

 const clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
   // console.log("feature.get('features'): ",feature.get('features'));
    //Her bir feature icerisinde o feature ye ait features isminde key var ve onun value si de onun alt feature leridir yani dizi icerisindeki feature lerdir... 
    console.log(feature.getKeys());
    //2000 tane feature olusturup bir dizi icine atiyor bunu birbirine yakinligina gore gruplayan clustor in kendisi oluyor ve her yaklastikca bunlarin yakinliklarina gore, yine grupliyor ve uzerinde ki sayi kac ise ona yaklasirsan onun altinda bir o kadar daha point gelecek demektir
//Yani burdaki feature.get("features").length dedigi sudur ki, 
    const size = feature.get('features').length;
    console.log("size: ",size);//features icerisinde bulunan adet sayisini verecek
    let style = styleCache[size];

    Daha sonra ise 


map.on('click', (e) => {
  
  clusters.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      console.log("features.length: ",features.length);
      if (features.length > 1) {
        const extent = boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates())
        );
        map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
      }
    }
  });

  Yukardaki map.on("click",(e)=>{ ) kisimda biz const features = clickedFeatures[0].get('features'); olarak tikladigmz point altinda kac tane feature var ise onlari bir dizi icerisinde aldigmiz yerdir ama tiklanan point altindaki feature lari de zaten cluster ozelligi coordinatlarin birbrine yakinligina gore ayarliyor yani burda bizim features leri parent child iliskisinde yerlestiremize gerek yok biz sadece ilk bas elimizdeki tum feature leri bir dizi icine atariz ve eger varsa spesifik ozelliklerimiz onlari da o feature ler icerisine yazariz geririsini cluster hallediyor ve bura da her bir dizimize ait spesifk name, id vs var ise onlari foreach ile dondurerek alabiliriz
  Ve tiklandigi zaman burasi hem animasyonu  hem padding i ayarliyor hem de tekrar dan tiklanan point altindaki noktalar yakinliklarina gore gruplaniyor ve birkez daha  const clusters = new VectorLayer({ tetiklenerek bunlari bir kez daha yakinliklarina gore grupluyor ve ona gore de her grup features un lengthine gore point markalari uzerinde kac adet feature var ise onlari gorecek sekilde geliyor karsimiza

  VE tekrardan gruplanmis olan noktalar dan ornegin uzerinde 4 yazan bir noktaya tikladigmz zaman bu 4 feature a ait datalara erisebiliyoruz ve tekrardan bir zoom-in olmus oluyor her tiklagimzda ve yeniden bir daha yaklasarak birbrine yakinliklarina gore bir gruplama soz konusu olacaktir  
 
*/