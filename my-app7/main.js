import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Polygon from 'ol/geom/Polygon.js';
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import Collection from 'ol/Collection.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

let pointCoords=[1071123.3720932864, 8216732.006690305];
const featurePoint = new Feature({
  geometry: new Point(pointCoords),
  name: 'point-1',
});

let lineCoords=[[1070710.1344091198, 8216789.334461524],[1070351.835839033, 8216932.653889563],[1070062.8083258297, 8216669.901604833],[1069735.5622984837, 8216860.994175543]];
const featureLine = new Feature({
  geometry: new LineString(lineCoords),
  name: 'line-1',
});

let polygonCoords=[[[1069795.278726832, 8216493.140976922],[1069672.2628844357, 8216612.573833618],[1069865.7441122825, 8216625.711447847],
[1069795.278726832, 8216493.140976922]]];
const featurePolygon = new Feature({
  geometry: new Polygon(polygonCoords),
  name: 'polygon-1',
});

  var features=new Collection(featurePoint,featureLine,featurePolygon);
 const source = new VectorSource({features:[featurePoint,featureLine,featurePolygon]}  );
  
const vector = new VectorLayer({
  source: source,
  visible:true,
 
});


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
map.addLayer(vector)


//[1071123.3720932864, 8216732.006690305]  point
/*
[[1070710.1344091198, 8216789.334461524],[1070351.835839033, 8216932.653889563],[1070062.8083258297, 8216669.901604833],[1069735.5622984837, 8216860.994175543]]  line

[[[1069795.278726832, 8216493.140976922],[1069672.2628844357, 8216612.573833618],[1069865.7441122825, 8216625.711447847],
[1069795.278726832, 8216493.140976922]]] polygon


*/