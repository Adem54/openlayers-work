import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import Point from "ol/geom/Point.js";
import LineString from "ol/geom/LineString.js";
import Draw from "ol/interaction/Draw.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Modify from "ol/interaction/Modify.js";
import Select from 'ol/interaction/Select.js';
import { singleClick } from "ol/events/condition";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Text from "ol/style/Text";

import RegularShape from 'ol/style/RegularShape.js';
import Icon from 'ol/style/Icon.js';

import Overlay from 'ol/Overlay.js';

import {getDistance} from 'ol/sphere';
import LatLon from 'geodesy/latlon-spherical.js';
import {toLonLat} from 'ol/proj';
import {transform} from 'ol/proj';
import {getPointResolution} from 'ol/proj';
import {get} from 'ol/proj';

const source = new VectorSource();

let view = new View({
  center: [1070451.7899100096, 8223685.720259543],
  zoom: 7
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: view
});




let polyCoords = [
  [
   [816876.2628476555, 6547692.4899035385],
   [1097695.9539145145, 6337923.564046366],
   [701841.6906033999, 6185671.924311323],
   [624024.185849933, 6425891.178115503],
     [816876.2628476555, 6547692.4899035385],
  ],
];

let polyCoords2 = [[
 [2224522.1101688095, 5854811.401793875],
[1906135.8712262376, 5423825.151517955],
[2810818.720904521, 5093790.635540899],
 [3129204.959847093, 5602432.066046715],
[2224522.1101688095, 5854811.401793875],
]
]



let lineCoords = [
 [1253330.9634214486, 6683027.280779134],
 [1510467.0660850785, 6743927.936673151],
 [1595051.3103823252, 6858962.508917406],
 [1733769.47102981, 6916479.795039535],
];


let lineCoords2 = [
 [2269602.9872447476, 6740173.340662673],
 [2336505.881373996, 6522261.064219243],
 [2137708.826916475, 6331109.938135675],
 [1705707.311134959, 6443889.022314776],
];

const featureLine2 = new Feature({
 geometry: new LineString(lineCoords2),
 name: "My Line2",
 mytitle:"featureLine2",
 id:1,
});


let pointCoords = [1598434.680154215, 6473258.354921961];
let pointCoords2 =[1525055.1330004458, 6185855.128569698];
let pointCoords3 =[443929.80493491306, 5957155.539940451];
let pointCoords4 = [744785.9482653667, 6952671.396326587];
let skienCoords = [1070451.7899100096, 8223685.720259543];


const skienpointFeature = new Feature({
  geometry: new Point(skienCoords),
  name:"skien",
  id:2,
 });
 
 
 

const featurePolygon2 = new Feature({
 geometry: new Polygon(polyCoords),
 name:"featurePolygon2",
 id:2,
});



const featurePolygon3 = new Feature({
 geometry: new Polygon(polyCoords2),
 name:"featurePolygon3",
 id:3,
});

let lineStringStyle = new Style({
  stroke:new Stroke({
    color:[89, 88, 88,1],
    width:2
  })
})

let featurePolygonStyle2=new Style({
  fill:new Fill({// fill styling for polygon styling
    color:[16, 12, 245,1],//son color transaprencydir..
  }),
});

featurePolygon2.setStyle(featurePolygonStyle2);
featurePolygon3.setStyle(featurePolygonStyle2);


//new Point(labelCoords),
const featureLine = new Feature({
  geometry: new LineString(lineCoords),
  name: "featureLine",
  featureLine:"featureLine",
  id:4
});

featureLine.setStyle(lineStringStyle);
featureLine2.setStyle(lineStringStyle);

const featurePoint = new Feature({
   geometry: new Point(pointCoords),
   name: "featurePoint",
   id:5,
});

// featurePoint.setGeometryName("featurePoint");
featurePoint.setId("featurePointID");
featurePoint.set("title","featurePointTitle");


const featurePoint2 = new Feature({
  geometry: new Point(pointCoords2),
  name: "featurePoint2",
  id:6
});

// featurePoint2.setGeometryName("featurePoint2");
featurePoint2.setId("featurePoint2ID");
featurePoint2.set("title","featurePoint2Title");

const featurePoint3 = new Feature({
  geometry: new Point(pointCoords3),
  name: "featurePoint3",
  id:7
});

// featurePoint3.setGeometryName("featurePoint3");
featurePoint3.setId("featurePoint3ID");
featurePoint3.set("title","featurePoint3Title");

const featurePoint4 = new Feature({
  geometry: new Point(pointCoords4),
  name: "featurePoint4",
  id:8
});

// featurePoint4.setGeometryName("featurePoint4");
featurePoint4.setId("featurePoint4ID");
featurePoint4.set("title","featurePoint4Title");

let features = [featurePoint,featurePoint2,featurePoint3,featurePoint4, skienpointFeature, featureLine, featureLine2, featurePolygon2,featurePolygon3];

let pointFillStyle = new Fill(
  {
    color:[247,26,10,1],
  });

  let strokeStyleForPoint = new Stroke(
  {
    color:[247,26,10,1],
    width:2
  });


  let pointFillStyle2 = new Fill(
    {
      color:[201, 184, 30,.4],
    });
  
    let strokeStyleForPoint2 = new Stroke(
    {
      color:[201, 184, 30,.4],
      width:2
    });

  let defaultPosStyle = new Style({
    image:new CircleStyle({
      fill:pointFillStyle,
      radius:3,
      stroke:strokeStyleForPoint,
    })
  })

  const circleRadius = 100; // Radius in meters
  const centerCoordinates = skienpointFeature.getGeometry().getCoordinates();
  view = map.getView();
  const resolution = map.getView().getResolution();
  console.log("RESOLUTION: ",resolution);
  const mapProjection = view.getProjection();

  const desiredProjection = get('EPSG:4326');

  const transformedCenterCoordinates = transform(centerCoordinates, mapProjection, desiredProjection);
  
  const radiusInPixels = (circleRadius / resolution);
 
  console.log("radiusInPixels: ", radiusInPixels);

  let radiuss =(circleRadius / getPointResolution(mapProjection, resolution, centerCoordinates));
  console.log("RADIUSSS: ",radiuss)


  let circleStyle2 = new CircleStyle({
    fill:pointFillStyle2,
    radius:10,
   // radius:radiuss,
    stroke:strokeStyleForPoint2,
  });
  let defaultPosStyle2 = new Style({
    image:circleStyle2
  })

  view.on("change:resolution", function(event){
    console.log("ZOOM-", view.getZoom());
    console.log("getRadius: ",circleStyle2.getRadius());
  })

  features.forEach(feature=>feature.setStyle([defaultPosStyle, lineStringStyle , featurePolygonStyle2]))
//defaultPosStyle2
skienpointFeature.setStyle([defaultPosStyle,defaultPosStyle2]);


source.addFeatures([...features]);

const vectorLayer = new VectorLayer({
  source: source,
 title :'MyVectorLayer',
//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
//style,
 
});


map.addLayer(vectorLayer)


//coook onemli...
//Point in style olarak cizdigmiz radius un metre cinsinden degerine bu sekilde erisebiliyoruz...
let mapResolution = view.getResolution();
console.log("mapResolution: ", mapResolution);
let projection = view.getProjection();
console.log("projection: ",projection)

const meterPixel = getPointResolution(projection, mapResolution, view.getCenter() );
//view a da map.getView() ile erisebiliriz

const radiusInMeters = circleStyle2.getRadius() * meterPixel;

console.log('Radius in meters:', radiusInMeters);
console.log('Radius in meters22:', 20 * meterPixel);

/*
1-Biz iki point arasindaki mesafeyi hesaplayabiliyoruz
2-Biz bir point in circle-style ile stilinin daire olarak mesafesini ne kadar alan kapladigni hesaplayabiliyoruz
3-Biz iki point in style-daire-circle larindan dolayi birbiri uzerine gelip gelmediklerini cakisip cakismadiklarini da hesaplayabiliyoruz..
4-Biz bir pointimzin etrafindaki diger pointlerden hangileri ile style-circle larinin cakisip cakismadigni da bulabiliyoruz 
5-Radius degerini de metreye de cevirebiliyoruz..
6-Biz normalde, iki nokta arasindaki uzakligi hesplarken o iki nokta da bir de circle style lar dan dolayi kapladiklari alan da daha genis ise o biz radius larin degerlerini kullanarak islem yapiyoruz...ANCAK...BURDA SUNU IYI BILELIM..BURDA RADIUS DEGERI RADIUS-CIRCLE I OLUSTURAN PIXELLERIN NUMARA DEGERIDIR, VE GERCEK DAIRE NIN HARITADAKI GERCEK BOYUTU O AN KULLANILAN ZOOM- DEGERINE VE MAP-HARITANIN RESOLUTION UNA GORE DE DEGISKENLIK GOSTERIR
PIXEL NUMARA DEGERININ DE, KULLANILAN CIHAZ A VEYA EKRANA GORE GORECELI OLDUGUNU VEYA EKRAN YOGUNLUGUNA GORE DEGISEBILECEGINI UNUTMAMAK GEREKIR
BIR HARITA DA BIR PIXEL I TEMSIL EDEN GECEK FIZIKSEL MESAFE, HARITANIN PROJEKSIYON VE ZOOM-DEGERI NE BAGLDIR


https://chat.openai.com/c/92c080f5-f6b4-47f6-bd9f-1696bd039ad4
https://chat.openai.com/c/11e4ae20-ee98-439a-aafd-1c00042d69d3
https://chat.openai.com/c/73110a5f-a0ff-46c5-9df5-676edcde88b9

EGER METRE VEYA KILOMETRE GIBI, BELIRLI BIR GERCEK DUNYA BIRIMI ILE CALISMAMIZ GEREKIYORSA, MAP-RESOLUTION(HARITA COZUNURLUGU) VE PRJECTION KULLANILARAK PIKSELLER ILE ISTEDIGINIZ BIRIM ARASINDA DONUSUM YAPMAMIZ GEREKEBILIR.
NORMALDE IKI NOKTA ARASINDAKI UZAKLIGI BIZE METRE CINSINDEN VERILIYOR DIREK OLARAK ZATEN.. 

AYRICA BIR POINT E EN YAKIN DIGER BIR POINT I BULABILIYORUZ...VE ARALARINDAKKI MESAFEYI HESAPLAYABILIYORUZ
https://stackoverflow.com/questions/64994451/how-to-measure-the-distance-from-center-of-a-circle-to-the-edge-in-openlayers
var point1 = point.getGeometry().getCoordinates();
var point2 = circle.getClosestPoint(point1);


*/

const modify =  new Modify({source:source})
map.addInteraction(modify);

//Modify-end de parametreye event geliyor ve o event ile event.features diyerek bir collection icerisinde o an uzerinde degisiklik yaptgimz feature-geometry point hangisi ise ona ait olan, feature icerisinde olan event.features e erisiyoruz ve bu event.features i foreach ile dondurerek de o an uzerinde modify yaptigmz feature e erisebiliyoruz.. 


let isCondition = false;
let getDistance3 ;
modify.on("modifyend", function(event){
 // console.log("features-length: ", event.features.getLength())
 console.log("MODIFY-END");

  event.features.forEach(feature=>{
    console.log("featureid: ", feature.getId())
    console.log("featureName: ", feature.get("name"))
    console.log("featureCoordinates-MODIFYEND: ", feature.getGeometry().getFlatCoordinates())

    //BU SEKILDE SON POZISYONUNU KOORDINATLARINI ALABILIYORUZ..  VE BU AYNI SEKILDE FEATURE.GETGEOMETRY().GETFLATCOORDINATES() ILE AYNIDIR
    let lastPos = feature.getGeometry().getLastCoordinate();

    

    console.log("lastPost: ",lastPos);

    //[828737.1588656809, 8201364.926621805]-first coordinates for featurePoint5

    let coords1 = [1070451.7899100096, 8223685.720259543];
    let coords2 = feature.getGeometry().getFlatCoordinates();

    let result3 = toLonLat(coords1,"EPSG:3857");
    let result4 = toLonLat(coords2 ,  "EPSG:3857");
     getDistance3 = getDistance(result3, result4).toFixed(2); 
  
    console.log("getDistance3: ",getDistance3);
  

    //skienCoords - BURDA GUNCELLEME YAPALIM...VEYA YAPMAYA CALISALIM....NASIL YAPARSAK 
    //Burda eger ki condition saglanmiyorsa ki burda...mesafeyi olcup..ornegin eger 100 metre den oteye gidiyorsa o zamn ona izin verme tekrar kendi baslangic noktasina getir otomatik diyebiliriz
 //   if(!isCondition){
     // feature.getGeometry().setCoordinates(skienCoords);
//    }else{

      const createFeatureLine = new Feature({
        geometry: new LineString([skienCoords,lastPos]),
        name: "featureLine",
        featureLine:"featureLine",
        id:4
      });
      createFeatureLine.setStyle(lineStringStyle);
      source.addFeature(createFeatureLine);
 //   }

  })
})

modify.on("modifystart", function(event){
  console.log("MODIFY-START");
})

modify.on("change",function(event){
  console.log("CHANGE:");

})

//Tikladigmiz

map.on("pointermove", function(event){
  console.log(event.coordinate)
 // map.addInteraction(modify);

})



let popup =  document.querySelector("#popup");

let overlayLayer = new Overlay({
  element:popup,
});

map.addOverlay(overlayLayer);

let content = document.querySelector("#content");


map.on("click", function(event){
  console.log(event.coordinate)
  let clickedCoordinate = event.coordinate;
  //map.removeInteraction(modify);
  overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(event.pixel, function(feature,layer){
      overlayLayer.setPosition(clickedCoordinate);
    //  content.innerHTML = clickedCoordinate;
      if(getDistance3 > 0)content.innerHTML = getDistance3;
    
    })

})

// map.on("pointermove", function(event){
//   console.log(event.coordinate)
//   let clickedCoordinate = event.coordinate;
//   //map.removeInteraction(modify);
//   overlayLayer.setPosition(undefined);
//     map.forEachFeatureAtPixel(event.pixel, function(feature,layer){
//       overlayLayer.setPosition(clickedCoordinate);
//       content.innerHTML = clickedCoordinate;
//     })

// })


//EN SON CHAT-GPT DEKI SONUCU  IYI INCELEYELIM....
// Define the coordinates for Skien and Kristiansand
const skien = new LatLon(59.2149, 9.6085);
const kristiansand = new LatLon(58.1462, 7.9950);

// Calculate the distance between Skien and Kristiansand using the Vincenty formula
const distance = skien.distanceTo(kristiansand);

console.log('Distance:', distance, 'meters');

//COORDINATE SISTEMINDEN LONG-LAT E CEVIRIRKEN LONLAT KULLANIRSAK O ZAMAN EPSG:3857 VERIRIZ VE CEVIRDIKTEN SONRA, DIZI ICINDEKI 0.INDEX LONGTITUDE , 1.INDEX LATITUDE DIR BU DEGERLERE GORE, BIZ NEW LATLON KULLANARAK(1.LONG- 2.LAT) KULLANACAK SEKILDE AYARLARIZ... VE BU SEKILDE DISTANCE LERI BULABILIRIZ..
let coords11 = [1070451.7899100096, 8223685.720259543];
let result = toLonLat(coords11,"EPSG:3857");
let result2 = transform(coords11,'EPSG:3857', 'EPSG:4326');
console.log("result2: ",result2)
console.log("result: ",result)
let long = result[0];
let lat = result[1];

const skien1 = new LatLon(lat, long);
const kristiansand1 = new LatLon(58.1462, 7.9950);

const distance2 = skien1.distanceTo(kristiansand1);

console.log('Distance:', distance2, 'meters');
