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
import { Circle } from "ol/geom";
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';



let minX=[-482448.8844272373, 6948537.808663547];
let minY=[1243954.0938784746, 5418990.528870807];
let maxX=[2855125.4802697455, 6736944.794138221];
let maxY= [1067306.316037831, 7855455.623686972];


const source = new VectorSource();
const vector = new VectorLayer({
   source: source,
});

const map = new Map({
   target: "map",
   layers: [
      new TileLayer({
         source: new OSM(),
      }),
      vector,
   ],
   view: new View({
      center: [1598434.680154215, 6473258.354921961],
      zoom: 6,
      extend:[minX,minY,maxX,maxY]
     
   }),
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

let lineCoords = [
  [1253330.9634214486, 6683027.280779134],
  [1510467.0660850785, 6743927.936673151],
  [1595051.3103823252, 6858962.508917406],
  [1733769.47102981, 6916479.795039535],
];


/*
[
    [2269602.9872447476, 6740173.340662673]
1
: 
(2) [2336505.881373996, 6522261.064219243]
2
: 
(2) [2137708.826916475, 6331109.938135675]
3
: 
(2) [1705707.311134959, 6443889.022314776]
]
*/
let lineCoords2 = [
  [2269602.9872447476, 6740173.340662673],
  [2336505.881373996, 6522261.064219243],
  [2137708.826916475, 6331109.938135675],
  [1705707.311134959, 6443889.022314776],
];

const featureLine2 = new Feature({
  geometry: new LineString(lineCoords2),
  name: "My Line2",
});


let pointCoords = [1598434.680154215, 6473258.354921961];

const featurePolygon = new Feature({
   geometry: new Polygon(polyCoords),
   name: "My Polygon",
});
//new Point(labelCoords),
const featureLine = new Feature({
   geometry: new LineString(lineCoords),
   name: "My Line",
});

const featurePoint = new Feature({
   geometry: new Point(pointCoords),
   name: "My Point",
});

let features = [featurePoint, featureLine, featurePolygon];
source.addFeatures([...features]);

//1-Sonradan herhangi bir feature e eklemenenin yollarindan biri bu
//source.addFeature(featureLine2);

//2. Sonradan bir feature eklemenin baska bir yolu da budur
source.addFeatures([featureLine2]);



let polygonInteraction;
let lineInteraction;
let pointInteraction;
let selectInteraction;

selectInteraction = new Select({
  condition:singleClick,//burayi hover, veya daha farkli sekillerde select interaction ini calistarabiliriz..
  style:new Style({
    fill:new Fill({//polygon
      color:[255,255,0,0.5],
    }),
   image:new CircleStyle({//point
    fill:new Fill({
      color:[247,26,10,1],
    }),
    radius:12,
    stroke:new Stroke({
      color:[255,255,0,1],
      width:2,
     }),
   }),
   stroke:new Stroke({//line
    color:[255,255,0,1],
    width:4,
   }),
 })
}
)

map.addInteraction(selectInteraction);


let modifyInteraction=new Modify({
 // source,
  features: selectInteraction.getFeatures(),
  // feature:selectInteraction?.getFeatures(),
  //hitDetection:false,
  //snapToPointer:true
})

map.addInteraction(modifyInteraction);
//modifyInteraction.removePoint();

map.on("click",function(event){
  console.log("coord:",event.coordinate)
})
document.getElementById("polygon").addEventListener("click",function(){
  polygonInteraction=new Draw({
    type:"Polygon",
    source:source,
    // finishCondition:function(event) { return confirm("Are you sure?"); },	
    
  })
  
  map.addInteraction(polygonInteraction);
  
  polygonInteraction.on("drawend",function(event){
    map.removeInteraction(pointInteraction);
    map.removeInteraction(lineInteraction);
    map.removeInteraction(selectInteraction);
    console.log("Drawend triggerd");
    polygonInteraction.abortDrawing();
    console.log("POLYGONcoordinates: ",event.feature.getGeometry().getCoordinates());
   
  })
})




document.getElementById("point").addEventListener("click",function(){
  map.removeInteraction(polygonInteraction);
  map.removeInteraction(lineInteraction);
  map.removeInteraction(selectInteraction);
  pointInteraction=new Draw({
    type:"Point",
    source,
   }) 
  
  
  map.addInteraction(pointInteraction);

  function pointInteractionCallback(event)
  {  
    console.log("PointCoorddd: ",event.feature.getGeometry().getCoordinates())
  }
  
   pointInteraction.on("drawend",pointInteractionCallback);
})

document.getElementById("line").addEventListener("click",function(){
  map.removeInteraction(polygonInteraction);
  map.removeInteraction(pointInteraction);
  map.removeInteraction(selectInteraction);
  lineInteraction=new Draw({
    type:"LineString",
    source,
   }) 
  
  
   map.addInteraction(lineInteraction);
   lineInteraction.on("drawend",function(event){
    console.log("lineCoord: ",event.feature.getGeometry().getCoordinates())
   })
})

document.getElementById("remove").addEventListener("click",function(event){
      map.removeInteraction(pointInteraction);
      map.removeInteraction(lineInteraction);
      map.removeInteraction(polygonInteraction);
      map.removeInteraction(selectInteraction);
})


modifyInteraction.on("modifyend",function(event){
  console.log("modifyend end eventt-COOORDINATES",event.features);
  event.features.forEach(feature=>{
      console.log("MODIFYEND COORDINATES: ",feature.getGeometry().getCoordinates());
  })
  console.log("sourcce::")

  //En guncel, features direk source icerisinden erisilebiliyorr....
  source.getFeatures().forEach((feat,index)=>{
    console.log("coordDINAATE IN SOURCEs:::",feat.getGeometry().getCoordinates());
    feat.setId(index+1);
  })

  console.log("sourcce************************")
  let findFeature=source.getFeatures().find(item=>item.getId()===1);
  console.log("findFeature: ",findFeature)

})



document.getElementById("select").addEventListener("click",function(event){
      map.removeInteraction(pointInteraction);
      map.removeInteraction(lineInteraction);
      map.removeInteraction(polygonInteraction);
     // map.removeInteraction(modifyInteraction);
      
  let style=new Style({
    fill:new Fill({//polygon
      color:[255,255,0,0.5],
    }),
   image:new CircleStyle({//point
    fill:new Fill({
      color:[247,26,10,1],
    }),
    radius:12,
    stroke:new Stroke({
      color:[255,255,0,1],
      width:2,
     }),
   }),
   stroke:new Stroke({//line
    color:[255,255,0,1],
    width:4,
   }),
  });
  
  
  //Select ile secilen vector-geom sinin feature uner erisebiliriz ve onun, style ini degistirebiliriz....
  selectInteraction.on("select",function(event){
    let selectedFeature=event.selected;
    event.selected[0].setStyle(style)
  })
})
//Sadedce direk Selection i bos olarak bile tanimlarsak selection biz herhangi bir

/*

{
     condition:singleClick,
     style:new Style({
        fill:new Fill({
          color:
        }),
       image:new CircleStyle({
        color:"tomato"
       }),
       radius:12,
       stroke:new Stroke({
        color:[247,26,10,1],
        width:2,
       })
     })
  }

*/