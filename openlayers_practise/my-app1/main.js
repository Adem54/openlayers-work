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
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom.js';
import DragPan from 'ol/interaction/DragPan.js';
import LayerSwitcherPanel from 'ol-layerswitcher';
import * as olLoadingstrategy from 'ol/loadingstrategy';
import {bbox} from 'ol/loadingstrategy';
import Snap from 'ol/interaction/Snap.js';
import WFS from 'ol/format/WFS.js';
import GML from 'ol/format/GML.js';

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
  source:new OSM(),

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

map.on("click",function(event){
  console.log(event.coordinate);
})

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
visible:true,

  })
});

// map.addLayer(IndiaPolbnda_Ind_Pg4Tile);
// map.addLayer(IndiaAdm1StateTile);

//geo-demo:india_cities

let india_Cities = new TileLayer({
  title:"India Cities",
  source:new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
//geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
params:{"LAYERS":"geo-demo:india_cities","TILED":true},
//hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",
visible:true,


  })
});



let overlayLayerGroup = new LayerGroup({
  title:"Overlays",
 // fold:true,
  fold:"open",
  layers:[
    IndiaPolbnda_Ind_Pg4Tile , india_Cities ,IndiaAdm1StateTile    //
  ]
});

map.addLayer(overlayLayerGroup);

map.getAllLayers().forEach(layer=>{
  if(layer.get("title")){
    console.log("TITLE: ",layer.get("title"))
  }
})




//layer lardan hangisi en altta eklenirse o en uste gelecektir bunu bilelim yani su anda en ustte IndiaAdm1StateTile gozukecektir ve biz layerlarimiz arasidna priority da yapabiliyoruzo....
//Geo server dan alacagimz datalarimiz WMS geoserver tile dir

//KULLANILAN DATABASE-TABLES BILGILERI
//POSTGRES SQL- dbname=test2 - GeoServer da store=geo-demo
//Tables = india_state_boundary_pg - geo-demo:india_state_boundary_pg7 / polbnda_ind_pg - geo-demo:polbnda_ind_pg4

/*
Adding Layer Switcher in Web Map Application
*/

var layerSwitcher = new LayerSwitcher({
  reverse: true, // Reverses layer order in the switcher
  groupSelectStyle: 'group', // Select style for groups: 'none', 'children', 'group' (default)
  activationMode: 'click', // Switcher activation mode: 'click' or 'hover' (default)
  startActive:false // Whether the switcher should start active or not (default is false)-false means when we open the application it will not be active
});

 map.addControl(layerSwitcher);


//Switch -manuel
//switch islemi icin bir fonksiyon olusturuyoruz
//internal-event handler hata veriyor timing den dolayi yani,, html yuklendiginde hala javascript yuklenmedigi icin  tanimiyor

// let checkBoxes = document.querySelectorAll("input[type='checkbox']");
// checkBoxes.forEach(element => {
//       element.addEventListener("click",showCheckedLayer);
// });

// function showCheckedLayer(event){
//   let layername = event.target.value;
//   let checkedStatus = event.target.checked;
//   let layerList = map.getLayers();
//   layerList.forEach(layer=>{
//     if(layer.get("title") == layername){
//       layer.setVisible(checkedStatus);
//     }
//   })
// }

//MOUSE POSITION CURSOR AYARLAMAK
//ol/control/Control~Control
//Subclasses
// Attribution
// FullScreen
// MousePosition ** 
// OverviewMap
// Rotate
// ScaleLine
// ZoomSlider
// ZoomToExtent
// Zoom

//ol/control/MousePosition~MousePosition

// coordinateFormat option una tiklarsak CoordinateFormat fonksiyonunu kullanabilecgeimzi gorebiliriz....
//  CoordinateFormat() coordinate.js, line 14
// A function that takes a Coordinate and transforms it into a {string}.
//Burda biz projectin olarak "ESPG:4326" YAPTIGMIZ ICIN ARTIK COORDINATE FORMATIINI DA LONGTITUDE OG LATITUDE OLARAK ALMAMIZ GEREKECEK
//COORDINATE X-LATITUDE Y-LONGTITUDE YE KARSILIK GELIR
/*
import {format} from 'ol/coordinate.js';
const coord = [7.85, 47.983333];
const template = 'Coordinate is ({x}|{y}).'; normalde dokumantasyonda bu sekilde geliyor ancak biz burda eger EPSG:4326 PROJECKSIIYONUNA CEVIRIRKEN BIZM X VE Y NIN YERINI DEGISTIRMEMIZ GEREKIR BUNU BILMEK COK ONEMLI VE KRITIKTIR....Y-ILK ONCE GELIR-LONGTITUDE E KARSILIK X -LATITUDE E KARSILK OLARAK 2. GELIR
const out = format(coord, template, 2);
// out is now 'Coordinate is (7.85|47.98).'

*/

let digitNumber= 6;//virgulden sonra kac basamak gelsin longtitude ve latitude ye cevrilince

//mousePosition controller default olarak sag ustte geliyor ama biz onu sag ustte degil de sag veya sol altta goremek isteyebilirz boyle durumlarda da class option ini kullanarak istedgimz yerde verdigmz class a style vererek konumlandirabilirz
let mousePosition = new MousePosition({
  className:"mousePosition",
  projection:"EPSG:4326",
  coordinateFormat:function (coordinate){return format(coordinate,'{y} , {x}',digitNumber) }
})

map.addControl(mousePosition);//Artik sag ustte surekli olarak biz mausumuzu gezidridigmiz yerin longtitude-latitude sinin dinamik olarak gosterildgiini gorebiliriz.... 

//ADD-SCALELINE CONTROL... 
//ol/control/ScaleLine~ScaleLine

let scaleLineControl = new ScaleLine({
bar:true,
text:true
});
//bar,text true olunca line artik bar olarak gelecektir
map.addControl(scaleLineControl);
//Bu sekilde ekleigmizde sol altta scale-line buyukluk cubugu yani zoom-in/zoom-out yaptikca ne kadar uzakliktan harita verilerini gordugmuz u veren deger degisecektir

//DEVELOP FEATURE-INFO POPUP IN WEB MAPPING APPLICATION - POPUP DENILDIGI ZAMAN AKLA OVERLAY GELMELIDIR

//ol/Overlay~Overlay

let container = document.querySelector("#popup");
let content = document.querySelector("#popup-content");
let closer = document.querySelector("#popup-closer");

let popupOverlay = new Overlay({
  element:container,
  /* animatinon olsun istiyorsak popuup acilirken o zaman autoPan true yapip animasyon ayarlarini yapariz */
  autoPan:true,
  autoPanAnimation:{
    duration:250
  },
});

map.addOverlay(popupOverlay);

closer.addEventListener("click",closerCallback);

function closerCallback(){
  popupOverlay.setPosition(undefined);//closer ile popup kapatilirken position undefined  yapilirak default haline dondurulerek kapatilir
  closer.blur();
  return false;
}
//HTML DOM Element blur() -  Remove focus from a text field: - document.getElementById("myText").blur();

//start Home control 
let homeButton = document.createElement("button");
homeButton.className = "myButton";
homeButton.innerHTML = `<img src='resources/images/home.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle'></img>  `;
let homeElement = document.createElement("div");
homeElement.className = "homeButtonDiv";
homeElement.appendChild(homeButton);

//CUSTOM CONTROL YAPTIGMIZ ICIN NEW CONTROL ILE OLUSTURUYORUZ... 
//ol/control/Control~Control - import Control from 'ol/control/Control.js';
//This is the base class for controls. You can use it for simple custom controls by creating the element with listeners, creating an instance: const myControl = new Control({element: myElement}); and then adding this to the map.

let homeControl = new Control({
  element:homeElement
});

homeButton.addEventListener("click", ()=>{
  location.href="index.html";//tiklaninca index.html i render ederek default haline getirecek
});

map.addControl(homeControl);

//end home control

//ADDING FULLSCREEN CONTROL 
//start:full screen control

let fsButton =  document.createElement("button");
fsButton.className = "myButton";
fsButton.innerHTML = `<img src='resources/images/full-screen.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px; '></img>  `;

let fsElement = document.createElement("div");
fsElement.className = "fsButtonDiv";
fsElement.appendChild(fsButton);
homeElement.appendChild(fsButton);

let fsControl = new Control({
  element:fsElement
})

//Bu custom control icerisinde yaparken fullscreen control ozellgiini openlayers dan degil, javascrip windows apisinden gelen ozellik uzerinen yapiyor..buraya dikkat edelim.. 
//The Element.requestFullscreen() method issues an asynchronous request to make the element be displayed in fullscreen mode.
//Element.requestFullscreen()
//Bu addEventListener da olan olayin openlayers ile hic ilgisi yok... tamamen javascript-windows api
fsButton.addEventListener("click", ()=>{
  let mapElement = document.getElementById("map");
  if (mapElement.requestFullscreen) {
    mapElement.requestFullscreen();
  } else if (mapElement.msRequestFullscreen) {
    mapElement.msRequestFullscreen();
  } else if (mapElement.mozRequestFullScreen) {
    mapElement.mozRequestFullScreen();
  } else if (mapElement.webkitRequestFullscreen) {
    mapElement.webkitRequestFullscreen();
  }
});

map.addControl(fsControl);

//FEATURE-INFO CONTROLLL 
//start feature info controll
let featureInfoButton = document.createElement('button');
featureInfoButton.className = "myButton";
featureInfoButton.id = "featureInfoButton";
featureInfoButton.innerHTML = `<img src='resources/images/info.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;

let featureInfoElement = document.createElement('div');
featureInfoElement.className = "featureInfoDiv";
featureInfoElement.appendChild(featureInfoButton);
homeElement.appendChild(featureInfoButton);

let featureInfoControl =  new Control({
  element:featureInfoElement
});

let featureInfoFlag = false;
featureInfoButton.addEventListener("click", ()=>{
  featureInfoButton.classList.toggle("clicked");
  featureInfoFlag = !featureInfoFlag;
});

map.addControl(featureInfoControl);

//end feature info controll

//Map te tiklaigmiz nokta da popup olusacagi icin once map e tiklandiginda olusacak olan event tetiklendiginde yapilacaklari olustururuz
map.on("singleclick",function(event){
  console.log("singleclick")
  if(featureInfoFlag){//Sadece featureInfoFlag true oldugunda bize popup i gosterecek ...
    content.innerHTML = '';
    let resolution = mapView.getResolution();//resolution i kullanacagimz icin almamiz gerekiyor
  
    let url = IndiaAdm1StateTile.getSource().getFeatureInfoUrl(event.coordinate, resolution, 'EPSG:3857',{
      'INFO_FORMAT':'application/json',//datayi hangi formatta alacagiz
      'propertyName':'name_1,type_1'//hangi kolonlari alacagiz.. bu source den
    });
  
    if(url){// if url is valid
      $.getJSON(url,function(data){
        
        let feature = data.features[0];
       
        let properties = feature.properties;
      
        //Burasi kullanici info-i iconuna tiklayinca toggle mantiginda calisiyor... 
        console.log("properties:",properties);
        content.innerHTML = '<h3>State: </h3> <p>'+ properties.name_1.toUpperCase() +'</p><br> <h3>Type: </h3> <p>'+ properties.type_1.toUpperCase() +'</p>';
  
        popupOverlay.setPosition(event.coordinate);
      })
    }else{
      popupOverlay.setPosition(undefined);//Eger url yok ise o zaman demektir ki bu almak istdimgiz haritamiz disinda bir alana tiklanmistir o zaman da hicbirsey gosterme default haline gec diyoruz
    }
  }

})

//autoPan	PanIntoViewOptions | boolean (defaults to false)	
// Pan the map when calling setPosition, so that the overlay is entirely visible in the current viewport.
//PanIntoViewOptions a tiklanirsa 
//PanIntoViewOptions{Object}
/*

PanIntoViewOptions{Object}
Properties:
Name	Type	Argument	Default	Description
animation	PanOptions	<optional>
{}	
The animation parameters for the pan

margin	number	<optional>
20	
The margin (in pixels) between the overlay and the borders of the map when panning into view.

PanOptions{Object}
Properties:
Name	Type	Argument	Default	Description
duration	number	<optional>
1000	
The duration of the animation in milliseconds.

easing	function	<optional>
The easing function to use. Can be one from ol/easing or a custom function. Default is inAndOut.

Positioning{'bottom-left'} {'bottom-center'} {'bottom-right'} {'center-left'} {'center-center'} {'center-right'} {'top-left'} {'top-center'} {'top-right'}
The overlay position: 'bottom-left', 'bottom-center', 'bottom-right', 'center-left', 'center-center', 'center-right', 'top-left', 'top-center', or 'top-right'.

*/

//CUSTOM CONTROLS IN OPENLAYERS
//HOME CONTROL-FEATURE INFO CONTROL-FULLSCREEN CONTROL
//HOME CONTROL=> MAP IMZI DEFAULT DURUMA GETIRECEK ZOOM DEGERLERI OLARAK YANI KULLANICI ZOOM IN IN YAPTI HOME A BASTI TEKRAR SAYFA ILK ACILDIGI HALINE DONECEK MAPIMIZ
//FULLSCREEN CONTROL=> ADI USTUNDE MAPIMIZI FULLSCREEN YAPACAK
//FEATURE-INFO CONTROLL=>UZERINE TIKLAYINCA FEATURE-CONTROL YESIL-AKTIF RENK OLACAK VE ARTIK MAPIMIZ UZERINDE TIKLADIMIGZ ALAN ILE ILGILI DETAYLI BILGI POPUP DA GOSTEREECEK AMA FEATURE-INFO CONTROLE TIKLANMADAN GOSTERMEYECEK

//SUNU BILELIM DEFAULT OLARAK GELEN CONTROLS LERIMIZ VAR ZOOM IN-ZOOM OUT GIBI
//DEFAULT OLAN CONTROLS LERI ONCELIKLE KALDIRAGIZ BUNU YAPABILMEK ICIN, CONTROLS U MAP ICINDEKI BILESENLERDE KULLANCAGIZ 
//ONCELIKLE CONTROLS UN MAP A AIT TEMEL BILESENLERDEN OLDUGUNU BILMELIYIZ... VE DIRE MAP ICINDE TARGET,VIEW,LAYERS GIBI KULLANABILIOURZ VE EXTEND EDEBILIYORUZ DEFAULT OLARAK GELEN CONTROLS LERI DISABLED YAPABILIYOURZ VE DAHA BIR COK CUSTOMIZATION ISLEMLERI YAPABILIYORUZ
//controls:[] bu sekilded map icinde bos bir dizi olarak kullaninca zaten default olarak gelen zoom-in-zoom-out gibi controller kaldirilacaktir
/*
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

*/

//full-screen icona tiklayinca fullscreen olurken, esc ye basinca normal position a geliyor

//FULLSCREEN ILE ILGILI OPENLAYERS IN KENDI ICERISINDEKI FULLSCREEN CONTROL INBUILD CLASS UZERINDEN DE YAPABILIRIZ 
//https://openlayers.org/en/latest/examples/full-screen.html
//import {FullScreen, defaults as defaultControls} from 'ol/control.js';

//end:full screen control

//MEASURE LAND AND MEASURE AREA CONTROLLER 
//MEASURE LAND ILE BIZ SECILEN NOKTALAR ARASINDAKI UZUNLUKLARI OLCECEGIZ.. 
//MEASURE AREAA ILE ISE BIZ SECILEN ALAN-AREA NIN SQURE METER-KMETER BOYTUNU ALIRIZ 


//START : Length and Area Measurement Control 
let lengthButton = document.createElement("button");
lengthButton.innerHTML = `<img src='resources/images/measure-length.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;
lengthButton.className = "myButton";
lengthButton.id = "lengthButton";

let lengthElement = document.createElement("div");
lengthElement.className = "lengthButtonDiv";
lengthElement.appendChild(lengthButton);

let lengthControl =  new Control({
  element:lengthElement
});

let lengthFlag = false;
lengthButton.addEventListener("click", ()=>{
  //disableOtherInteraction('lengthButton'))
  lengthButton.classList.toggle("clicked");
  lengthFlag = !lengthFlag;//Toggle uygulamak icin yapiyoruz toggle in manuel olarak  yapilmasidir bu.. 
  //Yani lengtFlag true olarak gelirse false a ceviririz false olarak gelirse de true ya ceviririz ve bundan sonra toggle ozelligini uzerinde uygulamak istedgimz ozellikleri if(lengtFlag icinde yaparak o zaman zaten bu islem i toggle seklinde yapmis olacagiz)
  document.getElementById("map").style.cursor = "default";
  if(lengthFlag){
    map.removeInteraction(draw);
    addInteractions("LineString");
  }else{
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
    while(elements.length > 0)elements[0].remove();//Dinamik bir sekilde tum elementleri silme bestpractise... HARIKA BESTPRACTISE... 
  }
})

map.addControl(lengthControl);

let areaButton = document.createElement("button");
areaButton.innerHTML = `<img src='resources/images/measure-area.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;
areaButton.className = "myButton";
areaButton.id = "areaButton";

let areaElement = document.createElement("div");
areaElement.className = "areaButtonDiv";
areaElement.appendChild(areaButton);

let areaControl =  new Control({
  element:areaElement
});

let areaFlag = false;

areaButton.addEventListener("click", ()=>{
  //disableOtherInteraction("areaButton");
  areaButton.classList.toggle("clicked");
  areaFlag = !areaFlag;
  document.getElementById("map").style.cursor = "default";
  if(areaFlag){
    map.removeInteraction(draw);
    addInteractions("Polygon");
  }else{
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
    while(elements.length > 0)elements[0].remove();//Dinamik bir sekilde tum elementleri silme bestpractise... HARIKA BESTPRACTISE... 
  }
})

map.addControl(areaControl);

/**
 * Message to show when user is drawing a polygon
 * @type {string}
 */
var continuePolygonMsg = "Click to continue polygon, Double click to complete";

/**
 * Message to show when the user is drawing a line
 * @type {string}
 */

var continueLineMsg = "Click to continue line, Double click to complete";

var draw;//global so we can remove it later

//ol/source/Vector~VectorSource - import VectorSource from 'ol/source/Vector.js';
var source = new VectorSource({wrapX:false});
var vector = new VectorLayer({
  source:source,
  style:new Style({
    fill:new Fill({
      color:"rgba(255,255,255,0.2)",
    }),
    stroke:new Stroke({
      color:"#ffc33",
      width:2,
    }),
    image:new CircleStyle({
      radius:7,
      fill:new Fill({
        color:"#ffcc33"
      })
    })
  })
})

map.addLayer(vector);

function addInteractions(intType){
  draw = new Draw({
    source:source,
    type:intType,
    style:new Style({
      fill:new Fill({
        color:"rgba(200,200,200,0.6)",
      }),
      stroke:new Stroke({
        color:"rgba(0,0,0,0.5)",
        width:2,
      }),
      image:new CircleStyle({
        radius:5,
        fill:new Fill({
          color:"rgba(255,255,255,0.2)"
        }),
        stroke:new Stroke({
          color:"rgba(0,0,0,0.7)",
         
        }),
      })
    })
  });

  map.addInteraction(draw);

// map.addInteraction(new Draw({
//   type:"LineString",

// }));

createMeasureTooltip();
createHelpTooltip();

/**
 * Currently drawn feature
 * @type {import("../src/ol.Feature.js").default}
 */
var sketch;//o anda cizilen currentFeature yi temsil ediyor
/**
 * Handle pointer move
 * @param {import("../src/ol/MapBrowserEvent").default} event The event
 */


var pointerMoveHandler =  function(event){
  console.log("pointerMoveHandler: ")
  if(event.dragging){
    return;
  }
  /** @type {string} */
  var helpMsg = "Click to start drawing";

  if(sketch){
    var geom = sketch.getGeometry();
    if (geom instanceof Polygon) {//Eger cizilen feature nin (event.feature diye aliniyor sketch) getGeometry() si bir polygondan mi turemis yoksa LineString den mi seklinde bu sekilde bunu ayirt edebiliyoruz.BESTPRACTISE KULLANIM BEN BU SEKILDE KULLANMADIM HIC..  
      //Ben bunu normalde  console.log("Test-type ", sketch.getGeometry().getType()); bu yoontemle yapiyorum interaction in Polygon mu, LineString mi ya da Point mi oldugunu ayirt etmek icin ama bu da yeni ve guzel bir yontem olmus
      //Eger polygon ise polygon mesajini yazdir helpMsg iceriginde yok LineString ise o zaman da LineString mesajin yazdir diyoruz
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof LineString) {
      helpMsg = continueLineMsg;
    }

  }
  helpTooltipElement.innerHTML=helpMsg;
  //helpTooltip ise bir overlay dir elementi helpTooltipElement olan bir overlay dir .. Unutmayalim.. 
  //SetPosition i vermemiz gerekiyor..overlay i alabilmek icin 
  helpTooltip.setPosition(event.coordinate);

  helpTooltipElement.classList.remove("hidden");
};

map.on("pointermove", pointerMoveHandler);//Mouse u uzerinde gezdirdigmzde surekli olarak gelen mesaj yazisini goruyoruz pointermove eventi sayesinde

//var listener;

draw.on("drawstart", function(event){
  console.log("event.target-drawstart: ",event.target);
  //set sketch
  sketch =  event.feature;
  console.log("Test-type ", sketch.getGeometry().getType());
  //type i bu sekilde bulabilirz..yani draw interaction inin LineString mi , Polygon mu bunu alabliriz

  /**
   * @type {import ("../src/ol/coordinate.js").Coordinate|undefined}
   */
  var tooltipCoord = event.coordinate;

  //DEMEKKI BIZ FEATURE UZERINDENDE CHANGE EVENTINI KULLANABILIYORUZ..DRAWSTART ICINDE-BU COK ONEMLI... 
  sketch.on("change", function(event){
    console.log("sketch-currentFeature-event", event.target);
  })

   //DEMEKKI BIZ GEOMETRY-(POINT-POLYGON-LINESTRING) UZERINDENDE CHANGE EVENTINI KULLANABILIYORUZ..DRAWSTART ICINDE-BU COK ONEMLI...
  //listener = sketch.getGeometry().on("change", function(event)){}
  sketch.getGeometry().on("change", function(event){
    console.log("event.target-geometry change: ",event.target);
    var geom = event.target;
    var output;
    if(geom instanceof Polygon){
      output = formatArea(geom);//Dinamik olarak parametresie verilen geometry nin alanini hespaliyor.. 
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
     //Polygon geometrysiine has birsey getInteriorPoint ve cokgenini agirlik merkezi yani ortasina gelecek olan mesaj kutusunu yani bu polygon cizilme asamasinda dinamik olarak calisiyor yani polygona her yeni bir kosegen veya nokta cizildiginde genisledigi icin agirlik merkezi degisiyor ve biz getInteriorPoint sayesinde agirlik merkezini dinamik olarak alarak polygon ile alan cizimi esnasinda mesaj kutusunu dinamik olarak her yeni bir kosegene veya nokta ile cizdigmz alan genislediginde mesaj kutusu her zaman cizilen alanin ortasinda kaliyor
      console.log("COORDINATESSS: ", geom.getCoordinates())
      console.log("COORDINATESSS- tooltipCoord: ", tooltipCoord)
      
    }else if(geom instanceof LineString){
      output = formatLength(geom);
      tooltipCoord = geom.getLastCoordinate();
      //Burda line cizimii esnasina her zaman mesaj kutusu sonCoordinate da gozukecek
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  })
});

//Cizimi bitirdigmizde de measurement i goster diyoruz
draw.on("drawend", function(){
  measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
  measureTooltip.setOffset([0, -7]);
  //unset sketch 
  sketch = null;
  //unset tooltip so that a new can be created 
  measureTooltipElement = null;
  createMeasureTooltip();//Cizim bittigi anda hesaplamayi yapar
  //ol.Observable.unByKey(listener)
})

}

/**
 * The help tooltip element
 * @type {HTMLElement}
 */

var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */

var helpTooltip;

/**
 * Creates a new help tooltip
 */

function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }//Once var olan tooltip i kaldiriyoruz 
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'ol-tooltip hidden';
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  });
  map.addOverlay(helpTooltip);
}

console.log("map.getViewport(): ",map.getViewport());
/*
getViewport ile biz map imizin icinde bulundugu ve bizim index.html de olutrudgumz <div id="map"></div> in nested elementi yani openlayersdan gelen map i icinde bulunduran div elemnte erismis oluyoruz
 */
map.getViewport().addEventListener("mouseout",function(){
 // helpTooltipElement.classList.add("hidden");
});

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * Overlay to show the measurement
 * type {Overlay}
 */

var measureTooltip;


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  });
  map.addOverlay(measureTooltip);
}


/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
//LineString cizdigmiz zaman cizilen alani hesapliyor
var formatLength = function (line) {
  //import {getArea, getLength} from 'ol/sphere.js'; genLength in openlayers tarafindan taninmasi icni import edilmesi gerek
  var length = getLength(line);
  var output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
//Cizilen polygon alanini hesaplamaya yariyor
var formatArea = function (polygon) {//PARAMETREYE GEOMETRY ALIYOR (NEW GEOMETRY())
//  import {getArea, getLength} from 'ol/sphere.js'; bunu import ederek getArea yi kullanabilyoruz
  var area = getArea(polygon);
  var output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return output;
};

//End : Length and Area Measurement Controll

//ZOOM-IN / ZOOM-OUT OZELLIGINI DIKDORGEN BIR ALANI SECIP DRAG-DROP YAPARAK SECILEN ALANA ZOOM-IN YAPAN CONTROL OLUSTURMA
//start :zoomIn Control 

//ol/interaction/DragBox~DragBox
//Allows the user to draw a vector box by clicking and dragging on the map, normally combined with an ol/events/condition that limits it to when the shift or other key is held down. This is used, for example, for zooming to a specific area of the map (see DragZoom and DragRotateAndZoom).
var zoomInInteraction = new DragBox({}); 

//boxend (DragBoxEvent) - Triggered upon drag box end.
zoomInInteraction.on("boxend", function(){
  console.log("boxend-dragbox");
  //Bu da cok onemli bir bilgi, zoomInteraction uzerinden biz getGeometry ile o anda dragbox ile normalde en son geometry nin coordinatlari polygon da 5 tane icinde x,y coordinatlari olan dizi olark gelir ancak getExtent iste bu gelen polygon coordinatlarindan dikdortgen kisimlarini iceren koordinatlari bir dizi icinde toplayarak, dikdortgene ait 4 koordinati  aliyor 
  //Normal polygon uzerinden getCoordinates de gelen ([x1,y1]-sol ust kose, [x1,y2] sol alt kose, [x2,y2] sag alt kose, [x2,y1] sag ust kose)
  //seklinde gelirken getExtent ile ise sadece duzlem koordinatlarini veriyor, bu duzlem koorinatlarinin kesisimi arasindan bir dikdortgen meyadana gliyor iste bize onu veriyor [X1,Y2,X2,Y1]
  var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
  console.log("boxend-zoomInExtent: ",zoomInExtent);// [8276995.980327919, 2399789.5397829735, 9197128.557294073, 3057027.0947587974]
  console.log("zoomInInteraction.getGeometry(): ",zoomInInteraction.getGeometry())//Polygon geometrysini verir
  console.log("zoomInInteraction.getGeometry(): ",zoomInInteraction.getGeometry().getCoordinates())
  //ol/interaction/DragBox~DragBox - getGeometry(){Polygon}(Returns geometry of last drawn box.)
//zoom islemi zaten map icindeki view a ait bir option oldugu icin, biz eger ekstra bir zoom interaction i ekleyeceksek, DragBox ile o zaman a anda secilen alan in geometry sini extend edip bunu view a fit ederiz
  map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement("button");
ziButton.innerHTML= `<img src='resources/images/zoom-in.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;
ziButton.className = "myButton";
ziButton.id="ziButton";

var ziElement = document.createElement("div");

ziElement.className = "ziButtonDiv";
ziElement.appendChild(ziButton);

var ziControl = new Control({
  element:ziElement
});

var zoomInFlag = false;

ziButton.addEventListener("click", ()=>{
  ziButton.classList.toggle("clicked");
  zoomInFlag = !zoomInFlag;
  if(zoomInFlag){
    document.getElementById("map").style.cursor = "zoom-in";
    map.addInteraction(zoomInInteraction);    
  }else{
    map.removeInteraction(zoomInInteraction);
  }
})

map.addControl(ziControl);

//end : zoomInControl 

//start : zoomOut Control 

var zoomOutInteraction = new DragBox({}); 

//boxend (DragBoxEvent) - Triggered upon drag box end.
zoomOutInteraction.on("boxend", function(){
  console.log("boxend-dragbox");
  
  var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
  console.log("zoomOutExtend: ",zoomOutExtent);
//zoomOutExtent Center of the rectangle... ayni sekilde rectangle a ait
//import {getCenter} from 'ol/extent';
//import * as olExtent from 'ol/extent';
//Get the center coordinate of an extent.
  map.getView().setCenter(getCenter(zoomOutExtent));
  mapView.setZoom(mapView.getZoom() -1);
  //Her tiklamada bir adim daha zoom-out yapacak, uzaklasacak
});

var zoButton = document.createElement("button");
zoButton.innerHTML= `<img src='resources/images/zoom-out.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;
zoButton.className = "myButton";
zoButton.id="zoButton";

var zoElement = document.createElement("div");

zoElement.className = "zoButtonDiv";
zoElement.appendChild(zoButton);

var zoControl = new Control({
  element:zoElement
});

var zoomOutFlag = false;

zoButton.addEventListener("click", ()=>{
  zoButton.classList.toggle("clicked");
  zoomOutFlag = !zoomOutFlag;
  if(zoomOutFlag){
    document.getElementById("map").style.cursor = "zoom-in";
    map.addInteraction(zoomOutInteraction);    
  }else{
    map.removeInteraction(zoomOutInteraction);
  }
})

map.addControl(zoControl);

//HOW TO ADD ATTRIBUTE QUERY - BIR LINKE TIKLANILDIGI ZAMAN QUERY ISLEMI YAPAN KUTU ACILACAK VE ICERSINDEN SECENEKLER SECILIP MAP UZERINDE VERITABANINDAN QUERY CALISTIRACAK
//query dialob box u gosterebilmek icn html icerisine component ekleyecegiz

//HOW TO ADD ATTRIBUTE QUERY - 
//BIR LINKE TIKLANILDIGI ZAMAN QUERY ISLEMI YAPAN KUTU ACILACAK VE ICERSINDEN SECENEKLER SECILIP MAP UZERINDE VERITABANINDAN QUERY CALISTIRACAK
//query dialob box u gosterebilmek icn html icerisine component ekleyecegiz
//Select Layer- once layer secilecek.. yani geoserver da yayinlanmis wms-layer lar arasindan layer secilecek  
//Sonra o secilen layer ornegin india_adm1_pg yi sectik bu secilen wms-layer nedir postgres-postgis den tablo olarak gelen bir tablodur ve o tablonun kolonlari ise attribute dur ... Bu attribute icerisinden bir attribute secilecek Select Attribute diyerek 
//Sonra Select operator LIKE-EQUAL TO DIYEREK BIRI SECILIR 
//Ardindan da Enter Value diyerek bir input dan kullanicdan deger alinir ve bu deger kullanilark, query olusturulur ve o gelen query harita uzerinde farkli style ile stillendirilerek kullaniciya secilen query-filtreleme harita uzerinde vektor data olarak sunulmus olur hem de kullanici karsisina ayrica bir dikdortgen popup ile tum datalar gosterilecek ve de popup uzerindeki data lardan birine tiklaninca o direk harita uzerinde o data hangi alana karsilik geliyorsa ona zoom-in yapip(highlighted olacak) farkli style ile stillendirilecek
//Ve butun bu islemler icin biz sol da bir query iconu koyacagiz query iconuna bir kez tiklayinca bu ozellikler kullanilabilecek, 2.kez tikladgimizda ise bu ozellklerin tamami kaybolacak, yani toggle mantiginda yapacagiz

//attribute-query-start

var geojson ;
var featureOverlay ;
var bolIdentify;
var queryButton = document.createElement("button");


queryButton.innerHTML= `<img src='resources/images/database.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'></img>  `;
queryButton.className = "myButton";
queryButton.id="queryButton";

var queryElement = document.createElement("div");

queryElement.className = "queryButtonDiv";
queryElement.appendChild(queryButton);

var queryControl = new Control({
  element:queryElement
});

var queryFlag = false;

queryButton.addEventListener("click", ()=>{
//  queryButton.classList.toggle("clicked");
  queryFlag = !queryFlag;
  if(queryFlag){
    if(geojson){
      geojson.getSource().clear();//source uzerinden clear yapiliyor... dikkat edelim... 
      map.removeLayer(geojson);
    }

    if(featureOverlay){
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
    
    
    document.querySelector(".attQueryDiv").style.display = "block";
    bolIdentify = false;

    addMapLayerList();
  }else{
  
    document.querySelector(".attQueryDiv").style.display = "none";
    document.querySelector(".attListDiv").style.display = "none";


    if(geojson){
      geojson.getSource().clear();//source uzerinden clear yapiliyor... dikkat edelim... 
      map.removeLayer(geojson);
    }

    if(featureOverlay){
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
   
  }
})

map.addControl(queryControl);

let selectLayer = document.querySelector("#selectLayer");
let selectHTML = ``; 

/*
map.getAllLayers().forEach((layer, index)=>{
  if(layer.get("title")){
    
    selectHTML +=`<option `;
    selectHTML+=`id= ${index+1}`;
     selectHTML+=   layer.get("title") == 'None' ? 'disabled' : '';
     selectHTML+=  `>`;
    selectHTML+= layer.get("title")
    selectHTML +=`   </option>`;
  }
})  
*/
    

console.log("selectLayer: ",selectLayer)

selectLayer.innerHTML = selectHTML;

console.log(map.getAllLayers())

//WMS-SOURCE: getAttributions()

selectLayer.addEventListener("change", function(event){
  console.log("selected-option-value: ", event.target.value);//selectedOption value
  console.log("selected-options: ", event.target.options);//TUM OPTIONS LAR I VERIYOR
  console.log("selected-option-index: ", event.target.selectedIndex);//selectedOption value//2
  console.log("selected-option: ", event.target.options[event.target.selectedIndex]);//

  map.getAllLayers().forEach(layer=>{
    let title = layer.get("title");
    //Burda mantik olarak id verip id leri karsilastirmak gerekir...bu sekilde title karsilastirmak cok mantikli degil, bestpractise id , uniq id vermektir..
    if(title == event.target.value){
        console.log("layer: ",layer.getSource());
    }
  })

})


//HARIKA BESTPRACTISE...WFS-SOURCE UZERINDEN GEOSERVER DAKI TUM LAYER LARA ISTE BU SEKILDE GETCAPABILITIES KULLANARAK ERISEBILIUYORUZ...
//GETCAPABILITES I KULLANARAK-XML DOSYASINA BIZ BIR REQUEST GONDERIYORUZ... VE UZERINDEN TUM LAYAERS LARA ERISEBILIRIZ...AJAX-QUERY KULLANARAK WFS SOURCE GETCAPABILITIES E REQUEST GONDEREREK GEOSERVER DAKI LAYER LISTESINE ISTE BU SEKILDE ERISEBILIYORUZ

function addMapLayerList(){
  console.log("addMapLayerList")
  $(document).ready(function(){
    $.ajax({
      type:"GET",
      url:"http://localhost:9090/geoserver/wfs?request=getCapabilities",
      datatype:"xml",
      success:function(xml){
        console.log("xmlxmlxmlxml: ", $(xml))
        var select = $("#selectLayer");
        select.append("<option class='ddindent' value='' ></option>");
        $(xml).find("FeatureType").each(function(){
          
          $(this).find("Name").each(function(){
          
            var value = $(this).text();
        //    console.log("value::::::", $(this).text());
            select.append("<option class='ddindent' value='" + value +"' >"+ value+"</option>");
          })
        })
      }
    })
  })
}

//BEST PRACTISE.. XML ADRES-URL INE BIZ REQUEST GONDEREREK ICERISINDEKI DATALARA ERISEBILIYORUZ... YANI DAHA DOGRUSU GETCAPABILITES XML E BIZ REQUEST GONDEREBILIYORUZ VE ICERISINDE VAR OLAN LAYER S LARI ALARAK O HER BIR LAYER IN DA FEATURE LARINA ERISEBILECEK, REQUEST LER GONDEREBILIYORUZ....


//http://localhost:9090/geoserver/wfs?request=getCapabilities

//http://localhost:9090/geoserver/wfs?request=getCapabilities


//geoserver-layerpreviews dan herhangi bir layer in geo-demo:polbnda_ind_pg layer in select-options indan WFS-GML2 YU SECERSEK
//WFS-GETFEATURE() ENDPOINTI OLARAK ANLAYALIM BUNU: 
//http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Apolbnda_ind_pg&maxFeatures=50&outputFormat=text%2Fxml%3B%20subtype%3Dgml%2F2.1.2
//EGER BIZ GEOSERVER DAN WORKSPACE I GEO-DEMO OLANLARIN GETPACABILITIES INI ALMAK ISTERSEK...(GETCAPABILITEIS DEMEK O SOURCE A AIT TUM OPTIONS, PARAMETRELERIN BIR DOSYA DA KARSIMIZA GELMESI DEMEKTIR... KI BIZ ICERIGINDEKI SOURCE LERI ISTEDGIMZ GIBI KULLANMAMIZ ICIN ALIRIZ)
//http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=getCapabilities
//TUM GEOSERVER DAKI LAYER LARA ERISMEK ICIN DE ... //http://localhost:9090/geoserver/wfs?request=getCapabilities
//Ozellikle biz WFS geoserver islemlerinde openlayers uzerinden hep ajax-request ler gondererek o datalara erisip datalari listeley biliriz ayni zamanda da o datalari edit leyebiliriz.. 
//Wfs-DescribeFeatureType ile secilen layer in yani secilen wms-layer in(geoserverdan getcapabilites ile erisilen layerlardan) attributes lerini ajax ile cekiyoruz.. 

//Secilen layer a ait attributes lere erismek icin geoserver daki wfs-request=DescribeFeatureType a request gonderili yor...(endopointine)
$(function(){
  document.getElementById("selectLayer").onchange =  function(){
    var select = document.getElementById("selectAttribute");
    while(select.options.length > 0){
      select.remove(0);
    }
    var value_layer = $(this).val();
    console.log(" URL-DESCRIBEFEATURETYPE: ","http://localhost:9090/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName="+value_layer)
    $(document).ready(function(){
      $.ajax({
        type:"GET",
        url:"http://localhost:9090/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName="+value_layer,
        dataType:"xml",
        success:function(xml){
          var select = $("#selectAttribute");
          //var title = $(xml).find('xsd\\:complexType').attr('name');
          //alert(title);
          select.append("<option class='ddindent' value=''></option>");
        console.log("xml--xmll",$(xml))
          $(xml).find('xsd\\:sequence').each(function(){
         //   console.log("$this11...: ", $(this))
            $(this).find('xsd\\:element').each(function(){
          //    console.log("$this22...: ", $(this))
              var value = $(this).attr('name');
              
              //alert(value)
              var type = $(this).attr('type');
              //alert(type)
              if(value != 'geom' && value != 'the geom'){
                select.append("<option class='ddindent' value='"+ type +"'>"+ value +"</option>")
              }


            })
          })
        }
      })
    })
  }//Select Attribute select-option unda secilen layer a ait attributes leri listeliyoruz...


//Burasi da attribute eger string ise ona gore, karsilastirma operatoru yok attribute int-float-double vs ise de ona gore karsilastirma opeartorlerini select-optiona getirecek
document.getElementById("selectAttribute").onchange =  function(){
  var operator = document.getElementById("selectOperator");
  while(operator.options.length > 0){
    operator.remove(0);
  }

  var value_type = $(this).val();
  console.log("value_type: ", value_type);
  //javascriptte css gibi bir elementi secebildigmiz zaman css den daha efektif bir sekilde kullanabiliyuoruz...yani biz selected-secilen option i javascriptte css secicileri gibi secerek erisebiliyoruz...bu harika bir ozellik
  var value_attribute = $('#selectAttribute option:selected').text();
  operator.options[0] = new Option("Select operator", "");
  if(value_type == "xsd:short"  || value_type == "xsd:int"  || value_type == "xsd:double"){
    var operator1 = document.getElementById("selectOperator");
    operator1.options[1] = new Option("Greater than", ">");
    operator1.options[2] = new Option("Less than", "<");
    operator1.options[3] = new Option("Equal to", "=");

  }else if(value_type == "xsd:string"){
    var operator1 = document.getElementById("selectOperator");
    operator1.options[1] = new Option("Like", "Like");
    operator1.options[2] = new Option("Equal to", "=");
   
  }
}


//layer secildikten, attribute secildikten ve operator option i secildikten sonra son is enter-value input alanina deger girip enter yapmak islemidir orasi da asagidadir
//BURDA Y INE HARIKA BIR BESTPRACITSE...VAR ... WFS-GETFEATURES - CQL_FILTER ILE WFS- IN GETFEATURES ENDPOINTINE FILTRELEME YAPARAK REQUEST GONDREIYUORUZ....BUNU PRATIGE DOKUYORUZ ISTE BURDA...HARIKA BESTPRACTISE...
//FILTRELEME POPUP INDA FILTRELEME SECITGIMZ ZAMAN URL BU SEKILDE GELIYOR...
//http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+%3E+%2715%27&outputFormat=application/json
//Wfs-GetFeatures-CQL_FILTER ile filtreleme yaparak secilen attribute icin belirlenen fitlrelemeyi url e dinamik olarak alip, filtreleme yi bu sefer artik son data geliyor..direk datayi cekiyoruz..xml url i uzerinden iste bunu isse ajax ile almiyoruz...openlaeyrs in geojson datalarini almak icin kullandigmiz ozelligii ile aliyoruz

console.log("ATTQRYRUN: ", document.getElementById("attQryRun"))//ATTQRYRUN:  <button type=​"button" id=​"attQryRun" class=​"attQryRun">​Run​</button>​ RUN BUTONUNA TIKLAYINCA YANI QUERY FORM U DOLDURULUP BUTONA BASILINCA TETIKLENEN FONKSIYONDUR.. HEMEN ALTTAKI 
document.getElementById("attQryRun").onclick =  function (){
  map.set("isLoading", "YES");

  if(featureOverlay){
    featureOverlay.getSource().clear();
    map.removeLayer(featureOverlay);
  }

  var layer = document.getElementById("selectLayer");//select html element
  var attribute = document.getElementById("selectAttribute");
  var operator = document.getElementById("selectOperator");
  var txt = document.getElementById("enterValue");

  if(layer.options.selectedIndex == 0){
    alert("Select Layer");
  }else if(attribute.options.selectedIndex == -1){
    alert("Select Attribute");
  }else if(operator.options.selectedIndex <= 0){
    alert("Select Operator");
  }else if(txt.value.length <= 0){
    alert("Enter Value");
  }else {

    var value_layer = layer.options[layer.selectedIndex].value;
    var value_attribute = attribute.options[attribute.selectedIndex].text;
    var value_operator = operator.options[operator.selectedIndex].value;
    var value_txt = txt.value;

    if(value_operator == "Like"){
      value_txt = "%25" + value_txt + "%25";
    }else{
      value_txt = value_txt;
    }
    //http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Apolbnda_ind_pg&maxFeatures=50&outputFormat=text%2Fxml%3B%20subtype%3Dgml%2F2.1.2
    var url = "http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+ value_layer + "&CQL_FILTER="+value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"; 
   // &maxFeatures=50  &outputFormat=text/xml%3B%20subtype%3Dgml%2F2.1.2

   console.log("ENTER---URL: ", url);
   newaddGeoJsonToMap(url);
  
   setTimeout( function(

   ){
    newpopulateQueryTable(url, newaddRowHandlers);
    
 
  }, 300);//Burasi query-popup inda ki filtrelemeler yapildiktan sonra enter a basinca zoom-level artarak tiklanan alana zoom-in yapilmasi saglayan fonksiyondur
   map.set("isLoading", "NO");
  }
}

});//Burasi 1059 a ait..ama burasisinin bitimi bir en altta da olabilir ben simdilik buraya koydum ama bunu bir arastiralim...


//Geoserver dan datayi fetch edecek--WFS-GETFEAUTURE -CQL_FILTER - url ini openlayers da layer olarak kullanmak!!!BESTPRACTISE....
//url-http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+>+'15'&outputFormat=application/json
//url- wfs getFeatures filter- islemini json olarak donduren bir url dir, bu url i browser da request edersek, json sonucunu goruruz biz bu sekilde url i alarak bunu openlayers da bir vektorlayer icinde vektorsource icinde url option una value olarak kullanarak geojson layer i elde edebiliriz....BURDA AJAX-GET-REQUEST ILE JSON OLARAK DONECEK OLAN DATAYA REQUEST GONDERIYORUZU...JQUERY GET METHODU ILE
function newaddGeoJsonToMap(url){
  console.log("url-GEOJSON: ", url);
  if(geojson){
    geojson.getSource().clear();
    map.removeLayer(geojson);
  }

  var style = new Style({

    fill:new Fill({
      color:"rgba(0,255,255,0.7)"
    }),
    stroke:new Stroke({
      color:"#FFFF00",
      width:3
    }),
    image:new CircleStyle({
      radius:7,
      fill:new Fill({
        color:"#FFFF00"
      })
    })
  })

  //OPENLAYER ARACILIGI ILE FILTRERLENEREK AJAX ILE WFS-GETFEATURES URL ININ DIREK VECTORSOURCE DE URL OLARAK KULLANARAK DA CEKEBILIUYORUZ DATAYI... DIKKKAT EDELIM. AMA URL-IN GEOJSON-YANI JSON FORMATINDA OLMASI GEREKIR, VE BU FILTRELENEN ALAN UZERINDE
  //BESTPRACTISE...COOOK ONEMLI...
  geojson = new VectorLayer({
    source:new VectorSource({
      url:url,
      format:new GeoJSON()
    }),
    style:style
  })

  //BESTPRACTISE....BIR LAYER A UZAKTAN BIR DATA CEKILDIGI ZAMAN BU ORNEKTE OLDUGU GIBI, DATA NIN GELMESI BIRAZ ZAMAN ALACAK, FEATURE LAR GELINCE DE ZOOM- LEVEL GELEN DATAYI HARITA UZERINDE TAM GOSTERMESI ICIN..ZOOM-LEVEL VS DE AYARLANIYOR TEKRARDAN...
  geojson.getSource().on("addfeature", function(){
  //Bu islem.. geojson layer i icerisine request ile gelen wfs-getFeature dan gelen url nin kullanilmasi ile elde ediliyor dolayisi ile her response geldiginde tetikleniyor bu method ve de bizde response geldgiinde sen view i bu sekilde zoom-level i animasyonlu bir sekilde, yeni gelen sourceye gore extend et demis olyoruz ve bu sayede de kullanici filtreleme kriterleri layer, attribute, operation i secip de input alanina filtreleme degerini girip de enter a basinca verilen input degerinden ornegin daha buyuk id ler gelsin demis isek mesela eger bizim filtrelememiz sonucunda datalar var ise, filtrelemeye karsilik gelen o zaman o datalar, map de hangi alanlara karsilik geliyor ise o datalar, style olarak highlighted yapilarak o alanlara da animasyonlu bir sekilde zoom y apilacak...
    map.getView().fit(
      geojson.getSource().getExtent(),
      {
        duration:1590, size:map.getSize(), maxZoom:21
      }
    ) 
  })
  map.addLayer(geojson);
  console.log("geojson is addedd...")
}

//Attribute table on the map
var featureOverlay;

//url: http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+>+'15'&outputFormat=application/json
//GEOSERVER- WFS- GETFEATURES - CQL_FILTERS URL INI ASAGIDAKI GIBI OPENLAYERS DA KULLANARAK FEATURES LARA ERISEREK ONLARI LISTELEYEBILIRZ..
var table ;
function newpopulateQueryTable(url, callback){
  console.log("newpopulateQueryTable-URL: ", url)
  if(typeof attributePanel !== "undefined"){
    if(attributePanel.parentElement !== null){
      attributePanel.close();
    }
  }
  //Kullnici filtrelemeyi secip input alanina filtreleme icin kullanilacak degeri girip enter yapinca bu url ortaya cikiyor ve bu url i asagdiaki $.getJSON() ile parametreye url vererek data ya erisebiliyoruz...HARIKA BESTPRACTISE....
  //url: http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+>+'15'&outputFormat=application/json
  $.getJSON(url, function(data){//jquery functionality-JQUERY-GETMETHOD KULLANILRAK WFS-GETFEATURES-CQL_FILTER ILE  HAZIRLANMIS URL-I(ENDPOINT GIBI DUSUNEBILIRZ)
    console.log("newpopulateQueryTable-data: ", data);//newpopulateQueryTable-data:  {type: 'FeatureCollection', features: Array(22), totalFeatures: 22, numberMatched: 22, numberReturned: 22, …}
    console.log("newpopulateQueryTable-data: ", data.features);
    /* 
    newpopulateQueryTable-data:  
(22) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
0
: 
{type: 'Feature', id: 'ind_adm12_pg.16', geometry: {…}, geometry_name: 'geom', properties: {…}}
1
: 
{type: 'Feature', id: 'ind_adm12_pg.17', geometry: {…}, geometry_name: 'geom', properties: {…}}
    */
    var col = [];
    col.push('id');
    for(var i= 0; i < data.features.length; i++){
      for(var key in data.features[i].properties){
        if(col.indexOf(key) === -1){
          col.push(key);
        }
      }
    }

    table = document.createElement("table");
    table.setAttribute("class", "table table-bordered table-hover table-condensed");
    table.setAttribute("id","attQryTable");
    document.body.appendChild(table);
    console.log("table-IN-NEWPOPULATE-QUERY-TABLE _ ", table)
    callback();
    //CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE 
    var tr = table.insertRow(-1);//Table Row

    for(var i = 0 ; i < col.length; i++){
      var th = document.createElement("th"); //TABLE HEADER
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    //ADD JSON DATA TO THE TABLE AS ROWS
    for (let i = 0; i < data.features.length; i++) {
      tr = table.insertRow(-1);
      for(var j = 0; j < col.length; j++){
        var tabCell = tr.insertCell(-1);
        if(j == 0){ tabCell.innerHTML =  data.features[i]['id'];}
        else{
          tabCell.innerHTML = data.features[i].properties[col[j]];
        }
      }
      
    }


    console.log("table-IN-NEWPOPULATE-QUERY-TABLEEEEEE ", table)
    //var tabDiv = document.createElement("div"); 
    var tabDiv = document.getElementById("attListDiv");
    console.log("tabDiv- ",tabDiv);//tabDiv geliyor , tabDiv de sorun yok


    var delTab = document.getElementById("attQryTable");
     delTab = document.querySelector("#attQryTable");//delTab null geliyor
     tabDiv.appendChild(delTab);
    console.log("delTab-first_ ",delTab);
    if(delTab){
      tabDiv.removeChild(delTab);//BURDA DA HATA VERIYOR
    }
    console.log("delTab-last_ ",delTab);


    tabDiv.appendChild(table);

    document.getElementById("attListDiv").style.display = "block";
    //html de bu elementi olusturduk ordan geliyor direk dom ile olusturmadik yani

  })


  
   var highlightStyle = new Style({
    fill : new Fill({
      color:'rgba(255, 0 , 255, 0.3)',
    }),
    stroke : new Stroke({
      color:'#FF00FF',
      width: 3,
    }),
    image: new CircleStyle({
      radius:10,
      fill:new Fill({
        color:'#FF00FF'
      })
    })
   })


   var highlightStyle2 = new Style({
    fill : new Fill({
      color:'rgba(245, 227, 66, 0.3)',
    }),
    stroke : new Stroke({
      color:'#f54287',
      width: 3,
    }),
    image: new CircleStyle({
      radius:10,
      fill:new Fill({
        color:'#f54245'
      })
    })
   })

   //Bu ara da featureOverlay bir layerdir Overlay degildir isimlendirme de hata yapilmis....
   featureOverlay = new VectorLayer({
    source: new VectorSource(),
    map:map,
    style:highlightStyle2
   });
}

 //   setTimeout(function(){ newaddRowHandlers(url);}, 300);//Burasi query-popup inda ki filtrelemeler yapildiktan sonra enter a basinca zoom-level artarak tiklanan alana zoom-in yapilmasi saglayan fonksiyondur

 function newaddRowHandlers()
 {
  console.log("geojson::::: ", geojson.getSource().getFeatures())
    var table = document.getElementById("attQryTable");
    console.log("tableeeee: ",table);//PROBLEM -1 BURASI BOS GELIYOR...NULLLL
    var rows = document.getElementById("attQryTable").rows;//BURASI UNDEFINED GELIYOR..
    var heads = table?.getElementsByTagName("th");//id uzerinden table a erisince o table uzerinden de o table a ait tr- lere bu sekilde erisielbiliyor
    var col_no;
    for(var i=0; i < heads?.length; i++){
      //Take each cell 
      var head = heads[i];
      if(head.innerHTML == "id"){
        col_no = i + 1;
      }
    }
    console.log("rows: ",rows)
    for(i = 0; i< rows.length; i++)
    {
      console.log("rows[i]: ",rows[i])
        rows[i].onclick = function(){
          featureOverlay.getSource().clear();
          $(function(){
            $("#attQryTable td").each(function(){
              $(this).parent("tr").css("background-color", "white");
            });
          });

          var cell = this.cells[col_no - 1];
          var id = cell.innerHTML; 
          $(document).ready(function(){
            $("#attQryTable td:nth-child("+ col_no + ")").each(function(){
                if($(this).text() == id){
                  $(this).parent("tr").css("background-color", "#d1d8e2");
                }
            });
          });
          console.log("geojson2::::: ",geojson)
          var features = geojson.getSource().getFeatures();
          //geojson ile url-geoserver-wfs-getFeatures-filter url i ile openlayers daki vectorLayer icinde vectorSource de url olarak kuallnarak olusturudgumuz layyer geojson di ve bu sayede su an kulllandigmz 2 tane farkli geoserver-wms imiz uzerindeki  harita da hangi alanlari filtrelersek o alanlar, i farkli bir style da veirrsek bize o alanlari gosteriyor  yani bize o alanlara ozel, bir layer olusturmus oluyor direk harita uzerinde gorebiiliyoruz ayni zaman da da  tabki gelen data yi da kullanabiliyoruz...data yi yukarda ajax ile alip table ile gosterirken ayni geoserver-wfs-getFeatures-filter i da harita uzerinde listeledgimz datay i da gosterebilmis oluyoruz...ARDINDAN DA GEOJSON LAYER ININ GETSOURCE UZERINDEN FEATURE LARINI ALIP YENI BIR LAYER OLUSTURARAK O LAYER A AKTARABILIRIZ VE ONA DA ID VS DE ATAYABILIRIZ VE FILTRELEYIP TABLE ICINDE POPUP OLARAK LISTELENEN DATA DAN HANGISINE TIKLANIRSA O NU HARITA UZERINDEN FARKLI BIR STYLE DA DA GOSTEREBILIRIZ...
          console.log("features__________: ",features)

          for(i = 0; i < features.length; i++){
            if(features[i].getId() == id){
              //Bu ara da featureOverlay bir layerdir Overlay degildir isimlendirme de hata yapilmis....
              featureOverlay.getSource().addFeature(features[i]);
              console.log("featureOverlay: ",featureOverlay)
              featureOverlay.getSource().getFeatures().forEach(feature=>{
                console.log("FEATUREEEEEE: ", feature);
              })

              featureOverlay.getSource().on("addFeature", function(){
                console.log("featureOverlay--addFeature triggered!!!!")
                map.getView().fit(
                  featureOverlay.getSource().getExtent(), 
                  {duration: 1500, size:map.getSize(), maxZoom:24}
                );

              });
            }
          }
          
        }
    }(rows[i]);
 }

 //Ozellik olarak yapilan sudur..Once ku llanici layer secer sonra o layer icinden hangi attribute u filtreleme de kullancagini secer arindan ise sectigi attriubte e buyk-kucuk veya esit olacak sekilde filttrelme kriterini inputa girer ve submit yapar bunu yaptiginda filtrelenen alanlar once cok kisa bir zoom-in ile  yaklasarak, style stroke ile gosterilir ve de popup ile table icinde filtrelenen datalar liste halinde de gosterilir ayni zamanda, ve o popup listesi uzerinde herhangi bir data ya tiklanirsa da bu sefer direk tiklanan spesifk alana animasyonlu zoom-in yapilir ve tiklanan alan a bu sefer fill-ve stroke olarak yeni bir style verilir ki hangi alan secildigi belli olsun...BU MANTK HARIKA BESTPTRACTISE...BU ANIMASYONLU ZOOM-IN OLAYLARININ HEPSININ MANTIGINDA ADDFEATURE EVENTI KULLANILARAK Y APILIYOR BU HARIKA BIR BESTPRACTISE DIR BUNU ZAMANLA KULLANMAMIZ GEREKECEK COOOK ONEMLI 
 //attribute-query-end


 //new functionality
 //layer lar seciliyor ardindan distance giriyor ve ardindan da ne cizecegini seciyor ornegin point, sonra point cizgi herhangi bir noktaya ornegin distance olarak 100 km vermis ise 100 km ye kadar olan ne kadar point var ise onlarin hepsini farkli bir style da bize gosteriyor bu harika bir ozellik!!!!... 




 var bufferButton = document.createElement("button");
 bufferButton.innerHTML= `<img src='resources/images/mapSearch.png' alt='' style='width:30px; height:30px; cursor:pointer;
background-color:cyan;    vertical-align:middle; margin-left:14px;'>
<span>Spatial Query</span>
</img>  `;
bufferButton.className = "myButton";
bufferButton.id="bufferButton";

var bufferElement = document.createElement("div");

bufferElement.className = "bufferButtonDiv";
bufferElement.appendChild(bufferButton);

var bufferControl = new Control({
  element:bufferElement
});

var bufferFlag = false;

bufferButton.addEventListener("click", ()=>{
  console.log("bufferButton clicced")
  bufferButton.classList.toggle("clicked");
  bufferFlag = !bufferFlag;

  document.getElementById("map").style.cursor = "default";

  if(bufferFlag){
    if(geojson){
      geojson.getSource().clear();//source uzerinden clear yapiliyor... dikkat edelim... 
      map.removeLayer(geojson);
    }

    if(featureOverlay){
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }

    document.getElementById("map").style.cursor = "default";
    document.getElementById("spQueryDiv").style.display = "block";

    addMapLayerList_spQry();
    
  }else{
    document.getElementById("map").style.cursor = "default";
    document.getElementById("spQueryDiv").style.display = "none";
    document.getElementById("attListDiv").style.display = "none";
  }

  if(geojson){
    geojson.getSource().clear();//source uzerinden clear yapiliyor... dikkat edelim... 
    map.removeLayer(geojson);
  }

  if(featureOverlay){
    featureOverlay.getSource().clear();
    map.removeLayer(featureOverlay);
  }

  map.removeInteraction(draw);
  if(document.getElementById("spUserInput").classList.contains("clicked")) {document.getElementById("spUserInput").classList.toggle("clicked")}


})

map.addControl(bufferControl);

//Bestpractise... Biz kullanmak istedgimiz layer lari bir array icerisine atip sonra tum geoserver daki layer lari getiren getCapabilities url inden ajax ile tum layer lari alinca sunu deriz eger bu array icindeki layer listesinde var ise option listesine yaz deriz.. 
var layerList = ["geo-demo:ind_adm12_pg","geo-demo:polbnda_ind_pg", "geo-demo:india_cities"];
/*valueeee: geo-demo:ind_adm12_pg
main.js:1521 valueeee: geo-demo:ind_adm1_pg
main.js:1521 valueeee: geo-demo:polbnda_ind_pg */

function addMapLayerList_spQry(){
  $(document).ready(function(){//html elementleri dom da hazir olunca burayi calistirsin demek.yuklenmesi hazir olunca calissin demektir ve 
    //$(function(){  ile  $(document).ready(function(){ ayni dir sadece biris i kisaltilmis halidir..  
      $.ajax({
        type:"GET",
       // url:"http://"+serverPort+ "/geoserver/wfs?request=getCapabilities",
        url: "http://localhost:9090/geoserver/wfs?request=getCapabilities",
        dataType:"xml",
        success:function(xml){
          var select = $("#buffSelectLayer");
          select.append("<option class='ddindent' value=''></option>");//#buffSelectLayer id li select elementi child olarak option etiketini veriyor 
          $(xml).find("FeatureType").each(function(){
            $(this).find("Name").each(function(){
              var value = $(this).text();
              console.log("valueeee:", value);
              if(layerList?.includes(value)){
                select.append("<option class='ddindent' value='"+ value +"'>"+ value +"</option>")
              }
            })
          })
        }
      })
  })
}

$(function() {// $(document).ready(function(){ - bununla ayni seydir  $(function() {

  var toc = document.getElementById("layerSwitcherContent");
  layerSwitcher = new LayerSwitcher.renderPanel(map, toc, {reverse:true});
//  layerSwitcher = new LayerSwitcherPanel(map, toc, {reverse:true});
  

  document.getElementById("selectLayer").onchange = function() {
    var select = document.getElementById("selectAttribute");
    while(select.options.length > 0){
      select.remove(0);
    }

    var value_layer = $(this).val();
    $(document).ready(function(){
      $.ajax({
        type:"GET",
        url:"http://localhost:9090/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName="+value_layer,
        dataType:"xml",
        success:function(xml){
          var select = $("#selectAttribute");
          //var title = $(xml).find('xsd\\:complexType').attr('name');
          //alert(title);
          select.append("<option class='ddindent' value=''></option>");
        console.log("xml--xmll",$(xml))
          $(xml).find('xsd\\:sequence').each(function(){
         //   console.log("$this11...: ", $(this))
            $(this).find('xsd\\:element').each(function(){
          //    console.log("$this22...: ", $(this))
              var value = $(this).attr('name');
              
              //alert(value)
              var type = $(this).attr('type');
              //alert(type)
              if(value != 'geom' && value != 'the geom'){
                select.append("<option class='ddindent' value='"+ type +"'>"+ value +"</option>")
              }


            })
          })
        }
      })
    })
  }

  

  document.getElementById("selectAttribute").onchange =  function(){
    var operator = document.getElementById("selectOperator");
    while(operator.options.length > 0){
      operator.remove(0);
    }
  
    var value_type = $(this).val();
    console.log("value_type: ", value_type);
    //javascriptte css gibi bir elementi secebildigmiz zaman css den daha efektif bir sekilde kullanabiliyuoruz...yani biz selected-secilen option i javascriptte css secicileri gibi secerek erisebiliyoruz...bu harika bir ozellik
    var value_attribute = $('#selectAttribute option:selected').text();
    operator.options[0] = new Option("Select operator", "");
    if(value_type == "xsd:short"  || value_type == "xsd:int"  || value_type == "xsd:double"){
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Greater than", ">");
      operator1.options[2] = new Option("Less than", "<");
      operator1.options[3] = new Option("Equal to", "=");
  
    }else if(value_type == "xsd:string"){
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Like", "Like");
      operator1.options[2] = new Option("Equal to", "=");
     
    }
  }

  document.getElementById("attQryRun").onclick =  function (){
    map.set("isLoading", "YES");
  
    if(featureOverlay){
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
  
    var layer = document.getElementById("selectLayer");//select html element
    var attribute = document.getElementById("selectAttribute");
    var operator = document.getElementById("selectOperator");
    var txt = document.getElementById("enterValue");
  
    if(layer.options.selectedIndex == 0){
      alert("Select Layer");
    }else if(attribute.options.selectedIndex == -1){
      alert("Select Attribute");
    }else if(operator.options.selectedIndex <= 0){
      alert("Select Operator");
    }else if(txt.value.length <= 0){
      alert("Enter Value");
    }else {
  
      var value_layer = layer.options[layer.selectedIndex].value;
      var value_attribute = attribute.options[attribute.selectedIndex].text;
      var value_operator = operator.options[operator.selectedIndex].value;
      var value_txt = txt.value;
  
      if(value_operator == "Like"){
        value_txt = "%25" + value_txt + "%25";
      }else{
        value_txt = value_txt;
      }
      //http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Apolbnda_ind_pg&maxFeatures=50&outputFormat=text%2Fxml%3B%20subtype%3Dgml%2F2.1.2
      var url = "http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+ value_layer + "&CQL_FILTER="+value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"; 
     // &maxFeatures=50  &outputFormat=text/xml%3B%20subtype%3Dgml%2F2.1.2
  
     console.log("ENTER---URL: ", url);
     newaddGeoJsonToMap(url);
    
     setTimeout( function(
  
     ){
      newpopulateQueryTable(url, newaddRowHandlers);
      
   
    }, 300);//Burasi query-popup inda ki filtrelemeler yapildiktan sonra enter a basinca zoom-level artarak tiklanan alana zoom-in yapilmasi saglayan fonksiyondur
     map.set("isLoading", "NO");
    }
  }


  document.getElementById("attQryClear").onclick =  function () {
    if(queryGeoJSON){
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if(clickSelectedFeatureOverlay){
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }

    coordList = "";
    markerFeature = undefined; 
    document.getElementById("attListDiv").style.display = "none";
  }

var markerFeature;
function  addInteractionForSpatialQuery(intType){
  draw = new Draw({
    source:clickSelectedFeatureOverlay.getSource(),
    type:intType,
    style:interactionStyle
  })

  map.addInteraction(draw);
  draw.on("drawend", function(e){
    markerFeature = e.feature;
    markerFeature.set("geometry", markerFeature.getGeometry());
    map.removeInteraction(draw);
    document.getElementById("spUserInput").classList.toggle("clicked");
    map.addLayer(clickSelectedFeatureOverlay);
  })
}

function selectFeature(evt){
  if(featureOverlay){
    featureOverlay.getSource().clear();
    map.removeLayer(featureOverlay);
  }
  //Hangi featureye tikladigmzi hem bu sekilde hem de select interactino uzerinden elde edebiliyorduk..
  var selectedFeature = map.forEachFeatureAtPixel(evt.pixel, 
    function(feature, layer){
      return feature;
    }
    )
}

  document.getElementById("srcCriteria").onchange = function(){
    if(queryGeoJSON){
       queryGeoJSON.getSource().clear();
       map.removeLayer(queryGeoJSON);
    }
 
    if(clickSelectedFeatureOverlay){
     clickSelectedFeatureOverlay.getSource().clear();
     map.removeLayer(clickSelectedFeatureOverlay);
    }
 
    if(document.getElementById("spUserInput").classList.contains("clicked")){document.getElementById("spUserInput").classList.toggle("clicked")}
 }
 
 document.getElementById("spUserInput").onclick = function(){
  document.getElementById("spUserInput").classList.toggle("clicked")
  if(document.getElementById("spUserInput").classList.toggle("clicked")){


    if(queryGeoJSON){
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
   }
 
   if(clickSelectedFeatureOverlay){
    clickSelectedFeatureOverlay.getSource().clear();
    map.removeLayer(clickSelectedFeatureOverlay);
   }
  
   //Kulanicin hangi interactioni secer ise select-option da onu aktif hale getirecegiz, point,line veya polygon
   var srcCriteriaValue = document.getElementById("srcCriteria").value; 
   if(srcCriteriaValue == "pointMarker"){
    addInteractionForSpatialQuery("Point");
   }
   if(srcCriteriaValue == "lineMarker"){
    addInteractionForSpatialQuery("LineString");
   }
   if(srcCriteriaValue == "polygonMarker"){
    addInteractionForSpatialQuery("Polygon");
   }

  }else{
    coordList = "";
    markerFeature = undefined;
    map.removeInteraction(draw);
  }
 

}


//KUllanici en ust select-option da once bizim listeledgimz layer lari gorur ki burda da biz bir listeleme tricksi yaptik cunku getCapabiliteis da , geoserver daki tum layer lari getiriyor biz onun yerine, sadece bizim istedgimz 3 tanesini almak istedik...BESTPRACTISE..
//Ardindan kullanici ya hangi tur kriter secmek istedgini sectiriyoruz burda da Within Distance Of yani verilecek distance iceriisndeki alanlari secen query, ya da intersect yani ornegin secilen interaction eger polygon olur ise o polyugon ile cakisan, posizyonlari da getir diyebiliriz diger query secenginin secersek y a d a Completely Within yani tamamen icerisinde bu da mhtemeln polygonlar icin olabilir tmamen o polygon un alani icerisinde olan lari getirecek query i hazirlamak icin
//Ardindan kullaniciya bir input veriyoruz ki oraya mesafe girsin diye ve hemen yanina da unit yani o mesaje metre mi, kilometre mi her ne ise onun cinsini girsin diye..
//Daha sonra da kullanici point, linestring veya polygon dan birini secsin ve select iconuna basinca da bu sectigi hangisii ise onu Draw interaction ile cizebilsin onu istiyoruz ve son olarak Run butonu da artik kullanicinin sectigi kriterlere gore kullanicinn cizdigi point, line veya polygon a verilen mesafedeki vecktorleri point,line veya polygon lari filtrelesin, ve kullaniciya farkli bir style da gosterebilelim!!!!!HARIKA BIR OZLELLIK!!!!

document.getElementById("spQryRun").onclick = function(){
  var layer = document.getElementById("buffSelectLayer");
  var value_layer = layer.options[layer.selectedIndex].value;

  var srcCriteria = document.getElementById("srcCriteria");
  var value_src = srcCriteria.options[srcCriteria.selectedIndex].value;
  var coordList = "";
  var url;
  var markerType = "";
  if(markerFeature){
    if(value_src == "pointMarker")
    {
      coordList = markerFeature.getGeometry().getCoordinates()[0]+ " "+ markerFeature.getGeometry().getCoordinates()[1];
      markerType = "Point";
    }
    if(value_src == "lineMarker"){
      var coordArray = markerFeature.getGeometry().getCoordinates();
      for(var i=0; i<coordArray.length; i++){
          if(i == 0){
            coordList = coordArray[i][0] + " " + coordArray[i][1];

          }else{
            coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
      }
      markerType = "LineString";
    }

    if(value_src == "polygonMarker"){
      var coordArray = markerFeature.getGeometry().getCoordinates()[0];
      for(var i=0; i<coordArray.length; i++){
          if(i == 0){
            coordList = coordArray[i][0] + " " + coordArray[i][1];

          }else{
            coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
                 
      }

      coordList = "(" + coordList + ")";
      markerType = "Polygon";

    }

    //kullanicinin girdigi inputa gore coordinat listesi hazir olunca query nin type ini kontrol etmemiz gerekir
    var value_attribute = $("#qryType option:selected").text();
    if(value_attribute == "Within Distance of"){
      var dist = document.getElementById("bufferDistance");

      //Distance parameter yani distance value ve distanceUnit de secebiliyoruz
      var value_dist = Number(dist.value);
      //value_dist = value_dist / 111.325

      var distanceUnit = document.getElementById("distanceUnits");
      var value_distanceUnit = distanceUnit.options[distanceUnit.selectedIndex].value;
      //Distance value ve distance unit hazir olunca artik query url imizi kullanabiliriz kritlerimiz i kullanabiliriz
      //serverPost yani :9090 ve geoserverWorkspace i yani geo-demo yu dinamik olarak kullanabiliriz
      //url = "http://localhost"+ serverPort +"/geoserver/"+ geoserverWorkspace +"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+%3E+%2715%27&outputFormat=application/json"
      //geoserverWorkspace = geo-demo
      //value_layer=geo-demo:ind_adm12_pg
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=DWITHIN(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
      //BESTPRACTISE-WFS SERVICE UZERINDEN KULLANICININ INPUT ALANINA GIRDIGI DISTANCE ICERISINDE OLAN, POINT VEYA POZISYONLARI GETIRECEK..HARIKA BESTPRACTISE..
      //DWITHIN QUERY FINDING FOR FEATURE WITHIN DISTANCE 
      //Geojson olarak gonder bize output u diyoruz
    }else if(value_attribute == "Intersecting"){
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=DWITHIN(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
    }else if(value_attribute == "Completely Within"){
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=DWITHIN(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
    }

    newaddGeoJsonToMap(url);
    coordList = "";
    markerFeature = undefined;
  }
}

  //BURAYA IYI ODAKLANALIM -  BIZ DOBULCECLICK ZOOM VE DRAGPAN-DRAG AND DROP OZELLIGINI KALDIRIYORUZ, YANI MAPSEARCH QUERY ICONUNA TIKLADIGINDA , DEFAULT OLARAK GELEN DOUBLECLICK-ZOOM VE DRAG AND DROP OZELLIGINI KALDIRIYORUZ...BESTPRACTISE.... 
  var mapInteractions = map.getInteractions();//map  uzerinden de interations lara bu sekilde erisebilirz 
  //getInteractions(){Collection<Interaction>} donen deger openlyaers dan bakabiliriz, Collection<Interaction>
  //Collection larda uzunlugu mapInteractions.getLength() bu sekilde aliriz, bunu Collection dokumantasyonunda da bulabilirz
  for(var x= 0; x < mapInteractions.getLength(); x++){
      var mapInteraction = mapInteractions.item(x);//for-loop icerisinde her bir collection elementine bu sekilde erisilir
      if(mapInteraction instanceof DoubleClickZoom){//Simdi biz tum interactionlarin icinde oldugu collection i donduruyoruz ama, her bir interaction in hangi interaction class indan turetildigini-derived veya hangi interaction class inin bir example i yani instancesi oldugunu bilmiyoruz..ONUN ICIN DE BU SEKILDE CHECK EDEBILIYORUZ..BURASI ISTE HARIKA BESTPRACTISE...BIZ KIMI ZAMAN INTERACTION LAR ARASINDA BIRBIRI ICERISINE GIRMIS AYNI ANDA TETIKLENEN INTERACTIONLARI AYIRT ETMEK, BIRISI CALISIRKEN DIGERI CALISMASIN ISTEYEBILIRIZ...OZELLIKLE BOYLE DURUMLARDA BU KULLANIMI COK FAZLA YAPARIZ... 
        map.removeInteraction(mapInteraction);
        break;
      }
  }


  for(var x= 0; x < mapInteractions.getLength(); x++){
    var mapInteraction = mapInteractions.item(x);

    if(mapInteraction instanceof DragPan){
      map.removeInteraction(mapInteraction);
      break;

    }

  }

//Events listening islemlerini bu sekilde de  yapabiliyoruz.. 
  document.getElementById("qryType").onchange = function(){
      var value_attribute = $("#qryType option:selected").text();
      var buffDivElement =document.getElementById("bufferDiv");
      if(value_attribute == "Within Distance of"){
        buffDivElement.style.display = "block";
      }else{
        buffDivElement.style.display = "none";
      }
  }


  document.getElementById("spQryClear").onclick = function(){
   if(queryGeoJSON){
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
   }

   if(clickSelectedFeatureOverlay){
    clickSelectedFeatureOverlay.getSource().clear();
    map.removeLayer(clickSelectedFeatureOverlay);
   }

   coordList = "";
   markerFeature = undefined;
}


})

//Intersecting Query - Biz vakit kaybetmemek icin, kullanicinin layer i sectigini, query select optoinslari  icerisinden de intersecting i sectigin kabul ediyoruz, intersecting i sectigi zaman distance secmeye gerek yok cunku intersect kullancinin cizecegi vektor-geo-feature ile secilen layer icerisinde bulunan vector-goe-feature ler arasindaki cakisma ile ortaya cikar
//Sonra da kullanicinin point, lineString veya polygon secmesine gore cizdigi bu draw interaction type larina gore intersect olan secilen layer da bulunan vector-geo-feature leri filtreleyip bulacagiz..
//Biz simdi bu intersection ozelligi cizilen drawinteraction type ina gore yani point, lineString veya polygon a gore nasil implemente ediliyor ona bakacagiz..Run butonuna basildiginda gerceklesecek olan islemlere bakacagiz!!!!!!!!!!!
//1-layer secilir(Kullanici nin cizgigi point-line-polygon  ne ise buna intersect olacak olan vector-geo-features leri secilen layer daki feature ler uygulanacak) 2-query olarak instance secilir(Within Distance of- intersecting - Completely within) icerisinden 3 -from dan Point Marker-Line Marker - Polygon Marker dan da birisi secilir ardindan da select iconu var parmak isareti o icona basilinca artik kullanici sectigi point-line-veya polygon her ne ise onu cizer iste buraya kadar geldikten sonra kullanici Run butonuna basinca intersecting query filtreleme islemiini implemente etmis olacaktir...Biz asagida Run butonan basildiktan sonra ki kismi ele alacagiz 

//Intersecting query-Run

document.getElementById("spQryRun").onclick = function(){
  var layer = document.getElementById("buffSelectLayer");//identify-selection layer
  var value_layer = layer.options[layer.selectedIndex].value;//which layer user selected

  var srcCriteria = document.getElementById("srcCriteria");//criteria
  var value_src = srcCriteria.options[srcCriteria.selectedIndex].value;//
  //Kullanici hangi interaction i secti ise select-options dan onun value sidir.. addInteractionForSpatialQuery(intType) fonksiyonu uzerinden secilen type a gore DrawInteraction da point-lineString veya polygon ciziliyordu
  var coordList = "";
  var url;
  var markerType = "";
  if(markerFeature){
    if(value_src == "pointMarker")
    {
      coordList = markerFeature.getGeometry().getCoordinates()[0]+ " "+ markerFeature.getGeometry().getCoordinates()[1];
      markerType = "Point";
    }
    if(value_src == "lineMarker"){
      var coordArray = markerFeature.getGeometry().getCoordinates();
      for(var i=0; i<coordArray.length; i++){
          if(i == 0){
            coordList = coordArray[i][0] + " " + coordArray[i][1];

          }else{
            coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
      }
      markerType = "LineString";
    }

    if(value_src == "polygonMarker"){
      var coordArray = markerFeature.getGeometry().getCoordinates()[0];
      for(var i=0; i<coordArray.length; i++){
          if(i == 0){
            coordList = coordArray[i][0] + " " + coordArray[i][1];

          }else{
            coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
                 
      }

      coordList = "(" + coordList + ")";
      markerType = "Polygon";

    }

    //kullanicinin girdigi inputa gore coordinat listesi hazir olunca query nin type ini kontrol etmemiz gerekir
    var value_attribute = $("#qryType option:selected").text();
    //Eger Within Distance of kriteri secilmis ise o zaman onun altinaki filtrelemeyi uygulayacak demektir.. 
    if(value_attribute == "Within Distance of"){
      var dist = document.getElementById("bufferDistance");

      //Distance parameter yani distance value ve distanceUnit de secebiliyoruz
      var value_dist = Number(dist.value);
      //value_dist = value_dist / 111.325

      var distanceUnit = document.getElementById("distanceUnits");
      var value_distanceUnit = distanceUnit.options[distanceUnit.selectedIndex].value;
      //Distance value ve distance unit hazir olunca artik query url imizi kullanabiliriz kritlerimiz i kullanabiliriz
      //serverPost yani :9090 ve geoserverWorkspace i yani geo-demo yu dinamik olarak kullanabiliriz
      //url = "http://localhost"+ serverPort +"/geoserver/"+ geoserverWorkspace +"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+%3E+%2715%27&outputFormat=application/json"
      //geoserverWorkspace = geo-demo
      //value_layer=geo-demo:ind_adm12_pg
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=DWITHIN(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
      //BESTPRACTISE-WFS SERVICE UZERINDEN KULLANICININ INPUT ALANINA GIRDIGI DISTANCE ICERISINDE OLAN, POINT VEYA POZISYONLARI GETIRECEK..HARIKA BESTPRACTISE..
      //DWITHIN QUERY FINDING FOR FEATURE WITHIN DISTANCE 
      //Geojson olarak gonder bize output u diyoruz
    }else if(value_attribute == "Intersecting"){
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=INTERSECTS(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
    }else if(value_attribute == "Completely Within"){
      url = "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+value_layer+"&CQL_FILTER=WITHIN(geom,"+ markerType +"("+coordList+")," + value_dist  +","+ value_distanceUnit +")&outputFormat=application/json"
    }

    newaddGeoJsonToMap(url);
    coordList = "";
    markerFeature = undefined;
  }
}

//OPENLAYERS-GEOSERVER-POSTGRESQL(POSTGIS)
//WFS-TRANSACTION...INSERT-MODIFY-DELETE..

//Editing Functionalitt(add-modify-delete features)
//Iki tane icon umuz var, birisi settings iconu birisi de startEditing veya Edit buttonu
//Settings iconuna tiklayinca popup acilir ve kullaniciya, hangi layer uzerinde edit yapmak istiyorsa o layer i secer, select-options lar icerisinden
//Edit-icon-button a tiklayinca hemen o icon un yaninda alt alt a 3 icon ortya cikacak ve de start edit iconu aktiv-yesil bakcground-color a sahip olacak..Ve de kullanici hangi layer i secti ise ilk olarak edit yapmak icin o layer a ait tum features ler highlighed yani farkli bir style da gosterilecek ki kullanici icin daha anlasilir olsun hangi features lar uzerinde edit yapilacak
//Ilk start-edit icon butonuna tiklayinca 3 tane sub-icon-buttonlar yaninda alt alta ortaya cikiyordu Bunlar in islevi nedir ona bakalim..1-Addfeature 2-ModifyFeature 3-DeleteFeature
//Ve StartEditIcon undan sonra, gelen 3 tane subbutton ile beraber, 1-AddFeature e tiklayarak bu ozelligi nasil uygulayacagiz buna bakalim
//ADDFEATURE!!!!!
//AddFeature a tiklayinca bizim polygon type inda ki DrawInteraction imiz aktif hale geliyor ve biz ornegin sectimgiz layer evlerden olusan bir layer oldugunu varsayarsak, biz de ornegin istedgimiz herhangi bir veya birkac yere yeni alanlar olusturabiliyoruz..Ekleme islemini uygulamak icin, diger buildgingler yani secilen layer ile gelen buildingler veya alanlar WMS services den gelen feature lerdir
//Simdi sunu anlayalim...kullanici layer sectikten sonra ve de startEdit iconuna basinca o layer a ait features lerin highlighed olmasi ve farkli bir style ile stillenerek gelmesi geoserver dan WMS den service sinden geliyor...Ama ardindan bizim addFeature a tiklayarak yeni alanlar cizmemiz bunlar Geoserver in  bir parcais degil bunlari biz direk map e bizim tarafimizdan eklenen features lerdir, yani map in altinda bir paca olmus oluyorlar...geoserver in bir parcasi degildir 
//Devam edecek olursak islevsellige, kullanici bir kez daha addFeature icon-butonuna tikladigi zaman bize cizdigimz polygonlari kaydetmek isteyip istemedigimzi soracak popup araciligi ile ve biz ok dersek o zaman artik bizim ekledigmz 3 yeni poolygonu da artik geoserver dan gelen layer a database  de ekleyecek -POSTGRESQL-GEOSERVER-OPENLAYERS UCLUSU ILE SUNDGUMUZ LAYER POSTGRESSQL DE BIZIM YENI CIZDGIMZ POLYGONLARI DA EKLEMIS OLACAK
//Ardindan zoom-in, veya zoom-out yaptigimiz zaman hatirlarsak WMS-service icin bu request gondermek ve yeni image datasini, zoom level a gore olan  yeni image data sini fetch etme islemi yapiyordu..Biz startEdit iconunu kapatip zoom-in zoom-out yatigimzda artik ekledigmiz polygonlarinda o layer in wms services ile gelmesini bize gosterilmesini bekliyoruz...
//MODIFYFEATURE!!!!!
//StartEditIcon ve ardindan sub-iconlardan modify iconbutton secilir, ardindan en basta secilen layer a ait polygon feature ler farkli bir style ile karsimzia geliyordu ve kullanici modify-iconuna bastiginda artik kullanci nin sectigi herhangi bir polygon(WMS-service ile geoserver dan gelen) farkli bir style ile fill edilerek gosterilir secildigi anlasilmasi icin ve modify edilmeye hazir demektir bu zaten, yani Modify interactin secilen polygon icin aktif hale getirilmis oluyor, Burda suna dikkat edelim..biz modify interaction i ile secilen polygonun istedgimiz tarafindan genisletebilirken veya istedgimz sekilde polygonu n alanini degistirirken, polygonun ilk hali gri  bir style ile arkada gozukuyor..BU NASIL OLUYORDU HATIRLAYALIM.. SIMDI WMS-SERVICE ILE ONCE SECILEN LAYER IN ICINDEKI POLYGONLAR GRI RENKLI BIR STYLE ILE YAYINLANARAK KULLANILIYOR ARDINDAN ISE KULLANICI START-EDIT E BASINCA, BIR DE AYNI WMS-SERVICE NIN POLYGON FEATURE LARINA STROKE RENKI DEGISTIRILMIS WMS-SERVICE SI DE YAYINLANIYOR(BU ARADA BU WMS DEGIL WFS OLLACAK CUNKU WMS UZERINDE EDIT YAPILAMAZ, WFS UZERINDE EDIT YAPILABILIYOR VE BIZ WFS I DE YAYINLAYABILIYORUZ... ZATEN...DIREK HARITA UZERINDE GOSTERECEK SEKILDE...) GEOSERVERDAN YANI BIZ 1 WMS-SERVICE-1 WFS SERVVICE(1 WMS ALTTA- BIR DE WFS USTTE OLACAK SEKILDE) I BIRDEN KULLANMIS OLUYORUZ ONDAN DOLAYI ASLINDA POLYGONLAR UST USTE GELIYOR BIZ USTTEKI WMS-SERVICE HANGISI ISE ONCE ONU GORUYORUZ USTTE OLAN DEMEK EN SON EKLENEN DEMEKTIR VEYA BIZ ONCELIKLERINI DE ZINDEX OPTION I KULLANARAK DA AYARLAYABILIYORDUK ZATEN!!!!!!YANI KULLANICI MODIFY EDINCE STROKE VERILMIS OLAN WMS-SERVICE DEN GELEN SOURCE YE AIT POLYGON MODIFY EDILDIGI ICIN, ALTTA SADECE GRI STYLE A SAHIP OLAN POLYGON BIZE POLYGONUN ILK HALINI GOSTERMIS OLUYOR..BU KULLANIM HARIKA...GERCEKTEN...COK EFFEKTIF...BIR KULANIM!!!!!!!!!
/*
EXAMPLE OF WFS-SERVICE USAGE ON OPENLAYERS
let wfs_url = 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&outputFormat=application%2Fjson';
 let geoJson = new VectorLayer({
    title:'WFS_layer',
    source: new VectorSource({
      url:wfs_url,
    //  url:wfs_filtered_url,
    // url:wfs_intersect_filtered_url,
    //  url:wfs_bbox_filtered_url,
      format: new GeoJSON(),//geojson veya dier WFS formatiindan birini kullanabiliriz, bu optionslari geoserver da layerpreview da layer select-option da gorebiliriz
      style:style
    })
   })
  
  overlayLayerGroup.getLayers().push(geoJson);
  */
//BU ARADA SUNU DA BILELIM AYNI ANDA BIZ HANGI POLYGONU SECERSEK ONU MODIFY EDEBILIYORUZ!!!VE ORNEGIN 1 TANE POLYGONU MODIFY ETTIK VE BIR DIGERINI MODIFY ETMEK ICIN GECTIK O ZAMAN MODIFY ETTGIMZ POLYGON UN SADECE STROKE U DIGER POLYGONLAR LA AYNI OLUYOR VE O POLYGON ICINDE ZATEN POLYGONUN ILK HALI TAMAMEN GRI STYLE ILE GOSTERILIYOR MODIFY EDILEREK GENISLETILEN YERLERIN FILL I ISE BEYAZ OLARAK KALIYOR VE YENI BIR POLYGON A MODIFY ETMEYE BASLANDIGINDA, O ANDA MODIFY EDILEN POLYGONUN ICI FILL OLARAK STILLENDIRILIYOR VE MODIFY ISLEMLERIMIZ BITTIKTEN SONRA TEKRAR MODIFY SUB-ICON BUTTONUNA TIKLAYINCA BIZE POPUP DA DEGISIKLIKLERI KAYDETMEK ISTEDIGMZI SORACAK VE AYNI SEKILDE BIZ OK DEYIP DEGISIKLIKKLERI KAYDETTIMGZDE VE MODIFYICONBUTTONA PASIF HALE GETIRIP ZOOM-IN VE ZOOM-OUT YAPTIGJIIMZDA REQUEST GONDERILIP YENI IMAGE LER FETCH EDILDIGI ICIN ARTIK KAYDEDILMIS OLUYOR...VE BIZ MODFY ETTGIMZ POLYGONLARI ARTIK MODIFY EDILMIS HALI ILE GOREBILECEGIZ DEMEKTIR

//DELETE THE POLYGON VIA WFS-SERVICE..
//Ayni mantik ile biz delete-sub-iconunu secerek sectigmiz bir polygonu silebiliyoruz, sub-delete-icon una tiklandiktan sonra sectigmiz bir polygon uzerine tiklayinca bize popup da tikladgimz polygonu silmek istedgimzi soruyor eger OK e tiklarsak
//YANI KISACA OZETLEYECEK OLURSAK BENIM ANLADGIMIZ BIZ WFS-SERVICE UZERINDEN BIR LAYER IMIZDA YENI BIR FEATURE EKLEME, VEYA BIR FEATUER U MODIFY ETME YA DA BIR FEATURE YI DELETE ETME DURUMUNDA BU POSTGRESQL DEKI TABLO YA DEGISTIRILIYOR DOLAYISI ILE SONRASINDA GEOSERVER DA BU LAYER YA BU SHAPE FILE UZERINDEN YAYINLANAN TUM WMS-WFS SESRVICELER BU SHAPEFILE I KAYNAK OLRAK KULLANDIGI ICIN HEPSI GUNCELLENMIS OLUYOR VE BIZE DE BU GUNCELLENMELER YANSIMIS OLUYOR!!!!!!!
//ADD-MODIFY-DELETE ISLEMLERINI YAPTIKTAN SONRA STARTEDIT VE SUBICONLARI DISABLED HALE GETIRIP SONRA ZOOM-IN ZOOM-OUT YAPARAK DENEMELIYIZ...O ZAMAN DEGISIKLIKLERI ALIYORUZ

//YUKARDA SU ANA KADAR YAPTIKLARIMIZ POLYGON-BUILDIGNS FEATURE LER ICINDI BIZ BUNUN AYNISINI ORNEGIN ROADS ISIMLI LAYER SECERSEK, O ZAMAN BUTUN BUNLARI LINESTRING LER ICIN SPESIFIK ROUTE LER ICIN DE UYGULAYABILIRIZ

//ZOOM-IN ZOOM-OUT YAPTGIMIZDA VERI UPDATE EDILMIS BIR VERITABANINDA GELSE DE VERITABANINDAN SHAPE FILE GEOSERVER DA SERVICE LERI HAZIRLIYOR VE HER ZOOM-IN ZOOM-OUT DA  REQUEST-RESPONSE SURECI ISLIYOR VE IMAGE DATA-WMS ICN FETCH EDILIYOR WFS ICINDE VECTOR DATA FETCH EDILIYOR..DEGISIKLIKTEN SONRA AMA SAYFA YI YENILEDGIMZ ZAMAN ARTIK  YENI EKLEDIGMZ LINESTRING LERDE DAHA ONCE VAR OLANLAR LA BIRLIKTE GELECEK...


//LAYER LARIN GEOSERVERDAN CEKILEREK DROPDOWN-LIST- SELECT OPTIONS LAR ICERISINDE ASAGIDAKI GIBI GETIRILIYORDU 
/*
  function addMapLayerList(){
    console.log("addMapLayerList")
    $(document).ready(function(){
      $.ajax({
        type:"GET",
        url:"http://localhost:9090/geoserver/wfs?request=getCapabilities",
        datatype:"xml",
        success:function(xml){
          console.log("xmlxmlxmlxml: ", $(xml))
          var select = $("#selectLayer");
          select.append("<option class='ddindent' value='' ></option>");
          $(xml).find("FeatureType").each(function(){
            
            $(this).find("Name").each(function(){
            
              var value = $(this).text();
          //    console.log("value::::::", $(this).text());
              select.append("<option class='ddindent' value='" + value +"' >"+ value+"</option>");
            })
          })
        }
      })
    })

    BESTPRACTISE..JQUERY ILE BIZ BIR HTML TAG ININ REFERANSI UZERINDEN ICERIGINI BOSALTABILIYORUZ YANI JAVASCRIPTTE  YAPTIGIMZ
    let div = document.getElementById("div-content");
    div.innerHTML = "";
    Bunun aynisini jquery de su sekilde yapiyoruz 
    let div = $("div-content");
    div.empty(); diyerek bu sekilde daha anlasilir ve daha pratik bir sekilde yapabiliyrouz..
  */

    var editgeojson;
    var editLayer;
    var modifyFeatureList = [];
    var editTask;
    var editTaskName;
    var modifiedFeature = false;
    var modifyInteraction;
    var featureAdd;
    var snap_edit;

    //Bu kullanicinin laye lar arasinda sectigi layer i start-edit icon-buttona basinca highlighet style yapmasi islemindeki layerdir, yani hightlight edilen, secilen layer in hightligh edilmesinde kullanilacak olan islemdir ilk basta dikkat edelim, source tamamen bos bunu takip edelim nasil soure nin dolduruldugunu
    var selectedFeatureOverlay = new VectorLayer({
      title:"Selected Feature",
      source:new VectorSource(),
      map:map,
      style:highlightStyle
    })

    // var startEditingButton  = document.createElement("button");
    // startEditingButton.innerHTML = "<img"
    // startEditingButton.className


    //BIZ BURDA ADD-EDIT-DELETE ISLEMLERI NASIL GERCEKLESIYOR GEOSERVER UZERINDEN BUNLARA ODAKLANACAGIZ.. ZAMAN KAYBETMEMEK ICIN 

       //serverPost yani :9090 ve geoserverWorkspace i yani geo-demo yu dinamik olarak kullanabiliriz
      //url = "http://localhost"+ serverPort +"/geoserver/"+ geoserverWorkspace +"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+%3E+%2715%27&outputFormat=application/json"
      //geoserverWorkspace = geo-demo
      //edit_layer=geo-demo:ind_adm12_pg
      //STARTEDITING ICON BTN SINE TIKAYINCA SECILEN LAYER A AIT FEATURES LER HIGHLIGHED OLUYORDU YANI FARKLI BIR STYLE ILE STILLENEREK GELIYORLARDI ISTE BU ISLEVIN GERCEKLESTIGI YER TAM OLARAK BURASIDIR...
      //It is createing temporarily layer, it is fetching geogjson of that particular layer, geoserver dan istenilen kismi fetch ediyor, layer imizi workspace imizi sectikten sonra bounding-box kullanilarak, url olusturuyoruz ondan dolayi da VectorSource icerisinde option olarak da strategy:bbox kullandik
      //Bu secilen layer in edit lenmek icin map  uzerinde  hazir olmasini saglayan islemdir...COOK ONEMLI BURASI...DIKKAT EDELIM..
      //YANI KULLANICI START-EDIT ICONUNA BASINCA BU WFS-LAYER I MAP E EKLEYEREK EDIT E HAZIR HALE GETIRIYOR, KULLANICI START-EDITING ICON BTN A BASINCA BU SEFER DE O WFS-SOURCE UZERINDEN OLUSTURULAN LAYER I KALDIRIYOR..TAM OLARAK ISLEVI ANLAYALIM...YANI KULLANICIYA TOGGLEMANTIGINDA SUNULDUGU ICIN KULLANICI BIRKEZ DAHA BASTIGI ZAMAN, MAP.REMOVELAYER(EDITGEOJSON) DIYEREK WFS-SOURCE UZERINDEN EDIT EDILMEK ICIN GETIRILEN LAYER KALDIRILMIS OLACAK..
    editgeojson = new VectorLayer({
      title:"Edit Layer",
      source:new VectorSource({
        format:new GeoJSON(),
        url:function(extent){
         
          return "http://localhost:9090/geoserver/"+geoserverWorkspace+"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="+ editLayer+"&"+ "outputFormat=application/json&srsname=EPSG:3857&" + "bbox=" + extent.join(",")+ ",EPSG:3857";
          //Burda extend sayesinde kullanici zoom-in zoom-out yaptiginda dinamik olarak datayi getirecek
          /*
          ol.source.Vector e gidersek ordan da url option icerisindeki function alternativine tiklarsak ...
          FeatureUrlFunction()
          featureloader.js, line 36
          VectorSource sources use a function of this type to get the url to load features from.

          This function takes an Extent representing the area to be loaded, a {number} representing the resolution (map units per pixel) and an Projection for the projection as arguments and returns a {string} representing the URL.
          */
        },
      
        //import {bbox} from 'ol/loadingstrategy';
        strategy:bbox
      }),
      style:style//Bu yukarda point,line ve polygon feature icin tanimlanacak olan, styledir...
    });
    map.addLayer(editgeojson);

    //ADDFEATURE A BAKALIM NASIL GERCEKLESIYOR
    //Biz durumlarin iyi karmasiklastigi zamanlarda... status u cok aktif kullanmaliyz burda tabi status u hem boolean olarak true-false hem de status durumuna spesifik isimler atayarak da kullanabiliriz.. ornegin operationStatus="insert";  operationStatus="edit"; operationStatus="delete"; seklinde ozel durum tanimlamalari  y apmamiz gerekebilir bunlar cok onemlidir...bunlar uzerinden bazi karmasik islemleri daha kolay hale getirebiliriz.

    function addFeature(){
      //Bir onceki edit ozelliginden bir layer vs var ise onlari bir silelim ona ait interaction i bir kaldiralim
      if(clickSelectedFeatureOverlay){
        clickSelectedFeatureOverlay.getSource().clear();
        map.removeLayer(clickSelectedFeatureOverlay);
      }
      if(modifyInteraction){
        map.removeInteraction(modifyInteraction);
      }
      if(snap_edit){
        map.removeInteraction(snap_edit);
      }
      //Draw interaction i biz kaynak olarak, start-edit iconuna basillinca fetch etttgimz wfs-source den getirdigmz layer in source sini kullanacagiz tabi ki cunku o layer-features lari uzerine yeni feature ekleme girsiminde bulunacagiz
      var interactionType;
      source_mod = editgeojson.getSource();
      drawInteraction = new Draw({
        source:editgeojson.getSource(),
        type:editgeojson.getSource().getFeatures()[0].getGeometry().getType(),
        //DINAMIK OLARK-TYPE A ERISIYORUZ...Burasi da enteresan bir yaklasim olmus, direk uzerinde islem yapacagiz layer in feature type i ne ise o type daki interaction i calistiriyor ama tabi burdaki varsayim her layer icindeki feature ler ya polygon, ya lineString-route ya da location-point ..
         style:interactionStyle//BURASI ONEMLI CUNKU EKLEDGIMZ POLYGON VEYA LINESTRING VEYA POINT I EKLENDIGI VEYA MODIFY EDILME DURUMUDNA SPESIFIK BIR STYLE ILE YAPIYUORUZ KI DAHA IYI VE NET ANLASILSIN NE  YAPTGIMZ
      })
      map.addInteraction(drawInteraction);
      //SNAPINTERACTION I DA EKLIYORUZ-SNAPPING NEDIR ONU ANLAYALIM..SNAPPING INTERACTION EKLEYINCE, BIZ LAYER UZERINDE KI HANGI FEATURE UZERINE GIDERSEK YUVARLAK KUCUK BIR DAIRE UZERINE GITGIMIZ POLYGON, LINESTRING VEYA POINT BUNLARI ISARET EDIYOR...BUNLARIN UZERINDE DOLASIYOR..AMA MODIFY-INTERACTION ILLE KARISTIRMAYALIM..MODIFY-INTERACTION DA UZERINDE BU SEKILDE YUVARLAK BIR CIRCLE ISARET EDIYORSA BU ARTIK O FEATURE NIN MODIFY EDILEBILECEGI ANLAMINA GELIYORDU, SNAP ISE SADECE HANGI FEUTURE UZERINE MOUSE ILE GELIRSEK ONU BIZE GOSTERIYOR
   
      snap_edit = new  Snap({
        source:editgeojson.getSource()
      })
      map.addInteraction(snap_edit);
      drawInteraction.on("drawend", function(e){
        var feature = e.feature;
        feature.set("geometry", feature.getGeometry());
        //Yeni bir polygon,lineString veya point cizildiginde, cizilme islemi sona erdiginde, cizilen feature u biz burda aliyoruz son halini ve direk biz yeni cizilen tum feature leri modifiedFeatureList arrayimize ekliyoruz..
        modifiedFeatureList.push(feature);
      })

    }
    //Simdi cizilen yani yeni eklenen feature leri de modifiedFeatureList array imiz icerisine aldigmza gore artik bu yeni eklenen feature leri backend e yani database nasil gonderecegiz...NASIL bunlari source mize ekleyecegiz..buna bakalim..
    //Sunu da bilelim ki, drawinteraction map uzerine tikladgimz anda baslar cift tikyalana kadar devam eder, ve cift tiklayinca artik draw-interaction sona erer
    //Simdi kullanici orngein 2 tane polygon cizdi ve bunlari modifiedFeatureList array i icerisine ekledik 
    //Kullanici ekleme icin cizecegi polygon-lineString veya point ler i cizdikten sonra tekrar addFeature sub-icon-Btn ye tiklamasi gerekiyordu bir sojrnaki adima gecebilmesi icin ve kullaniciya Do you want to save edits? diyr soruluyor ok diye basar ise eger o zaman da saveEdits fonksiyonu invoke ediliyor parametresine editTask  yani hangi islemi yapacaksak onu gonderiyoruz ki yapacagmiz islemin update-insert mi oldugunu ayirt edebilelim..

    var clones = [];
//editTaskName = "insert";
    function saveEdits(editTaskName){
        clones = [];
        //Tum modifyFeatureList icindeki eklenen veya uzerinde modify yapilan feature leri dondurerek uzerinden gececegiz ve her bir feature dan clone olusturacagiz
        for(var i = 0; i < modifiedFeatureList.length; i++){
           var feature = modifiedFeatureList[i];
           var featureProperties = feature.getProperties();

           delete featureProperties.boundedBy;
           /*
            clone(){Feature}
            Feature.js, line 155
            Clone this feature. If the original feature has a geometry it is also cloned. The feature id is not set in the clone.
            Returns:
            The clone.
           */
           var clone = feature.clone();
           //HARIKA BESTPRACTISE--FEATURE LARI KLONLAMAK
           //The feature id is not set in the clone.Id clonlanmadigi icn id yi biz manuel olarak set ederiz...yani biz featureyi hatirlayacak olursak, kopyalayarak bir dizi icerisinde kendimiz tuttugm zaman feature leri biz muhafaza edemiyorduk yani feature lar her zaman en guncel, en son feature ne ise onu aliyordu eger clone kullanmadan yaparsak, yani biz normal dizi icerisinde tutarak yapamadigmiz feateure muhafaza etme islemini clone ile yapabiliyoruz ama clone isleminde de id yi set etmedigi icn artik onu da biz manuel olarak  yapiyoruz...
           clone.setId(feature.getId());

           //if (editTaskName != "insert"){clone.setGeometryName("the_geom")};
           clones.push(clone);
           //if (editTaskName == "insert"){transactWFS('insert', clone);}

           if (editTaskName == "update"){transactWFS('update_batch', clones);}
           if (editTaskName == "insert"){transactWFS('insert_batch', clones);}

        }

        //import WFS from 'ol/format/WFS.js';
        var formatWFS = new WFS();

        //HATIRLARSAK BIZ WFS-UZERINDE UPDATE ISLEMLERINI WFS-TRANSACT ILE YAPIYORDUK...BUNU UNUTMAYALIM!!!!
        //BIZ DATAYI WFS-TRANSACTION DA GML FORMAT UZERINDEN DATABASE EKLEYEBILYIORUZ, DATABASE DE EDIT VE DELETE ISLEMLERINI GERCEKLESTIREBILIORUZ BUNUU UNUTMAYALIM...
        //BU WFS-REQUEST ADD-FEATURE REQUEST ISLEMDIIR
        var  transactWFS = function(mode, f)
        {
            var node;
            //import GML from 'ol/format/GML.js';
            //BESTPRACTISE..GEOSERVER UZERINDEN WFS-TRANSATION- CRUD OPERASYONLARI INSERT-UPDATE-DELETE BUNUN UZERINDEN YAPILDIGI ICIN GML FORMAT  YAPISINI COK IYI OGRENMEMIZ GEREKIYOR...
            var formatGML = new GML({
              //featureNS:"http://argeomatica.com",
              featureNS:geoserverWorkspace,
              //featureType:"playa_sample"
              featureType:editLayer,
              service:"WFS",
              version:"1.1.0",
              request:"GetFeature",
              srsName:"EPSG:3857"
            });

            //switch-case icerisinde kullanilacak veya yapilacak transaction-islem-operation a gore o transaction in text-i insert-update verilmesi ve bunun swtich-case icerisinde transactin a gore process den gecirilmesi gercekten reel projelerde de kullanilan gayet surdurulebilir bir islevdir..Bu islevi cok ciddiye almaliyiz...PHP DE DE BU VE BUNA BENZERI KULLANIMLARI HER ZAMAN DIKKATE ALMALIYIZ!!
            switch(mode)
            {
              /*
                writeTransaction(inserts, updates, deletes, options){Node}
                  format/WFS.js, line 591
                Encode format as WFS Transaction and return the Node.
              */

                  case "insert":
                    //parametredeki , f eklemek istedigmiz feature listesi, sonra da 4.parametre olarak GML format i veririz ve bu sekilde transaction request olusturuluyor
                    node = formatWFS.writeTransaction([f], null, null, formatGML);
                    break;

                    //BURASI INVOKE EDILECEK ILK ADDFEATURE SUB-ICON-BUTTTON 2.KEZ TIKLANIP DA CONFIRM DEN OK E TIKLANINCA!
                    //It will create the GML core, to support insert-functionality, bu geoserver tarafindan bir requirenementtir..
                    //Eger geoserver WFS-transaction larinda ne tur requirementleri var bunu bilmek istersek localhostta kurdugmzu Geoserver imza login yapariz ve sol sidebar en alttaki Demos a tiklariz->Demo requests->WFS_transactionInsert.xml i seceriz bize sample insert-request kodu verir bizden talep edilen, requirements lari burdan gorebiliriz
                    //Burda zaten gml dataformati kullanildigini goruyoruz
                    /*
                    Request:WFS_transactionInsert.xml
                    URL:http://localhost:9090/geoserver/wfs

                    <!--
      YOU PROBABLY DO NOT WANT TO RUN THIS QUERY SINCE 
       IT WILL MODIFY YOUR SOURCE DATA FILES
       
       It will add a simple line to the tasmania_roads dataset.
       
          -->
        <wfs:Transaction service="WFS" version="1.0.0"
          xmlns:wfs="http://www.opengis.net/wfs"
          xmlns:topp="http://www.openplans.org/topp"
          xmlns:gml="http://www.opengis.net/gml"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads">
          <wfs:Insert>
            <topp:tasmania_roads>
              <topp:the_geom>
                <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                  <gml:lineStringMember>
                    <gml:LineString>
                      <gml:coordinates decimal="." cs="," ts=" ">
        494475.71056415,5433016.8189323 494982.70115662,5435041.95096618
                      </gml:coordinates>
                    </gml:LineString>
                  </gml:lineStringMember>
                </gml:MultiLineString>
              </topp:the_geom>
              <topp:TYPE>alley</topp:TYPE>
            </topp:tasmania_roads>
          </wfs:Insert>
        </wfs:Transaction>
                    */
                  case "insert_batch":

                  node = formatWFS.writeTransaction(f, null, null, formatGML);
                  break;  
                  case "update":

                    node = formatWFS.writeTransaction(null, [f] , null, formatGML);
                    break;
                  
                  case "update_batch":
                  node = formatWFS.writeTransaction( null, f, null, formatGML);
                  break;  

                  case "delete":
                  node = formatWFS.writeTransaction( null, null,[f], formatGML);
                  break; 

                  case "delete_batch":
                  node = formatWFS.writeTransaction( null, null,[f], formatGML);
                  break; 
            } 
//node dedgimiz tum instructionlari tasiyan
            var xs = new XMLSerializer();
            var payload = xs.serializeToString(node);
            /*
            writeTransaction(inserts, updates, deletes, options){Node}
            format/WFS.js, line 591
            Encode format as WFS Transaction and return the Node.

            In OpenLayers, when you want to send a WFS transaction to a server (such as GeoServer) to insert new features into a PostGIS database, you need to create an XML payload containing the necessary information about the features. This XML payload follows the specific format defined by the WFS (Web Feature Service) specification.
            The formatWFS.writeTransaction function is used to generate this XML payload from the features you want to insert. 
            The function takes parameters such as the features to be inserted, the feature type namespace, and the feature type name.
            Once you have generated the XML payload using formatWFS.writeTransaction, you need to convert it into a string to send it as part of the request to the server. This is where serialization comes into play.
            Serialization is the process of converting an object (in this case, the XML payload) into a format that can be easily transmitted over a network. 
            In JavaScript, you can serialize an XML object into a string using the XMLSerializer API. The XMLSerializer allows you to convert an XML object into a string representation.
            By calling xs.serializeToString(node), you are serializing the generated XML payload (stored in the node variable) into a string format.
            This serialized string can then be included in your request payload or sent to the server using AJAX or another method.

            In summary, serializing the XML payload is necessary to convert it into a string representation that can be transmitted to the server when performing a WFS transaction.
            */
           payload = paylad.split("feature:" +  editLayer).join(editLayer);
           //Buraya dikkat etmeliyz..The core will generate feature attributename in the form of geometry, but in our database geometry is geom attribute..Bizim database eimzde attribute olarak geometry ne ise onu verecegiz  joinden sonra
           /*
           Geoserver a gidip de Layers listesinden uzerinde islem  yapacaimgz ya da iste wfs_transactioninsert islemi  yapacagimz layer a bakarsak 
           geom	MultiPolygon	true	0/1
           attriubte isimlerini gorebiliriz...ayni sekilde POSTGRE SQL UZERINDE DE SELECT * FROM ... ILE GOREBILIRIZ
          
           */
           if(editTask == "insert") { payload.split(geoserverWorkspace + ":geometry").join(geoserverWorkspace + ":geom"); }

           if(editTask == "update") { payload.split("<Name>geometry</Name>").join("<Name>geom</Name>"); }
           // payload = payload.replace(/feature:editLayer/g,editLayer);

           //URL:http://localhost:9090/geoserver/wfs demo da verilen url i giriyoruz burda
           $.ajax("http://localhost:9090/geoserver/wfs", {
            type:"POST",
            dataType:"xml",
            processData:false,
            contentType:"text/xml",
            data:payload.trim(),
            success:function(data){
              //console.log("building updated");
              //success olursa database e kaydetmis olacak basarili bir sekilde 
              console.log("You have done your insert or update transaction succesfully");
            },
            error:function(e){
              var errorMsg = e ? (e.status + " " + e.statusText) : "";
              alert("Error saving this feature to Geoserver <br><br>" + errorMsg);            }
           }).done(function(){

            //BESTPPRACTISE....BIZ BIR LAYER IMZA AIT SOURCE YI EGER REFRESH ETMEK ISTERSEK BU SEKILDE YAPABILIRIZ....
              editgeojson.getSource().refresh();
           })
        }
    }

    //BESTPRACTISE--SECILEN BIR FEATURE YI BIZ, PRATIK OLARAK MAP UZERINDEN ASAGIDAKI GIBI BULABILIYORDUK!!
    var selectedFeature = map.forEachFeatureAtPixel(evt.pixel,function(feature,layer){
      return feature;
    })
    //BU SEKILDE EGER BIR FEATURE SECILMIS ISE ONA ERISEBILIYORDUK!!! 
    //AYRICA DA SELECT-INTERACTION ILE DE SECILEN FEATURE A ERISEBILIYORDUK..BULABILIYORDUK KULLANICI TARAFINDAN SECILEN FEATURE YI

    //MODIFY-INTERACTION IN modifyend eventinii nasil kullanacagmiza bakmak icin  openlayers da Fires: altindaki modifyend kisminda parametre de gozuken ModifyEvent linkinin uzerine tiklyaarak ModifyEvent i nasil kullanabilegimze bakabiliriz
//modifyend (ModifyEvent) - Triggered upon feature modification end
//ModifyEvent a tiklayinca Members: Members demek event. diyerek erisebilecegimz ozellikler demektir 
//Members:
//features{Collection<Feature>} event.features bize Collection icerisinde fature donuyormus o zaman biz bu icerisinde Feature olan Collection i dondururken for-dongusu ve de her bir collection elemanina erisirken, e.features.item(0)["id"] seklinde erisiyoruz...
    modifyInteraction.on("modifyend", function(e){
      modifiedFeature = true;
      featureAdd = true;
      if(modifiedFeatureList.length > 0){
        for(var j = 0; j < modifiedFeatureList.length; j++){
          if(e.features.item(0)["id"] == modifyFeatureList[j]["id_"]){
            featureAdd = false;
          }
        }
      }
    })

    //INSERT-MODIFY ISLEMI YUKARDAKI GIBI OLUYOR SIMDI WFS-TRANSACTIONDELETE ISLEMINE ODAKLANALIM!!! 

    function selectFeatureToDelete(evt){
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
      var selectedFeature = map.forEachFeatureAtPixel(evt.pixel,function(feature,layer){
        return feature;
      })

      if(selectedFeature){
        clones = [];
        var answer = confirm("Do you want to delete selected feature?");
        if(answer){
          var feature = selectedFeature;
          var featureProperties = feature.getProperties();
          /*
          In OpenLayers, the "boundedBy" property is automatically added to features when they are read or parsed from a data source. It represents the bounding extent of the feature's geometry. The "boundedBy" property is typically used for optimizations or spatial indexing purposes.

          In the given code, it seems that the intention is to remove the "boundedBy" property from the featureProperties object before cloning the feature. The purpose of doing this could be to exclude the "boundedBy" property from being included in the cloned feature's properties. By removing this property, it ensures that the cloned feature does not have the "boundedBy" property set.
          */
          delete featureProperties.boundedBy;
          var clone = feature.clone();
          clone.setId(feature.getId());
          
          clones.push(clone);

          if (editTaskName == "update"){transactWFS('update_batch', clones);}
          if (editTaskName == "insert"){transactWFS('insert_batch', clones);}
          if (editTaskName == "delete"){transactWFS('delete', clones);}
        
        }
      }
    }

    //LIVE ATTRIBUTE SEARCH-JUST LIKE GOOGLE 
    //Sag ustte kucuk bir arama kutusu var kullanici ustune gittiginde bu kutu sola dogru genisleyerek search-input haline gelecek ve sonrasinda kullanici 3 harf aradiginda, o harflerin icinde bulundugu ne kadar deger var ise layer larda, yani geoserver dan yayinladimgiz wms-veya wfs layer lar icerisindeki-postgresql(postgis) den geoserver uzerinden yayinladigmiz yani..data dan arama yapacak ve aranan dataya uyan datalari getirecek ve kullanici listelenen ornegin city veya state lerden birine tiklayinca da o city ye hem zoom-in yapacak hem de o city ye ait style i fill-olarak highlighed hale getirecek!!ozellik bu sekilde olacak google-map-search de oldugu gibi 

    var txtVal = "";

    var inputBox = document.getElementById("inpt_search");
    inputBox.onkeyup = function(){
      var newVal = this.value.trim();
      if(newVal == txtVal){

      }else{
        txtVal = this.value;
        txtVal = txtVal.trim();
        if(txtVal !== ""){
          if(txtVal.length > 2){
            clearResults();//Daha once gosterilen veya listelenen elementler temizlenir once
            createLiveSearchTable();//Burda 1 kez table olusturuluyor ve response geldikce de row lar olusturuluyor buraya dikkat edelim

            //HEM DISTRICTLAYER ICINDE HEM DE STATELAYER ICERISINDE ARAMA YAPMAK ICIN, IKI TABLO YA DA AYRI AYRI 2 TANE API CALL-REQUEST GONDERIYOR...DIKKKAT EDELIM...
            $.ajax({
              url:"resources/custom/fetch.php",
              type:"post",
              data:{request:"liveSearch", searchTxt:txtVal, 
              //searchLayer is table, districtLayerName, districtTable - polbnd_ind
              searchLayer:"public."+ districtLayerName, searchAttribute:"laa"},
              dataType:"json",
              success:function(response){
                //server dan backend den data yi aldiginda, rows u olusturuyor
                createRows(response, districtLayerName);
              }
            });
          $.ajax({
            url:"resources/custom/fetch.php",
            type:"post",
            data:{request:"liveSearch", searchTxt:txtVal, 
            //searchLayer is table, districtLayerName, districtTable - 
            //geo-demo:ind_adm12_pg - ind_adm1
            searchLayer:"public."+ stateLayerName, searchAttribute:"name_1"},
            dataType:"json",
            success:function(response){
              //server dan backend den data yi aldiginda, rows u olusturuyor
              createRows(response, stateLayerName);
            }

          })  

          //AJAX- ISLEMI VE KULLANICININ GIRDIGI SEARCH TEXT INE GORE VERITABANINDAN FILTRELEME YAPILARAK SEARCH-INPUT A GIRILEN TEXT IN ARANMASI OLAYI TAMAMEN BU AJAX-PHP ARASINDA BIR DURUMDUR MAP ILE ILGILI COK BIR DURUM YOK... 
          //VERITABANINDAN ARANAN TEXT IN ICINDE BULUNDUGU KAYITLAR LISTELENDIKTEN SONRA, TIKLANAN ORNEGIN CITY NI HARITA DA HIGHLIGHED STYLE VE DE TIKLANAN CITY YE ZOOM-IN OLMA OZELLIGI ISE OPENLAYERS ILE GEOSERVER WFS-CQL_FILTER SERVICE DE SECILEN CITY HANGISI ISE ONUN ILE ILGILI VERITABANINDAN GELEN KAYITLARDAN, GEOSERVER-WFS-SOURCE DE FITLRELEMEDE KULLANILACAK PARAMETRELERIN GONDERILMESI ILE BIR GEOSERVER WFS-CQL_FILTER  URL I OLUSTURULARAK BU URL OPENLAYERS DA VECTORLAYER OLUSTURULUP O VECTORLAYER ICERISINDE KULLANILACAK SOURCEYE URL OLARAK KULLANILARAK REQUEST GONDERILMIS OLUR VE GEOSERVER-WFS-SOURCE DEN DATALAR OPENLAYERS ARACILIGI ILE MAP A BASILMIS OLUR BU SEKILDE...



  //BURASI ONEMLI....ONCLICK METHODUNA PARAMETREYE MAP UZERINDEN WFS-FILTER REQUEST URL I HAZIRLANIRKEN KULLANILACAK, DEGERLER KULLANILIR...ONEMLIDIR..
//createRows icerisinde tr- icindeki td icerisine yani bulunan, match olan data nin icerisinde listelenecegi td icerisine attribute ler eklenir bunlardan bir tanes ide "onClick" attribute u set edilir karsiliginda ise if(layerName == stateLayerName){td2.setAttribute("zoomToFeature(this,\''+ stateLayerName + '\', \'' + key2)";}else if(layerName == districtLayerName){td2.setAttribute("zoomToFeature(this,\''+ districtLayerName + '\', \'' + key2)";}

function zoomToFeature(featureName, layerName, attributeName){
  map.removeLayer(geojson);
  var value_layer = layerName;
  var value_attribute = attributeName;
  var value_operator = "==";
  var value_txt = featureName.innerHTML;
  var url= 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+ value_layer+'&CQL_FILTER='+ value_attribute + '+' + value_operator + '+"'+ value_txt + '"id_1+>+"15"&outputFormat=application/json';
  //url-http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo:ind_adm12_pg&CQL_FILTER=id_1+>+'15'&outputFormat=application/json
  //Kullanici arama kutucuguna arayacagi text i yazip o text e match olan liste nin layer lar icinden gelmesi bizim bildigmz veritabanindan data bulma islemidir..ajax uzerinden bunu php de yapiyoruz ama mathc olan liste icerisinden tiklanan city-veya state e gore map uzerinden filtrleme olmasi ve o secilen city niin hem highlighted ve hem de zoom-in olmasi o secilen city ye iste bunlar WFS-FILTER ISLEMI YAPILARAK MEYDANA GELEN ISLEMLERDIR....
  //newaddGeoJsonToMap fonks icerisinde vectorLayer olusturuluyor vectorSource si ile birlikte ve vectorSource icerisine url olarak parametreden gelen url kullaniliyor ve de yani kullanicinin sectigi attribute value si, operator u , value_txt i value_layer i veriliyor...
  newaddGeoJsonToMap(url)
}




          }
        }
      }
    }