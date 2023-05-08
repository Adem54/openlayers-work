import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';
import {fromLonLat} from 'ol/proj';
import LayerGroup from 'ol/layer/Group.js';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorSource from 'ol/source/Vector.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';

//https://kartkatalog.geonorge.no/metadata/terreng-norgeskart-wms/b85de734-b9b4-4719-ad80-fe55ee7415d2
const parser = new WMTSCapabilities();
let  terrengNorweiganMapWMTS ;

fetch('data/WMTSCapabilities.xml')
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
  //  console.log("text: ", text);
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: 'norgeskart_bakgrunn',
      matrixSet: 'EPSG:3857',
    });
    console.log("options: ", options);
    

  terrengNorweiganMapWMTS = new TileLayer({
    opacity: 1,
      source: new WMTS(options),
  visible:false,
  title:"terrengNorweiganMapWMTS"
})
/*
https://kartkatalog.geonorge.no/metadata/terreng-norgeskart-wms/b85de734-b9b4-4719-ad80-fe55ee7415d2
WMTS de ise bize verilen siteye girdgimz zaman orda bize WMTS source  icin bir url verilecek ona tikladgimz zaman o bize 1 tane WMTSCapabilities.xml dosyasi download eder o dosyayi aliriz ve o dosyayi openlayers projmeiz icerisinde data isminde klasor altina yerlestiririz ve o dosyaya fetch ile request gondeririz ve ordan gelen responsu alarak options larimizi elde ederiz ve bu options lari alip WMTS source icerisinde kullanriz....
*/



    let view =new View({
  //   projection:projection,
  //   center: [0, 0],
  //   center:fromLonLat([10.7522, 59.9139]),
    // center:[1333904.5835944712, 9508192.61121011],
     center:[3532759.4210155094, 9620905.651636465],
     zoom: 5
   });
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
      visible:true,
      title:"OSM"
    })
  ],
  view,
});


// const openstreetMapStandart = new TileLayer({
//   source: new OSM(),
//   visible:true,
//   title:"OSM"
// });
let planAreaWMSSource = new TileWMS({
//  let planAreaWMSSource = new VectorSource({
  //VectorSource
  url:"https://openwms.statkart.no/skwms1/wms.planomraade?",
  crossOrigin: 'anonymous',
  
    params: {
        LAYERS: 'PLANOMRADE_WMS',    
        FORMAT:'image/png',
        VERSION: '1.1.0',
      },
        //  projection: 'EPSG:3857',
      projection: 'EPSG:25833',
  //    projection: 'EPSG:3857'
//Layers ile Version i ve de url i kullanmazsak planAreaWMS source ye erisemiyoruz...COOK ONEMLI...
// Countries have transparency, so do not fade tiles:
//  transition: 0,
});
//https://kartkatalog.geonorge.no/metadata/planomraade-wms/d70cedfc-fdb2-45cc-a9c6-0b7f09a1e746
const planAreaWMS = new TileLayer({
//  const planAreaWMS = new VectorTileLayer({
  //VectorTileLayer
  source:planAreaWMSSource,
  visible:false,
  title:"planAreaWMS"
})


//Biz GetFeatureInfo ile ilgili hangi formatlar gecerli vs gibi tum bilgileri, bu wms in getCapatbilities url ini browser da actigmiz zaman yani xml dosyasini actigmz zaman orda <GetFeatureInfo etiketi icerisinde gorebiliriz...
map.on('singleclick', function (evt) {
 // document.getElementById('info').innerHTML = '';
  const viewResolution = /** @type {number} */ (view.getResolution());
  const url = planAreaWMSSource.getFeatureInfoUrl(
    evt.coordinate,
    
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/html',
  //  'INFO_FORMAT':'application/json'
  }
  );
  if (url) {
    console.log("url: ",url)
    fetch(url)
      .then((response) => {
        console.log("response: ",response);
        return response.text();
      })
      .then((html) => {
        console.log("html: ", html);
     //   document.getElementById('info').innerHTML = html;
      });
  }
});




//console.log("getProperties: ",planAreaWMS.getProperties())

//console.log("getProjection: ",planAreaWMSSource.getProjection())

//Wms service nin tamamen yuklendiginde veya her tetikilendiginde-(zoom-in/zoom-out ile tetiklenir- yani request gonderir)
//Ilk basta yuklenme zaten muhtemelen parca parca oluyor bu tile-caching olayi ile geliyorlar buyuk ihtimalle ondan dolayi da burdaki loading methodu defalarca tetikleniyor.. ilk basta bu tile-wms in tamaminin yuklenmesi durumunda
planAreaWMSSource.on("tileloadend", function(event){
  console.log("TILELOADEND", event.tile.getImage())//ImageTile
  console.log("getTileCoord: ", event.tile.getTileCoord())//ImageTile
})

 //map.addLayer(planAreaWMS);

/*
bize verilen url adresine tiklayinca o bizi bize bu wms e ait openlayers icinde kullanacagimiz bilgileri veren, xml sayfasini acar ve o xml sayfasinin ozellikle ilk satirindaki genel bilgi kismini iyi  okuyalim.. 
Burda ozellikle 
http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/sld_capabilities.xsd http://mapserver.gis.umn.edu/mapserver https://openwms.statkart.no:80/cgi-bin/sentinel2?
bu kisim cok onemlidir... buradan da  wms e ait version... sld http://schemas.opengis.net/sld/1.1.0/
ve LAYERS ISMI https://openwms.statkart.no:80/cgi-bin/sentinel2?service=WMS

Resources keywordu uzerinden de aryaabiliriz bazi xml kaynaklarda resources keywordu  uzerinden aradigmiz bilgileri bulabiliyoruz

<WMS_Capabilities xmlns="http://www.opengis.net/wms" xmlns:sld="http://www.opengis.net/sld" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ms="http://mapserver.gis.umn.edu/mapserver" version="1.3.0" xsi:schemaLocation="http://www.opengis.net/wms http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/sld_capabilities.xsd http://mapserver.gis.umn.edu/mapserver https://openwms.statkart.no:80/cgi-bin/sentinel2?service=WMS&version=1.3.0&request=GetSchemaExtension">

AYRICA LAYERS ISMI ICIN <Name>sentinel2</Name> icerisine bakariz

format icin 
<Format></Format> etiketlerine bakariz
<Format>image/png</Format>
<Format>image/png; mode=8bit</Format>
<Format>image/png8</Format>
<Format>image/jpeg</Format>

ayrica url icin de 
asagidaki etiklere bakilmalidir

<HTTP>
<Get>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://openwms.statkart.no/skwms1/wms.sentinel2?"/>
</Get>
<Post>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://openwms.statkart.no/skwms1/wms.sentinel2?"/>
</Post>
</HTTP>

 -->
*/

//https://kartkatalog.geonorge.no/metadata/satellittdata-sentinel-2-skyfri-mosaikk-wms/38a52b73-2ffb-47cc-9ecd-147ee18f62be
const skyfriMosaikkWMS = new TileLayer({
  source:new TileWMS({
    url:"https://openwms.statkart.no/skwms1/wms.sentinel2?",
		crossOrigin: 'anonymous',		
    params: {
					LAYERS: 'sentinel2',//<Name>sentinel2</Name>
       
          FORMAT:'image/png',
					VERSION: '1.1.0'
				}
  }),
  visible:false,
  title:"skyfriMosaikkWMS"
})

//map.addLayer(skyfriMosaikkWMS);

//https://kartkatalog.geonorge.no/metadata/traktorveg-og-skogsbilveg-wms/e45aea66-5d98-4703-8026-692c782eb5b0
const tractorRoadAndForestVehicleRoadWMS = new TileLayer({
  source:new TileWMS({
    url:"https://openwms.statkart.no/skwms1/wms.traktorveg_skogsbilveger?",
		crossOrigin: 'anonymous',
    params: {
					LAYERS: 'traktorveg_skogsbilveger_wfs',
          
          FORMAT:'image/png',
					VERSION: '1.1.0'
				}
  }),
  visible:false,
  title:"tractorRoadAndForestVehicleRoadWMS"
})

//map.addLayer(tractorRoadAndForestVehicleRoadWMS);

const norweiganMap = new TileLayer({
  source:new TileWMS({
    url:"https://opencache.statkart.no/gatekeeper/gk/gk.open?",
    crossOrigin: 'anonymous',
    params: {
      LAYERS: 'norges_grunnkart',
      VERSION: '1.1.1'
    }
}),
visible:false,
title:"norweiganMap"
})


//map.addLayer(norweiganMap);



//MATRIKKELKART WMS

//http://openwms.statkart.no/skwms1/wms.matrikkelkart?service=wms&version=1.3.0&request=getcapabilities
//xml dosyasi icerisinde
//<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://openwms.statkart.no/skwms1/wms.matrikkelkart?"/>
//<Layer queryable="1"> <Name>matrikkelkart</Name>


const matrikkelkartWMS = new TileLayer({
  source:new TileWMS({
    url:"http://openwms.statkart.no/skwms1/wms.matrikkelkart?",
    crossOrigin: 'anonymous',
  
    	params: {
					LAYERS: 'matrikkelkart',    
          FORMAT:'image/png',
					VERSION: '1.1.0',
				}
//Layers ile Version i ve de url i kullanmazsak planAreaWMS source ye erisemiyoruz...COOK ONEMLI...
// Countries have transparency, so do not fade tiles:
//  transition: 0,
  }),
  visible:false,
  title:"matrikkelkartWMS"
})

let kommuneplanerSourceWMS = new TileWMS({
  url:"https://wms.geonorge.no/skwms1/wms.kommuneplaner?",
  crossOrigin: 'anonymous',

    params: {
        LAYERS: 'KOMMUNEPLANER_WMS',    
        FORMAT:'image/png',
        VERSION: '1.1.0',
      },
   
      
  //    projection: 'EPSG:25833',
  //    projection: 'EPSG:3857',
    
});
//kommuneplanerWMS
//https://wms.geonorge.no/skwms1/wms.kommuneplaner?request=GetCapabilities&service=WMS
const kommuneplanerWMS = new TileLayer({
  source:kommuneplanerSourceWMS,
  visible:false,
  title:"kommuneplanerWMS"
})



//geo-demo:kommune_flate11
//kommuneflateWMS
const kommuneflateWMS = new TileLayer({
  source:new TileWMS({
    url:"http://localhost:9090/geoserver/geo-demo/wms?",
  //  crossOrigin: 'anonymous',
  
    params:{"LAYERS":"geo-demo:kommune_flate11","TILED":true},

    serverType:"geoserver",
    visible:true,

  }),
  visible:false,
  title:"kommuneflateWMS"
})



const kommunegrenseLayergroupWMS = new TileLayer({
  source:new TileWMS({
    url:"http://localhost:9090/geoserver/geo-demo/wms?",
  //  crossOrigin: 'anonymous',
  
    params:{"LAYERS":"geo-demo:kommunal_layergroup","TILED":true},

    serverType:"geoserver",
    visible:true,

  }),
  visible:false,
  title:"kommunegrenseLayergroupWMS"
})

const baseLayerGroup=new LayerGroup({
  layers:[
//    openstreetMapStandart ,
    planAreaWMS,
    skyfriMosaikkWMS,
    terrengNorweiganMapWMTS,
    tractorRoadAndForestVehicleRoadWMS,
    norweiganMap,
    matrikkelkartWMS,
    kommuneplanerWMS,
    kommuneflateWMS,
    kommunegrenseLayergroupWMS

  ]
})

map.addLayer(baseLayerGroup);



const baseLayerElements=document.querySelectorAll(".sidebar > input[type=radio]")


for (let baseLayerElement of baseLayerElements) {
  baseLayerElement.addEventListener("change", function(event){
    //console.log(this);//hangisine tiklanirsa onu alacagiz
    //console.log(event.target);//tikladigmz elementin referansin aliyoruz
    //console.log(this.value)//tiklanan inputun value sini aliyoruz
    //console.log(event.target.value);//Bu sekilde tikladimgz elemntin
    let baseLayerElementValue=this.value;
    let getAllUsedLayers=baseLayerGroup.getLayers();
   
    getAllUsedLayers.forEach(function(element,index,array){
      //element ile her bir layer a erismis oluyoruz bu sekilde...
    //    console.log(element);
        
       // console.log(element.get("title"));//Bu sekilde title key ine 

        element.setVisible(baseLayerElementValue===element.get("title"));
    })   
  })
}


map.on("click", function(event){
  console.log("event-coord: ", event.coordinate)
})

  })


