import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import TileSource from 'ol/source/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
//Layer source for the OpenStreetMap tile server.
import LayerSwitcher from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group.js';
import MousePosition from 'ol/control/MousePosition.js';
import {format} from 'ol/coordinate.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Overlay from 'ol/Overlay.js';
import $ from "jquery";
import Control from 'ol/control/Control.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import CircleStyle from 'ol/style/Circle.js';
import Draw from 'ol/interaction/Draw.js';
import Polygon from 'ol/geom/Polygon.js';
import LineString from 'ol/geom/LineString.js';
import {getArea, getLength} from 'ol/sphere.js';
import DragBox from 'ol/interaction/DragBox.js';
import {getCenter} from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON.js';

let mapView =new View({
  center: fromLonLat([78.766032, 23.7662398]),
  zoom: 4.5
});
const map = new Map({
  target: 'map',
  // layers: [
  //   new TileLayer({
  //     source: new OSM()//OSM demek Open Street Map demektir
  //   })
  // ],
  view: mapView,
  controls:[]
});

//BESTPRCTISE..HEM GROUP YAPIYORUZ HEM DE TYPE KULLANGIMZ ICIN RADIO BUTTON OLARAK GOSTERILECEKTIR MAP TE, EGER TYPE KULLANMAZ ISEK O ZAMAN DA CHECKBOX OLARK GOSTERECEK... RADIO BUTTON FONKSIYONUNU TYPE OPTION I ILE SAGLIYORUZ
let noneTile = new TileLayer({
  title:"None",
  type:"base",
  visible:false
});

let osmTile = new TileLayer({
  title:"Open Street Map",
  type:"base",
  visible:true,
  source:new OSM()
});
//map.addLayer(osmTile);

//Creating Group layer 
//ol/layer/Group~LayerGroup
let baseLayerGroup = new LayerGroup({
  title:"Base Maps",
  fold:"close",//false da olablir
  layers:[
    noneTile,osmTile
  ]
});

map.addLayer(baseLayerGroup);



//IndiaStateBoundary7Tile
let IndiaAdm1StateTile = new TileLayer({
  title:"India States",
  source:new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
//geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
params:{"LAYERS":"geo-demo:ind_adm12_pg","TILED":true},
//hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",

visible:true
  })
});

//polbnda_ind_pg4
let IndiaPolbnda_Ind_Pg4Tile = new TileLayer({
  title:"India Districts",
  source:new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
//geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
params:{"LAYERS":"geo-demo:polbnda_ind_pg","TILED":true},
//hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",
visible:true
  })
});

// map.addLayer(IndiaPolbnda_Ind_Pg4Tile);
// map.addLayer(IndiaAdm1StateTile);

let overlayLayerGroup = new LayerGroup({
  title:"Overlays",
 // fold:true,
  fold:"open",
  layers:[
   IndiaPolbnda_Ind_Pg4Tile , IndiaAdm1StateTile  
  ]
});

map.addLayer(overlayLayerGroup);

//layer lardan hangisi en altta eklenirse o en uste gelecektir bunu bilelim yani su anda en ustte IndiaAdm1StateTile gozukecektir ve biz layerlarimiz arasidna priority da yapabiliyoruzo....
//Geo server dan alacagimz datalarimiz WMS geoserver tile dir

//KULLANILAN DATABASE-TABLES BILGILERI
//POSTGRES SQL- dbname=test2 - GeoServer da store=geo-demo
//Tables = india_state_boundary_pg - geo-demo:india_state_boundary_pg7 / polbnda_ind_pg - geo-demo:polbnda_ind_pg4

/*
Adding Layer Switcher in Web Map Application
*/
//npm install layerswticher- npm install jquery
var layerSwitcher = new LayerSwitcher({
  reverse: true, // Reverses layer order in the switcher
  groupSelectStyle: 'group', // Select style for groups: 'none', 'children', 'group' (default)
  activationMode: 'click', // Switcher activation mode: 'click' or 'hover' (default)
  startActive:false // Whether the switcher should start active or not (default is false)-false means when we open the application it will not be active
});

 map.addControl(layerSwitcher);

 //WEB FEATURE SERVICE-LAYER ADD
 //Web Feature Service ile biz tamamen apayri bir layer olusturuyoruz...oncelikle bunu bilelim ve bu uzaktan gelen bir request sonucunda geldigi icin gelmesi zaman aliyor birazcik...
 //Bu url geoserver layerpreview e tiklayinca 	geo-demo:ind_adm12_pg isimli layer da en sagda select one daki optiondan  WFS altindaki geojson formati secilince karsimza gelen data nin url idir
let wfs_url = 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&outputFormat=application%2Fjson';

let lineStringStyle = new Style({
  stroke:new Stroke({
    color:[232, 220, 0,1],
    width:2
  })
})

 let geoJson = new VectorLayer({
  title:'WFS_layer',
  source: new VectorSource({
    url:wfs_url,
    format: new GeoJSON(),//geojson veya dier WFS formatiindan birini kullanabiliriz, bu optionslari geoserver da layerpreview da layer select-option da gorebiliriz
    style:lineStringStyle
  })
 })

 map.addLayer(geoJson);

 //1-pop up alanini gostercegmiz html elementinin referansini aliriz once...
   const overlayContainerElement=document.querySelector(".overlay-container");			
 //2-Sonra overlayimizi olustururuz
 
 const overlayLayer=new Overlay({
   element:overlayContainerElement,
 })
 //3-overlayerimizi mapimze ekleriz
 map.addOverlay(overlayLayer);

   const overlayFeatureName=document.getElementById("feature-name");
  const overlayFeatureAdditionalInfo=document.getElementById("feature-additional-info");



 map.on("click",function(event){
  console.log(event.coordinate);
  var feature = map.forEachFeatureAtPixel(event.pixel,
    function(feature,layer){
      return feature;
    } )

    if(feature){
      overlayLayer.setPosition(undefined);
       var geometry = feature.getGeometry();
       console.log("feature.getKeys: ",feature.getKeys())
       //ISTE BURDA WFS SERVICE UZERINDEN TUM ATTRIBUTE LERE TUM DATALARA ERISIMIS OLUYORUZ GEOSERVER UZERINDEN...
       let name_1 = feature.get("name_1");
       let type_1 = feature.get("type_1");
       let clickedCoordinate=event.coordinate;
       if(name_1 && type_1){
        overlayLayer.setPosition(clickedCoordinate);
          overlayFeatureName.innerHTML=`name: ${name_1}`;
          overlayFeatureAdditionalInfo.innerHTML=`type: ${type_1}`;
       }
       console.log("feature.getName: ",feature.get("name_1"))
       console.log("featuregetType: ",feature.get("type_1"))
       console.log("feature.getvarname_1: ",feature.get("varname_1"))
    }
})

//GEOJSON...AYRI BIR FILE OLARAK DA KULLANABILIYORUZ...OPENLAYERS DA AMA GEOSEERVER BIZE BUNU BIR WFS SERVICE I OLARAK SUNUYOR HARIKA BIR BESTPRACTISE....
//Biz burda geojson ile WFS service si araciligi ile geoserver dan bu sekilde layer in datalarina erisebiliyoruz..ki biz geoserver datasini alip bir dosyaya kaydederek de ayrica openlayers icerisinde kullanabiliyoruz bunu da unutmayalim....


