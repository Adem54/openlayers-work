import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
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
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTile from 'ol/source/VectorTile.js';
import MVT from 'ol/format/MVT.js';
import apply from 'ol-mapbox-style';
import {applyStyle} from 'ol-mapbox-style';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import KML from 'ol/format/KML.js';
import Heatmap from 'ol/layer/Heatmap.js';
import Overlay from 'ol/Overlay.js';
import Style from 'ol/style/Style.js';
import Stroke from 'ol/style/Stroke.js';
import Select from 'ol/interaction/Select.js';
import {singleClick} from "ol/events/condition";
import Circle from 'ol/geom/Circle.js';
import Fill from 'ol/style/Fill.js';
import ImageStyle from 'ol/style/Image.js';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {fromLonLat} from 'ol/proj';
//ol/control/Attribution~Attribution i collapsable yapmak
const attributionControl=new Attribution({
  collapsible:true
})

//Simdi biz kullanimimizi biraz daha temiz hale getirmek icin tum Layer larimizi Layergroup icerisinde kullanacagiz...
//2 tane Layergroup olusturacagiz 1 tanesi BaseMap Layerlarimz icin bir digeri de diger Raster Tile Layerslarimiz icindir

//ol.proj/proj4 bu model yeni epsg kodu ve yeni projeksiyonlari register etmemizi sagliyor
//Burda biz yeni bir projeksion define ettik
//Ayrica da map icinde view iciinde proojeksiyonda da 
//proj4.defs("+proj=tmerc +lat_0=58 +lon_0=10.7229166666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +rf=299.1528128 +units=m +no_defs +type=crs");
proj4.defs("EPSG:9672","+vunits=m +no_defs +type=crs");
//simdide register edelim
//proj4.defs("EPSG:9672","+vunits=m +no_defs +type=crs");
register(proj4);
//EPSG:9672 GIBI BIR KOD ILE GELMESINI BREKLIYORUZ ASLINDA PROJ4.DEFS ICINDEKI DATANIN VE BU TANIMLLAMAYI MAP ICINDE VIEW ICINDE DE PROJEKSIYONDA YAZMAK GEREKLI
//bu sekilde sadece Norwece gore projeksyonlanmis bir projeksiyon goruntu alinmasini beklenir


//59.17848197148105, 9.623351845722578

const map = new Map({
  // layers: [layer],
  target: 'map',
  view: new View({
    //center: [59.17848197148105, 9.623351845722578],
    center:fromLonLat([9.623351845722578,59.17848197148105],"EPSG:9672"), 
    //Burda dikkat etmeiz gerekiyor cunku fromLonLat da 1.sayi longtitude, 2.rakam latitude
    //Ornegin Guney America da Mexica(buraya bakiyorz cunku ancak bu alanda longtitude ile latitude nin hangisini oldugunu ayirt edebiliyoruz) da bir yerin koordinatlarina bakacak olursak, google maps da 19.82161610492304, -99.48749010576978 boyle bir sayi verecektir ki latitude hicbir zaman, -90 dan buyuk ya da kucuk olamazz ondan dolayi google maps te, ki koordinat sisteminde 1.sayi latitude iken 2.sayi longtitude dir yani normal sartlarda, fromLonLat da ise 1.sayi ya bizim longtitude , 2.sayiya latitude degerini girmemiz gerekiyor ondan dolayi burasi cok onemli ve cok dikkat li olmamiz gerekiyor
    //Bizim googlemaps ten aldimgz 59.17848197148105, 9.623351845722578 koordinatlar bu sekilde ama fromLonLat([9.623351845722578,59.17848197148105]) icerisidne yerlerini degistirerek kullaniriz
    //fromLonLat in 2.parametresi de bizim longtitude ve latitude degerlerini aldimgiz projection i kendi kullandimgz projection a cevirmek, yani biz ya gidip ol.View altinda default projection imiza bakariz ya da eger projectionimiz i spesifiklestirmis ve yeni bir projection kullanmis isek de o zaman da gelip o projection new Map icinde ne ise onu kullaniriz fromLonLat in 2. parametresinde
    zoom: 3,
     projection:"EPSG:9672"
  }),
  controls:defaults({
    attribution:false//Bu mevcut bulunan veya default oalrak bulunan attribution in set edilmesine zorluyor, default attribution i kaldiriiyor
  }).extend([
    attributionControl
  ])
});

map.on("click",function(e){
  console.log(e.coordinate);
  //Default olan EPSG:3857 de ise map e ayni alana tiklayinca asagidaki koordinatlari aliyoruz
  // [822552.0608421098, 1093654.4696832309]

  // projection:"EPSG:4326" bu projeksiyonu kullandigmzda ayni noktaya tikladigmizda asagidaki koordinatlari aliyoruz
  //(2) [7.03125, 9.386717677116394]
})

  //BASE LAYERS-Layer Group
  // OpenStreetMap-Basemaplayer(Standart,Humanitarian)
  // BingMaps
  // xyz-CartoDB
  // Stamen-terrainlabel,stamen terrain
  //Humanitarian openstreet map i layerGroup icinde tanimladik burda
  
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
//Buraya da attributions ekliyoruz Stamen in official websitesinden  terrain typindeki source icin olani bulaibliriz


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
    console.log(glStyle);//glStyle icerisinde source var onu alabiliriz
    //source:v3-openmaptiles(3.parametre source dir)
    applyStyle(openstreetMapVectorTile, glStyle, 'v3-openmaptiles');
  });
});
//source:v3-openmaptiles
//Ve artik bu sekilde uygulammaiz ile birlikte biz vector style i sadece openstreetMapVectorTile icin uyguladik

//Base Layer Group
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
        console.log(this);//hangisine tiklanirsa onu alacagiz
        console.log(event.target);//tikladigmz elementin referansin aliyoruz
        console.log(this.value)//tiklanan inputun value sini aliyoruz
        console.log(event.target.value);//Bu sekilde tikladimgz elemntin(inputun) value sine erisebiliyoruz ve bu eristimgz tiklaidgimz elemente ait value yi biz map layer larimizin title i olarak kullanabiliriz.. Yani value si map layer lardan title  a esit olan i biz visible true yapariz digerlerini false yapariz
        let baseLayerElementValue=this.value;
        let getAllUsedLayers=baseLayerGroup.getLayers();
        //BESTPRACTISE...KENDIMIZ CONSOLE DA GORDGUMUZ OBJE KEYS LERI UZERINDEN YURUMEK DEGIL DE DIREK OPENLAYERS DOKUMANTINDA VAR OLAN METHOD OPTIONS VE EVENTLISTENER LAR UZERINDEN GITMELIYIZ
        //Simdi biz burda openlayers layer larinn icindeki keys lerin value sini dinamik bir sekilde degistirirken dikkat edelim, openlayers icindeki methodlardan faydalanarak yapmaliyz bunu bu cook onemlidir
        getAllUsedLayers.forEach(function(element,index,array){
          //element ile her bir layer a erismis oluyoruz bu sekilde...
            console.log(element);
            //ol/layer/Tile~TileLayer bu kaynaga gidersek dokumantasyonda biz, her bir layer icindeki key e karsilik geleen value yi get(key){*} inherited ile alabilecegimzi gorebiliriz
            console.log(element.get("title"));//Bu sekilde title key ine karsilik gelen value yi bulabiliriz..
           //SOLUTION-1
            // if(baseLayerElementValue===element.get("title")){
            //     element.set("visible",true);
            // }else{
            //   element.set("visible",false);
            // }
            //SOLUTION-2(DAHA PRATIK)

            element.setVisible(baseLayerElementValue===element.get("title"));
        })   
      })
  }
  
//TileDebug icin attribution a ihituyacimz yok
const tileDebugLayer=new TileLayer({
  source:new TileDebug(),
  visible:false,
  title:"TileDebugLayer"
})
// map.addLayer(tileDebugLayer);


//tile ArcGIS REST API Layer
//source miz TileArcGISRest icerisine url e yazikyoruz
const tileArcGISLayer=new TileLayer({
  source:new TileArcGISRest({
    url:"https://sampleserver6.arcgisonline.com/arcgis/rest/services/OsoLandslide/OsoLandslide_Before_3DTerrain/ImageServer",
    attributions:"TILE Arc GIS WSDOT"
  }),
  visible:false,
  title:"TileArcGISLayer"
})

// map.addLayer(tileArcGISLayer);

const NOAAWMSLayer=new TileLayer({
  source:new TileWMS({
    url:"https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_dailymaxairtemp_offsets/MapServer/WMSServer?",
    params:{
     LAYERS:5,
     FORMAT:"image/png",
     TRANSPARENT:true 
    },
    attributions:"<a href='https://nowcoast.noaa.gov/'> NOAA</a>"
  }),
  visible:false,
  title:"NOAAWMSLayer"
})



//Snippet tool su ile humanitarian layer icerisinden bir bolumu crop yaptik aldik ve onu da my-app klasoruz altinda data/static_image altina yapistirdik
//Static Image OpenStreetMap
const openstreetMapFragmentStatic=new ImageLayer({
  source:new Static({
    url:"./data/static_images/openlayers_static_humanitarian.png",
    imageExtent:[2568828.1670441725,5173529.485507568,9527501.742926065,8269603.403771877],//Bunu map uzerinde tiklayarak kendimiz manuel olarak aldik
    attributions:"<a href='https://www.openstreetmap.org/copyright'>©OpenStreetMap contrubutors</a>",

  }),
  visible:false,
  title:"openstreetMapFragmentStatic"
})


//Once bizim datayi almamiz lazm datayi nerden alacagiz, yani biz tamam VectorLayer kullanacagiz ama icerisinde kullanacagimz VectorImageLayer da biz source objesi icinde url den datayi cekecegimiz bir ulr gerekiyor sounc ta vector image icinde gostercegiz vector ler birer datadir..ve bir kaynaktan alinmasi gerekir...Biz datayi Geojson.io
//Geojson.io burasi kendi vektolerimizi cizebildigmiz,
//Burda geliriz ve 5 tane ulkenin baskentlerine draw point araci ile point koyariz ve o ulkelerin sinirlarini draw line tool ile cizeriz ve cizerken ki her bir noktanin koordinatlarini sag sidebar dag gorebiliriz ayrica point koydgumuz yerlerinde koordinatlerini gorebiliriz...ve sol ustte save menu elemntine tiklarsak o rda da bu datalari farkli datatype lerinda kaydedebilecegimzi de gorebilriz biz bunlari GeoJson olarak kaydetmeyi seceriz, ve map.geojson dosyasini indirilenler altnda gorebiliriz ve o dosyayi alip my-app map imizde data klasoru altinda vector_data klasoru olusturup onun altina tasiriz ve ismini de Central_EU_countries_GEOJSON

//Vector Layers
//Central EU Countries GeoJSON Vector Layer

const EUContriesGeoJSON =new VectorLayer({
  source:new VectorSource({
    url:"./data/vector_data/Central_EU_countries_GEOJSON.geojson",//url bize datamizi verecek, cekecek ya bu sekilde bir data kaynagindan indirilen bir geojson data kaynagi ya da direk url uzaktan datayi fetch ededebilir
    format:new GeoJSON(),
  }),
  visible:true,
})
map.addLayer(EUContriesGeoJSON);

//Biz burda VectorLayer i kullanarak avrupa baskentlerinin datasini geosjon.io da cizip o datayi aldik ve kendi map imizde kullandik ama birde VectorImage e bakacagiz VectorImageLayer ve VectorLayer nerde ise birbrinin aynisidir ama, VectorImageLayer in biraz daha hizli oldugu idda ediliyor
//ol/layer/VectorImage~VectorImageLayer
//options lar arasinda source kullanaagiz-ol/source/Vector~VectorSource-import VectorSource from 'ol/source/Vector.js';


//Central EU Countries GeoJSON VectorImage Layer
//Vector Layers
//Style for polygons
const fillStyle=new Fill({
  color:[40,119,247,1]
})

//style for lines
const strokeStyle=new Stroke({
width:1.2,//cizgilerin kalinligini veriyoruz
lineCap:"square",//cizgilerin bittig yerller yuvarlak mi olsun, kareli mi bitsin...bunu ancak widht i kalinlastirinca farkederiz..default olarak round shape gelir
//joins-koselerin de nasil olacagini belirleyebilirz
//sharp degil,keskin degil
lineJoin:"bever",
lineDash:[1,6],//dashed-line yapar, first-one size, second distance between dots 
})
const EUContriesGeoJSONVectorImage =new VectorImageLayer({
  source:new VectorSource({
   url:"./data/vector_data/Central_EU_countries_GEOJSON.geojson",//url bize datamizi verecek, cekecek ya bu sekilde bir data kaynagindan indirilen bir geojson data kaynagi ya da direk url uzaktan datayi fetch ededebilir
  
    format:new GeoJSON(),//Biz KML formatinda da alabilirz datayi ve o zaman da burayi KML formatini girmemiz gerekir
    //ol/format/Feature~FeatureFormat(XML format altinda KML format var)-ol/format/KML~KML
    
  }),
  visible:false,
  title:"CentralEUCountriesGeoJSON",
  style:new Style({
    fill:fillStyle,//polygonlarimizi stillendirmis olduk bu  sekilde
    stroke:strokeStyle
  })
})
//map.addLayer(EUContriesGeoJSONVectorImage);


//Central EU Countries KML
const EUContriesKML =new VectorLayer({
  source:new VectorSource({
    url:"./data/vector_data/Central_EU_countries_KML.kml",
 //Biz KML formatinda da alabilirz datayi ve o zaman da burayi KML formatini girmemiz gerekir
    //ol/format/Feature~FeatureFormat(XML format altinda KML format var)-ol/format/KML~KML
    format:new KML(),
  }),
  visible:false,
  title:"CentralEUCountriesKML"
})
//map.addLayer(EUContriesKML);
//KML formatinda data GeoJson dan tamamen farkli bir gosterime sahiptir..


//HeatMap

const heatMapOnlineFBUsers=new Heatmap({
  source:new VectorSource ({
    url:"./data/vector_data/onlineFBUsers.geojson",
    format:new GeoJSON()
  }),
  radius:17,
  blur:12,
  gradient:["#00f","#DC143C","#000000","#000000","#000000",],//5.renk yani indexi en son olan renk i siyah yapinca haritadaki yuvarlaklarin icide siyah oluyor
 //3-4 out layer icin, 2.siradaki blur icin
 visible:false,
 title:"OnlineFBUsers"
})
//Bu headMapOnlineFBUsers ile biz 5 tane ulkeye nokta koymus olduk ve bu noktalar renkleri kullaniicilar tarafindan yogun kullanilma degerine gore renkleri koyudan aciga dogru gidiyor buda tabi weightten geliyor...COOOK ONEMLI...WEIGHT COK ONEMLI BIR PROPERTY BU HEATMAP IN GOSTERIM AMACINI TESKIL EDIYOR
//map.addLayer(heatMapOnlineFBUsers);


//Austrian Cities EPSG 27700
// const AustrianCities=new VectorLayer({
//   source:new VectorSource({
//     url:"./data/vector_data/Central_EU_countries_GEOJSONN.geojson",
//     format:new GeoJSON({
//       dataProjection:"EPSG:27700",
//     })
//   }),
//   visible:true,
//   title:"AustrianCities",
//   style:new Style({
//     image:new Circle({
//       fill:new Fill({
//         color:[15,15,15,1]
//       }),
//       radius:10,
//       stroke:new Stroke({
//         color:[15,15,15,1],
//         width:2,

//       })
//     })
//   })
// })



const layerGroup=new LayerGroup({
  layers:[
    
    tileArcGISLayer,
    NOAAWMSLayer ,
    tileDebugLayer,
    openstreetMapFragmentStatic,
    EUContriesGeoJSONVectorImage,
    EUContriesKML,
    heatMapOnlineFBUsers,
    // AustrianCities
  ]
})

// map.addLayer(NOAAWMSLayer);
map.addLayer(layerGroup);

//Layer switcher logic for laster tile layers
const tileRasterLayerElements=document.querySelectorAll(".sidebar > input[type=checkbox]")

console.log("layerElements: ",tileRasterLayerElements)

for (let layerElement of tileRasterLayerElements) {
      layerElement.addEventListener("change",function(event){
        console.log(this.value);
        console.log("checked: ",this.checked);
        console.log(event.currentTarget.value);
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


      //Vector Feature Popup Information
//Bizim index.html de overlay icin yani pop-up icin element olusturmamiz gerekiyor...ki tiklanan vektor uzerine additionalinfo ve name bilgisini alabilelim...
  const overlayContainerElement=document.querySelector(".overlay-container");
  //Burda openlayers daki overlay class ini kullanacagiz
  //ol/Overlay~Overlay- An element to be displayed over the map and attached to a single map location.
  //Dokumantasyonda detayli inceleyebiliriz
  //import Overlay from 'ol/Overlay.js'; 

  const overlayLayer=new Overlay({
    element:overlayContainerElement,
  })
  map.addOverlay(overlayLayer)
  const overlayFeatureName=document.getElementById("feature-name");
  const overlayFeatureAdditionalInfo=document.getElementById("feature-additional-info");

      //Vector Feature Popup Logic 

     // map.on("click",function(event){
        map.on("pointermove",function(event){
          //pointermove-hover mantiginda calisiyor mousumuzu overlay alani uzerine gezdirdigmizde tetikleniyor
        //COK ONEMLI---BESTPRACTISE
        overlayLayer.setPosition(undefined);//Bu pozisyon disindaki alanlara tikaldimizda data gosterilmemesini saglayacak  

        map.forEachFeatureAtPixel(event.pixel,function(feature,layer){          
          console.log("features: ",feature);//values_ properteis i icinde hangi veckor elementine tikladii isek, point,line,polygon ona ait name,additional_info,geometry datalarini gorebiliriz, ve bu datlari biz map in uzerine getirmek icin kullanabiliriz
          console.log("check: ",feature.getKeys());
         
          console.log("features: ",feature.get("name"));
          let clickedFeatureName=feature.get("name");
          console.log("features: ",feature.get("additional info"));
          let clickedFeatureAdditionalInfo=feature.get("additional info");
          //Biz coordinatlara event.coordinate diye erisebiliyoruz
          let clickedCoordinate=event.coordinate;
      
        //  if(clickedFeatureName && clickedFeatureAdditionalInfo !=  undefined){
          overlayLayer.setPosition(clickedCoordinate);//BURASI COK ONEMLI....BESTPRACTISE..BURAYI VERMEZSEK O ZAMAN POZISYONU BULAMAZ...NERDE CALISACAGINI BULAMAZ..
          overlayFeatureName.innerHTML=clickedFeatureName;
          overlayFeatureAdditionalInfo.innerHTML=clickedFeatureAdditionalInfo;
        //  }
         
        }, {
          layerFilter:function(layerCandidate){
           // console.log("layerCandidate: ",layerCandidate)//Bu bize mapimzde var olan tum layer lari getirecektir
            return layerCandidate.get("title")==="CentralEUCountriesGeoJSON";
          }
        } )
  
      })
//BESTPRACITSE...COOOK ONEMLI...
//ol/Map~Map OZELLIKLE BURANIN NE GIBI, EVENTHANDLINGLERI VAR VE HANGI MEHTODLARI VAR BIZ DATALARA HANGI MEHTODLAR UZERINDEN NASIL ERISIRIZ BUNA COK IYI CALISMAMIZ GEREKIR...BIZIM MAP UZERINDE YAPACAGIMZ COK BELIRLEYICI VE ONEMLI ISLEMLERI BIZ BU METHODLAR, EVENTHANDLINGLER VE OPTIONLARINI TANIYARAK YAPABILEECEGIZ...




// const EUContriesKML =new VectorLayer({
//   source:new VectorSource({

//Select interaction - For styling selected points
//import Select from 'ol/interaction/Select.js';
//condition option i kullaniriz ve bu condition optionu saglandiginda select interaction uygulanir


// const selectInteraction=new Select({
//   condition:singleClick,
//   layers:function(layer){
//     return layer.get("title")==="AustrianCities" 
//   },
//   style:new Style({
//     image:new Circle({//nokta point icin bu kullanilyor...normalde..tikladigmiz her bir elementin
//         fill:new Fill({
//           color:[247,26,10,1]
//         }),
//         radius:12,
//         stroke:new Stroke({
//           color:[247,26,10,1],
//           width:3,
//         })
//     })
//     //image points ler  icin kullaniliyordu bunu circke yapalim
//   })
//   //style-selected features
// })

// map.addInteraction(selectInteraction);
const selectInteraction=new Select({
  condition:singleClick
})
map.addInteraction(selectInteraction);
/*
RADIOBUTTON MANTIGI
Radiobutton mantigi her zaman sudur, oncelikle toogle oolayi yoktur radio bttonda yani tiklanmis veya checked durumdaki bir radibuttona tiklama hicbir anlam ifade etmek cunku radiobuttonda tiklanmayan radio lardan biri tiklaninca sadece o checked olurken bir onceki checked olan unchecked olur yani her zaman icin 1 tane checked olacaktir...MANTIK BUDUR DOLAYISI ILE UNCHECKED OLANLARDAN BIR TANESINE TIKLANMALIDIR O UNCHECKED OLAN CHECKED OLURKEN, GERI KALAN TUM INPUT RADIO BUTTONLAR UNCHECKED OLMALIDIR YANI RADIO BUTTON DA UNCHECKED OLAN BIR TANESINE TIKLANMAASI BIR ONCEKI, CHECKED OLANI UNCHECKED YAPMAKTADIR YANI, DIGER RADIO INPUTLAR ETIKLENMEKTEDIR

CHECKBOX MANTIGI
AMA INPUT CHECKBOX DA MANTIK TMAAMEN BASKADIR BIZ CHECKBOX DAS HER ZAMAN HANGI CHECBOX A TIKALRSAK ONUN LADIR ISIMIZ KESINLIKLE BIZIM TILADGIMIZ CHECKBOX DIGER CHECKBOXLARI ETKILEMEZ ONLARDAN BAGIMSIZDIR VE BIZ CHECKED-UNCHECKED FARKETMEKSIZIN CHECBOX LARA TIKLAYABILIRIZ VE HER TIKLADIGMZDA TOGGLE MANTIGINDA TERSINE CEVIRIRIZ CHECKED ISE UNCHECKED YAPARIZ,,UNCHECKED ISE DE CHECKED YAPARIZ
*/




