import './style.css';
import {Map, Tile, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import VectorTile from 'ol/source/VectorTile.js';
import LayerGroup from 'ol/layer/Group.js';
import BingMaps from 'ol/source/BingMaps.js';
import XYZ from 'ol/source/XYZ.js';
import CartoDB from 'ol/source/CartoDB.js';
import TileDebug from 'ol/source/TileDebug.js';
import Stamen from 'ol/source/Stamen.js';
import TileArcGISRest from 'ol/source/TileArcGISRest.js';
//Simdi burda biz OSM-Open street map i bizim tile layer imiz icinde kullaniyoruz
import TileWMS from 'ol/source/TileWMS.js';
import Attribution from 'ol/control/Attribution.js';
import {defaults} from 'ol/control/defaults';
import ImageLayer from 'ol/layer/Image.js';
import Static from 'ol/source/ImageStatic.js';
import MVT from 'ol/format/MVT.js';
import apply from 'ol-mapbox-style';
import {applyStyle} from 'ol-mapbox-style';
import Draw from 'ol/interaction/Draw.js';
import Snap from 'ol/interaction/Snap.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import KML from 'ol/format/KML.js';
import Heatmap from 'ol/layer/Heatmap.js';
import Overlay from 'ol/Overlay.js';
import Style from 'ol/style/Style.js';
import Stroke from 'ol/style/Stroke.js';
import Select from 'ol/interaction/Select.js';
import Collection from 'ol/Collection.js';
import Modify from 'ol/interaction/Modify.js';
import CircleStyle from 'ol/style/Circle.js';
import { singleClick } from 'ol/events/condition';
import { doubleClick } from 'ol/events/condition';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Fill from 'ol/style/Fill.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import Control from 'ol/control/Control.js';
import Zoom from 'ol/control/Zoom.js';
import { scale } from 'ol/transform';
import Geolocation from 'ol/Geolocation.js';
import {toLonLat, transform} from 'ol/proj';

const map = new Map({
  target: 'map',
  // layers: [
  //   new TileLayer({
  //     source: new OSM()
  //   })
  // ],
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
  controls:defaults({attribution:false,zoom:false})//Biz attribution, zoom u kendimiz disardan kontrol etmek istedik tamamen ondan dolayi da default olarak tanimlanmalarini false edip kendimiz manuel olarak tanimlayarak zoom ve attribution e erisip onlar uzerinden disardan manipulasiyon yapabilmeyi sagladik....
});


const openstreetMapStandart = new TileLayer({
  source: new OSM(),
  visible:true,
  // zIndex:6,
  // opacity:1,
  title:"OSMStandart"//Burda title a ihtiyacimiz var ve bu html kisminda radio button icinde value de ne kullandi isek onun ile ayni olmalidir

});




const openstreetMapHumanitarian=new TileLayer({
  source: new OSM({
    url:"https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  }),
  visible:false,
  title:"OSMHumanitarian"
  // zIndex:5,
})

const cartoDBBaseLayer=new TileLayer({
  source:new XYZ({
    url:"https://{1-4}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{scale}.png",
    attributions:" CARTO",//cartoDB icinde attribution eklmeis olduk
  }),
  visible:false,
  title:"CartoLightAll"
})

//Stamen basemap layer
//ol/source/Stamen~Stamen
//import Stamen from 'ol/source/Stamen.js';
const StamenTerrainWithLabels=new TileLayer({
  source:new Stamen({
    layer:"terrain-labels",
    // layer:"watercolor-labels",
    attributions:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'//STAMEN IN official websitesinden attribution info sunu alabilirz
  }),
  visible:false,
  title:"StamenTerrainWithLabels"
})

   //Bing Maps Basemap layer(Microsoft dan)
      //BingMaps kendisi default olarak attribution ekliyor ama XYZ:CartoDB kendisi attribution eklemiyor default olarak
     const bingMaps= new TileLayer({
        source:new BingMaps({
          key:"AqnbKlODcuyK14BO0hn31VaMfopMhfPUnmJnODwmBEGPZnOuM272NhPXkK1SGNjC",
        imagerySet:"CanvasGray"
         //imagerySet ile biz BingMap de bircok farkli goruntude haritalar elde edebiliyoruz... 
        }),
        visible:false,
        title:"BingMaps"
      });

//Stamen in XYZ kullanilarak , url uzerinden eklenmesi
//http://maps.stamen.com/#watercolor/12/37.7706/-122.3782
const StamenTerrain=new TileLayer({
  source:new XYZ({
    url:"https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    attributions:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible:false,
  title:"StamenTerrain"
})

const openstreetMapVectorTile=new VectorTileLayer({
  //ol/source/VectorTile~VectorTile
  source:new VectorTile({
    url:"https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=ylLw6cixG0195FMliDuz",//Bunu openmaptiles in resmi websitesinden alacagiz
    format:new MVT(),//Bunun icin MVT formati kullanacagiz,VectorTile options dan format a gidersek gorebilirz
   attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
   //map Tiler i n duruma gore belirleyecegiz bunu
  }),
  visible:false,
  title:"VectorTileLayerOpenstreetMap"
})

 const openStreetMapVectorStyles="https://api.maptiler.com/maps/03341399-1469-43e3-810b-e94004a26fd3/style.json?key=ylLw6cixG0195FMliDuz";

fetch(openStreetMapVectorStyles).then(function(response) {
  response.json().then(function(glStyle) {
  //  console.log(glStyle);//glStyle icerisinde source var onu alabiliriz
    //source:v3-openmaptiles(3.parametre source dir)
    applyStyle(openstreetMapVectorTile, glStyle, 'v3-openmaptiles');
  });
});



const baseLayerGroup=new LayerGroup({
  layers:[
    openstreetMapStandart ,
    openstreetMapHumanitarian,
    bingMaps,
    cartoDBBaseLayer,
    StamenTerrainWithLabels,
    StamenTerrain,
    openstreetMapVectorTile
    
    //Microsoft yapimi olan BingMaps i kullaniyoruz, ama icerisinde labellar yok
  ]
})

map.addLayer(baseLayerGroup);


const baseLayerElements=document.querySelectorAll(".sidebar > input[type=radio]")

/*  Biz ne istiyoruz her bir input radio buttona tikladimgz da bir action almak istiyoruz yani ona ait...layer hangisi ise onu almak istiyoruz  onun icin her birisine bir event listener eklememiz gerekiyor, yani biz her ne zaman input radio butona tiklarsak ordaki degisikligi almamiz icin dinlememiz gerekiyor event listener ile  */

  for (let baseLayerElement of baseLayerElements) {
      baseLayerElement.addEventListener("change", function(event){
        // console.log(this);//hangisine tiklanirsa onu alacagiz
        // console.log(event.target);//tikladigmz elementin referansin aliyoruz
        // console.log(this.value)//tiklanan inputun value sini aliyoruz
        // console.log(event.target.value);//Bu sekilde tikladimgz elemntin(inputun) value sine erisebiliyoruz ve bu eristimgz tiklaidgimz elemente ait value yi biz map layer larimizin title i olarak kullanabiliriz.. Yani value si map layer lardan title  a esit olan i biz visible true yapariz digerlerini false yapariz
        let baseLayerElementValue=this.value;
        let getAllUsedLayers=baseLayerGroup.getLayers();
       
        getAllUsedLayers.forEach(function(element,index,array){
        
            // console.log(element)
            // console.log(element.get("title"));//Bu sekilde title key ine karsilik gelen value yi bulabiliriz..
       
            element.setVisible(baseLayerElementValue===element.get("title"));
        })   
      })
  }





  



  //Layer switcher logic for laster tile layers
  const tileRasterLayerElements=document.querySelectorAll(".sidebar > input[type=checkbox]")
  
  // console.log("layerElements: ",tileRasterLayerElements)
  
  for (let layerElement of tileRasterLayerElements) {
        layerElement.addEventListener("change",function(event){
          // console.log(this.value);
          // console.log("checked: ",this.checked);
          // console.log(event.currentTarget.value);
          let layerElementValue=event.currentTarget.value;
          let tileRasterLayer;
          layerGroup.getLayers().forEach(function(element,index,array){
           /// console.log("element: ",element.get("title"))
            //Eger bizim tikladigmiz elementin value si, layer lardan title e esit olan var ise, o layer in visible ini tersine cevir yani true ise false false ise true yap diyoruz, yani toggle...
            //SOLUTION-1
            // if(layerElementValue===element.get("title")){
              
            //   element.set("visible",!element.get("visible"));
            // }
            
            if(layerElementValue===element.get("title")){
              tileRasterLayer=element;
            }
          })
          //  tileRasterLayer.setVisible(!this.checked); 
          this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false) 
        })
  }




    //VectorTileLayer label i ile VectorTile birbirinin aynsidir sadece developerlara gore aralarinda hiz-performans farki vardir
  //Bestpractise...Buraya cok dikkat burda eger biz kendimiz disardan bir geojson dosyasindan datalari cekerek koordinatalari verilmis olan point,polygon, line bunlarin uzerinden oynama vs yapmak istersek o zaman, layer olarak VectorLayer kullanacagiz dikkat edelim, VectorTileLayer kullaninca hata aliyoruz dolaysi ile layer olarak VectorLayer sourcesidde zaten dokumantasyonda var VectorSource olarak geciyor
const CentralEUCountriesGEOJSON=new VectorLayer({
  source:new VectorSource({
      url:"./data/vector_data/europen_cities.geojson",
      format:new GeoJSON(),
  }),
    style: {
    'fill-color': 'rgba(255, 255, 255, 0.1)',
    'stroke-color': '#e4002b',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#00334e',
  },
  visible:false,
  title:"CentralEUCountriesGEOJSON"
})

// map.addLayer(vectorLayer);
/*
BaseObject-Observable
Layer for vector tile data that is rendered client-side. Note that any property set in the options is set as a BaseObject property on the layer object; for example, setting title: 'My Title' in the options means that title is observable, and has get/set accessors.
Kendi property lerimzi ekleyebiliriz set ile mevcut properties leri set edebiliriz
Ve tekrar get ile alabiliriz...Observable-data binding-two ways
*/

  const layerGroup=new LayerGroup({
    layers:[
      CentralEUCountriesGEOJSON
      // AustrianCities
    ]
  })
  
  // map.addLayer(NOAAWMSLayer);
  map.addLayer(layerGroup);


  //Tabi bizim, daha onceden kullanmak icin hazirladigmiz bir vektor layerimiz var uzerinde point, line ve polygonlar bulunan o vektor layer i source olarak kullaniyoruz ve onun uzerinde yapiyoruz bu islemlerimizi
  //Select interaction-styling

// let selectInteraction=new Select({
//   condition:singleClick,
//   layers:function(layer){
//       return layer.get("title")==="CentralEUCountriesGEOJSON"
//       //Sadece layer lardan title i CentralEUCountriesGEOJSON olan lar icin gecerli olsun demis oluyoruz....
//   },
//   style:new Style({
//     image:new CircleStyle({//Style class i icinde image option i pointler icin kullaniliyor-image-circkle-regularshape-
//       fill:new Fill({
//         color:[247,26,10,1]
//       }),
//       radius:12,
//       stroke:new Stroke({
//         color:[247,26,10,1],
//         width:3,

//       })
//     })
//   })
// })

// map.addInteraction(selectInteraction);

//PEKI BU SELECT INTERACTION I SPESIFIK LAYER ICIN KULLANMAK ISTERSEK NASIL YAPARIZ
//select optionlari arasinda buluanan layer option u ile biz, select interaction inin istedigmiz layer da kullanabilirz, spesifik layer larda kullanma islemini gerceklestirebiliriz..Yani biz spesifik bir style olusturduk select interaction i ile ve bunu sadece tek layer imniz icin gerceli olsun istiyoruz bunu yapabiliriz






//OPENLAYERS DA INTERACTION LARI BASKA YONTEMLERLE DE MAP IMIZE EKLEYEBILIYORUZ....HEMEN TEST EDELIM

let style=new Style({
  image:new CircleStyle({//Style class i icinde image option i pointler icin kullaniliyor-image-circkle-regularshape-
    fill:new Fill({
      color:[247,26,10,1]
    }),
    radius:12,
    stroke:new Stroke({
      color:[247,26,10,1],
      width:3,

    })
  })
})


const selectInteractionV2=new Select();
map.addInteraction(selectInteractionV2);
//Bu sekilde default olarak select interaction i uygulanacaktir...vektorlayerimizda pointlerimizin veya, line ve polygonlarimizin uzerine tiklayinca default olarak onlari mavi renk yapacaktir ta ki bir diger line,polygon veya pointe tiklayana kadar....
//Yani kavramlari dogru oturtalim,bizim selct interaction i ile her bir tiklamamiz, tiklaidigmiz geometry nin feature une erismemiz anlamina geliyor...bunu iyi bilelim.....Biz neye tiklarsak o feature un style i degisitiyor sadece
//ol/interaction/Select~Select dokumantasyona gittgmiz zaman
//Fires baslgi altinda bizim select ile ilgili hangi eventleri kullanabilecegimizi gorebiliriz
//O eventler icinde select eventi bulunuyyor, biz o eventlerden istedigmzi kullanabiliriz
//CALISMA MANTIGI OLARAK DAHA FARKLI DUSUNEREK CALISALIM....EZBERE DEGIL.....
//Bu arada sunu da bilelim...tum class larin bu tur eventleri vardir....ki bizim ozellikle bazi evenlteri ve optionlari ekstra kontrol etmemiz bizim isimizi cok kolaylastiracaktir...biz her zaman icin, map class ini yapacagmiz islemde nasil kullaniriz, source yi nasil kullaniriz veya bir interaction ile islem yaparken o interaction in bir eventini tetikleyip onun icindeki callback icinde diger bir interaction i kullanarak cok effektif neticeler elde edebiliriz....

//select (SelectEvent) - Triggered when feature(s) has been (de)selected.
//Biz her select islemi yaptimgiz da icerdeki callback fonksiyonu tetiklenecek
selectInteractionV2.on("select",function(event){
     // console.log(event)
      // console.log(event.selected)//secilen feature, array icinde gelecektir, arrayin 0.indexini alirsak secilen feature umuz u elde edebiliriz...
      // console.log(event.selected[0]?.getGeometry())
      // console.log(event.selected[0]?.getGeometry().getCoordinates())
      // console.log(event.selected[0]?.getGeometry().getType())
    //Burda biz, herhangi bir feauture-geometry-(point,line,plygon) a tiklarsak sorun yok ama bos bir alana tiklarsak o zaman getGeometry diye birsey bulamaz cunku array[0] icinde feature u bos bir obje gelecegi icin icin
    //O zaman bizim burda secimizmizin undefined veya bos olmadignindna emin olmamiz gerekiyor undefined almamak icin
    //BESTPRACTISE...
    //Peki onu nasil kontrol ederiz tabi ki event.selected bir dizidir ve bu dizi eger bos degil ise demekki feature secmistir yok bu dizi bos gelirse o zaman icinde herhangi bir feature secememistir demektir
    //Asagidaki gibi yaparak kendimizi garanti altina aliriz ve hata gelme durumunu kontrol etmis oluruz
    //Hatta biz sunu diyebiliriz selected interaction i sadece, pointlerde calissin diyebiliriz ve asagidaki logic ile bunu da yapabiliriz...
    let selectedFeature=event.selected;
    if(event.selected.length>0 && selectedFeature[0].getGeometry().getType()==="Point"){
     //Simdi artik biz ne zaman pointe tiklarsak o zaman, bu event.selected[0] ile o pointin feature une erisebilecegiz ve biz burda o pointin feature u uzerinden ona style atamasi yapabiliyoruz...HARIKA BESTPRACTISE....
      event.selected[0].setStyle(style);
    }
    //Bu sekilde biz point,line,polygonu her birisini farkli style verebiliriz
    //Ornegin event.selected.length>0 dedikten sonra yeni bir if ile point ise bu style, if line ise farkli bir style if polygon ise de farkli bir style da diyebiliriz

})


//Map controls
//ScaleLInectonrol sol altta ne kadar buyuyup kuculdugunu  bir line da gosteriyor

const scaleLineControl=new ScaleLine({
   units:"metric",
   minWidth:100,
   bar:true,
   steps:6,
   text:true,

})
scaleLineControl.set("title","ScaleLine")

map.addControl(scaleLineControl);

let scaleLineControll="";
if(scaleLineControl instanceof Control){

}

//Bu da kucuk bir map getirecektir karsimiza
const overViewMapControl=new OverviewMap({
collapsed:false,//default true gelir
tipLabel:"Custom Overview map",//uzerine hover yapinca gosterir
layers:[//overViewMapControl kucuk bir map tir sol altta, bulunur...
  new TileLayer({
    source:new OSM()
  })
],

})
overViewMapControl.set("title","OverviewMap")
map.addControl(overViewMapControl);
//Controllerin optionslari arasinda class ismi veriliyor ki o class isimlerini kullanarak style icinde css vererek
//style i degistirebiliyourz
//className	string (defaults to 'ol-overviewmap')	CSS class name.
//.ol-overviewmap {  bottom: 60px; }
 
const attributionControl=new Attribution({
  collapsible:true
})
attributionControl.set("title","Attribution")
map.addControl(attributionControl);


//BURDA COK ONEMLI BIR NOKTA VAR.....
//DEFAULT OLARAK EKLENMIS OLAN ZOOM CONTROLL GIBI CONTROLLERE DE ERISEBILMEMIZ ICIN BIZIM ONLARI MANUEL OLARAK EKLEMEMIZ GEREKIR...BU COK ONEMLDIRI
const zoomControll=new Zoom({

})
zoomControll.set("title","Zoom")
map.addControl(zoomControll);

//Bu sekilde yapip toplu bir sekilde map imize de ekleyebiliriz, map icinde, 
//controls:defaults().extend(mapControls) seklinde de ekleyebiliriz...toplu bir sekilde....
let mapControls=[attributionControl,scaleLineControl,overViewMapControl,zoomControll];


//Switch on/off controls logic
//Once buttonlara erisecegiz
//Bunlar javascript kullanim acisindan harika bestpractise lerdir...
//1.si querySelectorAll uzerinden css gibi, detayli html elementlerini gruplayarak kulllanabliyoruz....harika...
//Ayrica da tum attribute leri kullanarak, o html elementler arassinda cok daha effektif secici islemler yapaibliyoruz...
//Kimi zaman ortak class lar vererek, kimi zaamn da name attirbute lerini openlayer icinde kullanacagimz interaktiflikler veya layer lara eslestirerek html deki buttonlar la openlayers islemlerimiz arasinda harika bir bag kurarark dinamiklikleirmizi yontebiliyoruz
const controlButtonElements=document.querySelectorAll(".sidebar > button[type=button]")
console.log(controlButtonElements);//buttonlarimizin listesini bu sekilde aliriz...


controlButtonElements.forEach(element => {
          element.addEventListener("click",function(event){
            let buttonElement=event.target;
          
            if(buttonElement.className==="btn-success"){
           //options olarak element tanimlar isek o zaman control.element deyince bir sonuc alabiliriz....o  zaman hangi elemente tiklanirsa onu aliriz
              map.getControls().forEach(function(controlElemnt){
                
                  if(controlElemnt?.get("title")===buttonElement.dataset.title){
                   
                    console.log(controlElemnt)
                    console.log(buttonElement)
                    map.removeControl(controlElemnt)
                    
                  }
              })
              // buttonElement.classList.toggle("btn-success");
              buttonElement.className=buttonElement.className.replace('btn-success','btn-default');
            }else{
              //Burda tiklayip da btn-defaults class ini verdimgz butonlarimz, a karsilik gelen controller kaldirilmis oluyor ....burdan check edebiliriz.....
              console.log("controls: ",map.getControls())
              mapControls.forEach((controlElement)=>{
                
                if(controlElement.get("title")===buttonElement.dataset.title){
                  map.addControl(controlElement)
                  console.log("controlElementttt: ",controlElement);
                }
              })
              buttonElement.className=buttonElement.className.replace('btn-default','btn-success');
            }
          })
});

//BURDA MANTIK YURUTELIM...
//Simdi, oncelikle biz var olan tum controlleri map.getControllers() ile control collection i olarak alabiliriz 
//Collection<Control> bu demektir ki iterable yani biz bunu bir dongu vasitasi ile dondurup her birisine ayri ayri erisebiliriz
//Ayni zamanda bunlardan istediklerimizi de remove-edebilirz demektir bu...
//tum controlleri dongu icinde dondurerek alabildiyoruz...
/*
Zoom {disposed: false, eventTarget_: undefined, pendingRemovals_: null, dispatching_: null, listeners_: null, …}
main.js:398 Rotate {disposed: false, eventTarget_: undefined, pendingRemovals_: null, dispatching_: null, listeners_: null, …}
main.js:398 Attribution {disposed: false, eventTarget_: undefined, pendingRemovals_: null, dispatching_: null, listeners_: null, …}
main.js:398 ScaleLine {disposed: false, eventTarget_: undefined, pendingRemovals_: {…}, dispatching_: {…}, listeners_: {…}, …}
main.js:398 OverviewMap {disposed: false, eventTarget_: undefined, pendingRemovals_: null, dispatching_: null, listeners_: null, …}

Oncelikle sunu bilelim...biz map imiz altinda olusturaibleimdiz, controllers,interactions, overlays gibi islemleri remove edebiliriz ve tekrar ekleyebiliriz....ki zaten bu ozelliklerin aktif pasif yaparken de bu sekilde remove edip tekrar add yaparak yapacagiz o sekilde islemleri..


*/

//GeoLocation Api-ol/Geolocation~Geolocation
const viewProjection=map.getView().getProjection();
const geolocation=new Geolocation({
  tracking:true,//Start Tracking right after instantiation.
  trackingOptions:{
    enableHighAccuracy:true,

  },
 // projection:"EPSG:3857"//default olarak biz bunu kullaniyoruz...ama biz manuel olarak bu sekilde yazmak yerine direk mapimiz uzerinden de alabiliriz,bu sekilde daha dinamik olur, meselea map imzin projection i degistirse bizim hicbirsey yapmamiza gerek kalmaz direk mapmizin projectionini map.getView().getProjection() uzerinden alirsak eger
 projection:viewProjection,

})

const geoLocElement=document.getElementById("geolocation");
//ol/Geolocation~Geolocation-Fires-change:position, Methods-getPosition
geolocation.on("change:position",function(event){
  console.log("event: ",event.target);//event.target=geolocation
  console.log("event: ",event.target.getPosition());//[1208517.787899016, 8382459.12051414] - EPSG 3758 E GOREDIR
  console.log("event: ", this.getPosition());//[1208517.787899016, 8382459.12051414] - EPSG 3758 E GOREDIR
  //event.target her zaman kendisini tetikleyen degiskeni verecektir bu mantigi hicbirzaman unutmayalim.....BESTPRACTSIE...
  //Yine burda da this bize bu eventi tetikleyen obje degiskeni verecektir bu mantigi hicbirzaman unutmayalim.....BESTPRACTSIE...
  //event.target her zaman bu event i tetikleyen, degiskenimiz yani geolocation i verecektir dolayisi ile biz geolocation.getPosition() nasil ki diyebiliyorusak methodlari uzerinden ayni sekilde event.target.getPosition() da diyebiliyoruz
  let geo_location=this.getPosition();
  //let getCoordAsLonLat=transform(geo_location, viewProjection, "EPSG:4326");
  let getCoordAsLonLat=toLonLat(geo_location, viewProjection);
  //koordinaterimizi logtitude ve latittude cevirelim...
  console.log("getCoordinateAsLonLat: ",getCoordAsLonLat);
  //SIMDI BURAYI IYI ANLAYALIM...BIZ VIEW UZERINDE MANIPULASYON YAPACAGIZ O ZAMAN ONCE VIEW I DINAMIK BIR SEKILDE ALALIM...VIEW I NASIL ALIRIZ VIEW HANGI OBJE NIN OPTIONU IDI MAP O ZAMAN DEMEKKI BIZ MAP.GETVIEW() ILE ALABILIRZ...VIEW REFERANSINI
  let currentView=map.getView();
  //Simdi de observable-baseobject ozelligini kullanarak, biz manipulasyon ve openlayars in ozelliklerine mudahele edebiliyoruz...BU YONTEM HER ZAMAN KULLANACAGIMZ YONTEMDIR BUNU DA COK IYI BILEIM...
  //ol/View~View- methods altinda setView i gorebilirz, ve parametreye de coordinate turunden yani map imizn projection turunden olan koordinat degerleri verilmelidir, lon, lat olarak degil
  currentView.setCenter(geo_location);
  //Bu seklde mapimizi acarsak bizim su an ki pozisyonumuzu center olarak alacaktir yani norveci
  //Bulundugjmuz konumun koordinatlarini lon,lat olarak sidebar da gostererelim...
  // geoLocElement.innerHTML=`getCoordAsLonLat: ${getCoordAsLonLat}`;
  geoLocElement.innerHTML=`Longitute: ${getCoordAsLonLat[0].toFixed(2)} <br> Latitute: ${getCoordAsLonLat[1].toFixed(2)}`;

  //Eger geolocation dan accuracy yi gormek istersek o zaman da 
  console.log("getAccuracy: ",event.target.getAccuracy())
  console.log("getAltitude: ",this.getAccuracy())
})





  /*  -- DRAW AND MODIFY --  */

//   var feautures=new Collection();
//   const source = new VectorSource({features:feautures}  );
//   const vector = new VectorLayer({
//   source: source,
//   style: {
//     'fill-color': '#ff0b00',
//     'stroke-color': '#ffcc33',
//     'stroke-width': 2,
//     'circle-radius': 7,
//     'circle-fill-color': '#ffcc33',
//   },
// });

// map.addLayer(vector);
// //vector.setMap(map); addLayer ile ayni isi yapiyor


// const modify = new Modify({source: source});
// map.addInteraction(modify);

// let draw, snap; // global so we can remove them later
// const typeSelect = document.getElementById('type');

// function addInteractions() {
//   draw = new Draw({
//     source: source,
//     type: typeSelect.value,
//   });
//   map.addInteraction(draw);
//   snap = new Snap({source: source});
//   map.addInteraction(snap);
// }

// /**
//  * Handle change event.
//  */
// typeSelect.onchange = function () {
//   map.removeInteraction(draw);
//   map.removeInteraction(snap);
//   addInteractions();
// };

// addInteractions();
