import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Modify from 'ol/interaction/Modify.js';
import Feature from 'ol/Feature.js';
import Polygon from "ol/geom/Polygon.js";
import Point from "ol/geom/Point.js";
import LineString from "ol/geom/LineString.js";


const source = new VectorSource({wrapX: false});
const vector = new VectorLayer({
  source: source,
});
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),vector
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

let polygonInteraction;
let lineInteraction;
let pointInteraction;
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
    console.log("Drawend triggerd");
    polygonInteraction.abortDrawing();
    console.log("POLYGONcoordinates: ",event.feature.getGeometry().getCoordinates());
   
  })
})

map.on("dblclick",function(event){
  console.log("DblClicked")
})


document.getElementById("point").addEventListener("click",function(){
  map.removeInteraction(polygonInteraction);
  map.removeInteraction(lineInteraction);

  pointInteraction=new Draw({
    type:"Point",
    source,
   }) 
  
  
   map.addInteraction(pointInteraction);
   pointInteraction.on("drawend",function(event){
    console.log("PointCoord: ",event.feature.getGeometry().getCoordinates())
   })
})

document.getElementById("line").addEventListener("click",function(){
  map.removeInteraction(polygonInteraction);
  map.removeInteraction(pointInteraction);

  lineInteraction=new Draw({
    type:"LineString",
    source,
   }) 
  
  
   map.addInteraction(lineInteraction);
   lineInteraction.on("drawend",function(event){
    console.log("lineCoord: ",event.feature.getGeometry().getCoordinates())
   })
})


/*
1.Eger polygon veya line ciziminde dblclickl ile sonlandirilmamis ve kullanici gitmis baska butona tiklamis o zaman bizim o butona
tiklayinca kaldir dememiz lazim....interaction i artik kaldir dememiz gerekiyor....
ki oraya kadar cizdigi line veya polygon u kaldirsin....cook onemlidir bu....
Ayrica polygon veya line in cizimini bitrip bitirmedingin de yani dblclick ile cizimi tamamalayip tamamlamadingini da ya drawend interaction event handler funciton i ile ya da map in dblclick event function i  uzerinden kontrol edilebilir...birde hatta finishCondition option i var Draw interactioninin onu da kullanabiliriz

*/


let polyCoord=[[
        [1197921.1072852798, 11094987.529649902],
        [4054831.4764720276, 4363637.070744142],
        [-5376886.31769244, 6829189.855110787],
        [1197921.1072852798, 11094987.529649902],

]]; 


const featurePoly = new Feature({
  geometry:new Polygon(polyCoord),
  id:1,
  });
  console.log("POLYFEATUREYYY: ",featurePoly.getGeometry().getCoordinates());
  
  const modify = new Modify({source: source});

  //btn-modify


  document.getElementById("btn-modify").addEventListener("click",function(event){
    console.log("MODIFYBUTTON CLICKED");
    map.removeInteraction(polygonInteraction);
    map.addInteraction(modify);
  })

  //cancel-modify

  let source2 = new VectorSource({
    features:[featurePoly]
  });
let vector2 = new VectorLayer({
  source: source2,
});

  document.getElementById("cancel-modify").addEventListener("click",function(event){
    console.log("CANCELMODIFY CLICKED");
    map.removeInteraction(polygonInteraction);
    map.removeInteraction(modify)
    //Burda modify incteractioi i kaldirirken baska bir line-feature u ekleyebilirmiyiz...
//MODIFY-UNDO BESTPRACTISE...
    source.removeFeature(source.getFeatures()[source.getFeatures().length-1]);
    console.log("featurePolyyyy: ",featurePoly.getGeometry().getCoordinates());
    source.addFeatures([featurePoly]);
    source.getFeatures().forEach(feature=>{
      console.log("feature:::: ;",feature.getGeometry().getCoordinates());
      console.log("featureIDD:::: ;",feature.id);      
    })
   
    

  })
source.on("addfeature",function(event){
  console.log("ADDFEATURE: ")
  console.log(source.getFeatures());
})

  document.getElementById("btn-test").addEventListener("click",function(event){
    console.log("TEST BTN CLICKED");
    map.removeInteraction(polygonInteraction);
  })

