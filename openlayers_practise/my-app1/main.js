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
  helpTooltipElement.classList.add("hidden");
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

//HOW TO ADD ATTRIBUTE QUERY - 
//BIR LINKE TIKLANILDIGI ZAMAN QUERY ISLEMI YAPAN KUTU ACILACAK VE ICERSINDEN SECENEKLER SECILIP MAP UZERINDE VERITABANINDAN QUERY CALISTIRACAK
//query dialob box u gosterebilmek icn html icerisine component ekleyecegiz
//Select Layer- once layer secilecek.. yani geoserver da yayinlanmis wms-layer lar arasindan layer secilecek  
//Sonra o secilen layer ornegin india_adm1_pg yi sectik bu secilen wms-layer nedir postgres-postgis den tablo olarak gelen bir tablodur ve o tablonun kolonlari ise attribute dur ... Bu attribute icerisinden bir attribute secilecek Select Attribute diyerek 
//Sonra Select operator LIKE-EQUAL TO DIYEREK BIRI SECILIR 
//Ardindan da Enter Value diyerek bir input dan kullanicdan deger alinir ve bu deger kullanilark, query olusturulur ve o gelen query harita uzerinde farkli style ile stillendirilerek kullaniciya secilen query-filtreleme harita uzerinde vektor data olarak sunulmus olur hem de kullanici karsisina ayrica bir dikdortgen popup ile tum datalar gosterilecek ve de popup uzerindeki data lardan birine tiklaninca o direk harita uzerinde o data hangi alana karsilik geliyorsa ona zoom-in yapip(highlighted olacak) farkli style ile stillendirilecek
//Ve butun bu islemler icin biz sol da bir query iconu koyacagiz query iconuna bir kez tiklayinca bu ozellikler kullanilabilecek, 2.kez tikladgimizda ise bu ozellklerin tamami kaybolacak, yani toggle mantiginda yapacagiz




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
  queryButton.classList.toggle("clicked");
  queryFlag = !queryFlag;
  if(queryFlag){
    
    document.querySelector(".attQueryDiv").style.display = "block";
  }else{
    
    document.querySelector(".attQueryDiv").style.display = "none";
   
  }
})

map.addControl(queryControl);

let selectLayer = document.querySelector("#selectLayer");
let selectHTML = ``; 


map.getAllLayers().forEach(layer=>{
  if(layer.get("title")){
    selectHTML +=`<option `;
     selectHTML+=   layer.get("title") == 'None' ? 'disabled' : '';
     selectHTML+=  `>`;
    selectHTML+= layer.get("title")
    selectHTML +=`   </option>`;
  }
})
    



selectLayer.innerHTML = selectHTML;

console.log(map.getAllLayers())