import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon.js';
import Point from 'ol/geom/Point.js';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});




let polyCoord=[[
  [1197921.1072852798, 11094987.529649902],
  [4054831.4764720276, 4363637.070744142],
  [-5376886.31769244, 6829189.855110787],
  [1197921.1072852798, 11094987.529649902],

]]; 

let labelCoords=[
  [1253330.9634214486, 6683027.280779134],
  [1510467.0660850785, 6743927.936673151],
  [1595051.3103823252, 6858962.508917406],
  [1733769.47102981, 6916479.795039535],
];


const feature = new Feature({
  geometry: new Polygon(polyCoord),
  name: 'My Polygon',
  //id:1,Bu sekilde disardan id degil sadece bunu name icin kullanabiliyoruz options icinde ama setId diyerek id atayip bu a tadgimizi da getId ile alabiliyoruz....set,get islemlerini Observable oldugu iicn yapabiliuyoruz
});

// get the polygon geometry
const poly = feature.getGeometry();


// Render the feature as a point using the coordinates from labelPoint
//feature.setGeometryName('labelPoint');
console.log(feature.getGeometryName())
console.log(feature.getId());

feature.setId(1);
console.log(feature.getId());

// get the point geometry
const point = feature.getGeometry();