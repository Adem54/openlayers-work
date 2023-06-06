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

  var mapInteractions = map.getInteractions();//map  uzerinden de interations lara bu sekilde erisebilirz 
  //getInteractions(){Collection<Interaction>} donen deger openlyaers dan bakabiliriz, Collection<Interaction>


})