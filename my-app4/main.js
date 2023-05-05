import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import Point from "ol/geom/Point.js";
import LineString from 'ol/geom/LineString.js';
import VectorLayer from 'ol/layer/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import Modify from 'ol/interaction/Modify.js';
import Style from 'ol/style/Style.js';
import Stroke from 'ol/style/Stroke.js';
import Fill from 'ol/style/Fill.js';
import { singleClick } from "ol/events/condition";

import Select from 'ol/interaction/Select.js';


const map = new Map({
   target: "map",
   layers: [
      new TileLayer({
         source: new OSM(),
      }),
   ],
   view: new View({
      center: [0, 0],
      zoom: 2,
   }),
});

const polyCoords = [
   [
      [-2.5552650340376317, 41.78167628449711],
      [-4.96320105094938, 42.18266623410145],
      [-4.440301327221476, 40.875566932669415],
      [-2.5552650340376317, 41.78167628449711],
   ],
];

const labelCoords = [-7.493942488365946, 43.51012944221304];

const lineCoords = [
   [-6.37157955635837, 42.812519829809446],
   [-7.585392171844461, 42.85513212331966],
   [-7.546653471350027, 42.303656972987966],
   [-6.607239984365407, 42.33230113713583],
   [-6.394177131646785, 42.672640241418605],
];

const feature = new Feature({
   geometry: new Polygon(polyCoords),
   labelPoint: new Point(labelCoords),
   //Yeni bir geometry set etmisiz ve ismini de labelPoint yapmisiz yani bu demektir ki, biz feature.getGeometryName() dedigmizde artik en son hangisi set edildi ise o simi bize geri dondurecektir
   labelLine:new LineString(lineCoords),
   name: "My Polygon",
   title:"my-feature"
});

// get the polygon geometry
const poly = feature.getGeometry();
console.log("poly: ", poly.getCoordinates()); //Bu da girdimz polygon coordinatlaridir....
console.log("polygeomname: ", feature.getGeometryName()); //geometry default olarak ismi geometry dir

// Render the feature as a point using the coordinates from labelPoint
feature.setGeometryName("labelPoint");//Feature icinde kulandimgiz property ismi olan labelPointi kullanmaliyiz
//eger biz setGeometryName diye labelPointi atamamis olsa idik o zaman da asagida, biz feature.getGeometry().getCoordinates() dedigmiz zaman, default olarak feature objesi icinde geometry properties i karsisinda new Polygon oldugu icin ona ait koordinatlari alabilirdik ancak, biz istedikki point koordinatlari da alalim, tab i bunun icin once, getometryName i set ettik, yeni bir getometry name verdik once sonra da artik, getGeometry biz hangi geometryName i set edersek onun koordinatlarini getirecektir....
//Simdi bizim setGeometryName i kaldirip console sonuclarini incelemeliyiz birde kullanarak o zaman farki daha iyi anlayacagiz...
// get the point geometry
const point = feature.getGeometry();
console.log("point: ", point.getCoordinates());
//Bu sekilde labelCoordinates imzi almis olduk...
console.log("pointgeomname: ", feature.getGeometryName());
//pointgeomname:  labelPoint

//Simdi bizim setGeometryName i kaldirip console sonuclarini incelemeliyiz birde kullanarak o zaman farki daha iyi anlayacagiz...

feature.setGeometryName("labelLine");
const line = feature.getGeometry();
console.log("line: ", line.getCoordinates());//lineCoords coordinatlarini geirir
//Bu sekilde labelCoordinates imzi almis olduk...
console.log("linegeomname: ", feature.getGeometryName());
//linegeomname:  labelLine

console.log(feature.get("name"));//My Polygon
console.log(feature.get("title"));//my-feature
feature.set("name","my-name");
console.log(feature.get("name"));//my-name
feature.set("title","my-title");
console.log(feature.get("title"));//my-title



//Style for polygons
const fillStyle=new Fill({
  color:[40,119,247,1]
})

//style for lines
const strokeStyle=new Stroke({
width:1.2,//cizgilerin kalinligini veriyoruz
lineCap:"square",//cizgilerin bittig yerller yuvarlak mi olsun, kareli mi bitsin...bunu ancak widht i kalinlastirinca farkederiz..default olarak round shape gelir
//joins-koselerin de nasil olacagini belirleyebilirz
//sharp degil,keskin degil
lineJoin:"bever",
//lineDash:[1,6],//dashed-line yapar, first-one size, second distance between dots 
})


const testVectorGeoJSON =new VectorLayer({
  source:new VectorSource({
    url:"./data/vector_data/test.geojson",//url bize datamizi verecek, cekecek ya bu sekilde bir data kaynagindan indirilen bir geojson data kaynagi ya da direk url uzaktan datayi fetch ededebilir
    format:new GeoJSON(),
  }),
  visible:true,
  title:"testVectorGeoJSONLayer",
  style:new Style({
    fill:new Fill({
         color:[247,26,10,1]
    }),
    fill:fillStyle,//polygonlarimizi stillendirmis olduk bu  sekilde
    stroke:strokeStyle,
  })
})
map.addLayer(testVectorGeoJSON);


const selectInteraction=new Select({
  condition:singleClick,
})

map.addInteraction(selectInteraction);

const modifyInteraction=new Modify({
  condition:singleClick,
  source:testVectorGeoJSON.getSource(),
  //Bu sekkilde biz secilen tum kaynagi modifiye edilmeye hazir hale getiriyoruz bunun yerine kullanicinin sectigi, ozelligin degistirilmesini istiyoruz....
  features:selectInteraction.getFeatures(),
  /*The features the interaction works on. If a feature collection is not provided, a vector source must be provided with the source option.
  Yani diyorki sen eger bir feature vermezsen o da gider o zaman source de ne verdi isen ordaki features larin hepsi icin modify islemini yapmaya izin verir diyor
  Biz burda kullanici neyi secmis ise onu modify et diyecegiz
  ol.interaction.Select teki getFeatures methodunu kullancagiz....
  */
})
//modify icerisinde bir de feature options i var biz onu kullanacagiz, biz bu feature ile ne yi saglayacagiz secilen feature i n sadece mofifiy edilmesini saglayacagiz, features: degeri ol.interaction.Select ten gelecek
//Burda tabi ki select interaction i devreye girecek cunku secilen, feature sadece modify edilsin istiyoruz

map.addInteraction(modifyInteraction);

console.log(testVectorGeoJSON.getSource());