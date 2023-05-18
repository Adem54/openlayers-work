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


const source = new VectorSource();


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [869377.2521735579, 8781200.278391138],
    zoom: 4
  })
});


let pointCoords = [661450.5454008542, 8071352.732354876];
let pointCoords2 =[1113975.7426861217, 9160327.938685613];
let pointCoords3 =[1603765.6897488562, 10320515.405098626];
let pointCoords4 = [744785.9482653667, 6952671.396326587];


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

let features = [featurePoint,featurePoint2,featurePoint3,featurePoint4];

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

  let defaultPosStyle2 = new Style({
    image:new CircleStyle({
      fill:pointFillStyle2,
      radius:16,
      stroke:strokeStyleForPoint2,
    })
  })

  features.forEach(feature=>feature.setStyle([defaultPosStyle,defaultPosStyle2]))

source.addFeatures([...features]);

const vectorLayer = new VectorLayer({
  source: source,
 title :'MyVectorLayer',
//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
//style,
 
});


map.addLayer(vectorLayer)

map.on("click", function(event){
  console.log(event.coordinate)
})