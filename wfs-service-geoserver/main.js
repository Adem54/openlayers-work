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
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import Modify from 'ol/interaction/Modify.js';
import GML from 'ol/format/GML.js';
import GML3 from 'ol/format/GML3.js';


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

 let pointStyle = new Style({
  image:new CircleStyle({//Buraya CircleStyle yerine Circle girersek hata aliriz ama hata da bize bunu soylemiyor cunku Circle diye de bir class var ama o class altinda bizim kullandigmiz methodlar yokk..
    fill:new Fill({
      color:[0, 232, 217,1],
    }),
    radius:10,
    stroke:new Stroke({
      color:[232, 220, 0,1],
      width:0
    })
  })
})

 const source = new VectorSource();
 const vector = new VectorLayer({
    source: source,
   title :'MyVectorLayer',
   style:pointStyle ,//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
  //style,
   
 });

//map.addLayer(vector);
overlayLayerGroup.getLayers().push(vector);
//Bu sekilde overlayLayerGroups icerisine layer imizi ekleyebiliriz

var style = new Style({
  fill:new Fill({
    color:'rgba(255,255,255,0.7)'
  }),
  stroke:new Stroke({
    color:'#ffcc33',
    width:3
  }),
  image:new CircleStyle({
    radus:7,
    fill:new Fill({
      color:'#ffcc33'
    })
  })
})

let pointCoords = [8788949.444203824, 3530929.9633466285];

 //[8257591.411341889, 2310870.2642453555]
let pointCoords2 =[1525055.1330004458, 6185855.128569698];
let pointCoords3 =[443929.80493491306, 5957155.539940451];
let pointCoords4 = [744785.9482653667, 6952671.396326587];

let pointGeometry  = new Point(pointCoords);
console.log("pointGeometry: ", pointGeometry);

const featurePoint = new Feature({
  geometry: pointGeometry ,
  name: "featurePoint",
  id:5,
});

// featurePoint.setGeometryName("featurePoint");
featurePoint.setId("featurePointID");
featurePoint.set("title","featurePointTitle");

let features = [featurePoint]
source.addFeatures([...features])
 //WEB FEATURE SERVICE-LAYER ADD
 //Web Feature Service ile biz tamamen apayri bir layer olusturuyoruz...oncelikle bunu bilelim ve bu uzaktan gelen bir request sonucunda geldigi icin gelmesi zaman aliyor birazcik...
 //Bu url geoserver layerpreview e tiklayinca 	geo-demo:ind_adm12_pg isimli layer da en sagda select one daki optiondan  WFS altindaki geojson formati secilince karsimza gelen data nin url idir
let wfs_url = 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&outputFormat=application%2Fjson';

//WFS SERVICE INI FILTRELEYEREK DE KULLANABILIYORUZ...
//url icerisinde typeName den sonra outputFormat tan oncesine filtrleme ifadesini koyabiliyorouz
//CQL_FILTER=id_1>='30' ve bu sekilde id_1 i 30 dan buyuk olan feature lar a ait alanlari bize getiriyor bu sekilde...HARIKA BESTPRACTISE...
let wfs_filtered_url = "http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&CQL_FILTER=id_1>='30'&outputFormat=application%2Fjson";

//FILTER INSTERSECT FROM A LAYER TO ANOTHER LAYER-  bu sekilde filtreleme de  yapabiliriz
let wkt = pointGeometry;//burda herhangi bir geometry verebiliriz point, polygon, line...hangisi ile kesism
let wfs_intersect_filtered_url = 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&outputFormat=application%2Fjson&cql_filter=INTERSECTS(geometry, '+ wkt +')';
//Bu sekilde bunlari da filtreleyebiliyoruz
//http://localhost:9090/geoserver/wfs?request=GetFeature&version=1.0.0&typeName=topp:states&outputFormat=GML2&FILTER=%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CIntersects%3E%3CPropertyName%3Ethe_geom%3C/PropertyName%3E%3Cgml:Point%20srsName=%22EPSG:4326%22%3E%3Cgml:coordinates%3E-74.817265,40.5296504%3C/gml:coordinates%3E%3C/gml:Point%3E%3C/Intersects%3E%3C/Filter%3E 


//Bounding box filtrelemesi de y apabiliriz... 
//http://localhost:9090/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=topp:states&propertyName=STATE_NAME,PERSONS&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326

let wfs_bbox_filtered_url = 'http://localhost:9090/geoserver/geo-demo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geo-demo%3Aind_adm12_pg&maxFeatures=50&outputFormat=application%2Fjson&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326';

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
  //  url:wfs_filtered_url,
  // url:wfs_intersect_filtered_url,
  //  url:wfs_bbox_filtered_url,
    format: new GeoJSON(),//geojson veya dier WFS formatiindan birini kullanabiliriz, bu optionslari geoserver da layerpreview da layer select-option da gorebiliriz
    style:style
  })
 })

overlayLayerGroup.getLayers().push(geoJson);


let highlightStyle = new Style({
  fill:new Fill({
    color:'rgba(255,255,255,0.7)'
  }),
  stroke:new Stroke({
    color:'#3399CC',
    width:3
  }),
  image:new CircleStyle({
    radus:10,
    fill:new Fill({
      color:'#3399CC'
    })
  })
})

let featureOverlayLayer = new VectorLayer({
  title:"WFS_layer1",
  source:new VectorSource(),
  style:highlightStyle
})

 //1-pop up alanini gostercegmiz html elementinin referansini aliriz once...
   const overlayContainerElement=document.querySelector(".overlay-container");			
 //2-Sonra overlayimizi olustururuz
 
 const overlayLayer=new Overlay({
   element:overlayContainerElement,
 })
 //3-overlayerimizi mapimze ekleriz
 map.addOverlay(overlayLayer);

   const overlayFeatureName=document.getElementById("feature-name");
   const overlayFeatureId=document.getElementById("feature-id");
  const overlayFeatureAdditionalInfo=document.getElementById("feature-additional-info");



 map.on("click",function(event){
  console.log("MAPCLICKKK......")

  console.log(event.coordinate);
  var feature = map.forEachFeatureAtPixel(event.pixel,
    function(feature,layer){
      return feature;
    } )

    if(feature){
      console.log("feature......")
      overlayLayer.setPosition(undefined);
       var geometry = feature.getGeometry();
       console.log("feature.getKeys: ",feature.getKeys())
       //ISTE BURDA WFS SERVICE UZERINDEN TUM ATTRIBUTE LERE TUM DATALARA ERISIMIS OLUYORUZ GEOSERVER UZERINDEN...
       let name_1 = feature.get("name_1");
       let type_1 = feature.get("type_1");
       let id_1 = feature.get("id_1");
       let clickedCoordinate=event.coordinate;
   
       if(name_1 && type_1){
        overlayLayer.setPosition(clickedCoordinate);
          overlayFeatureId.innerHTML = `id: ${id_1}`;
          overlayFeatureName.innerHTML=`name: ${name_1}`;
          overlayFeatureAdditionalInfo.innerHTML=`type: ${type_1}`;
      geoJson.getSource().forEachFeature(feat=>{
        console.log("testtttttt",   feat.get("id_1"))
        console.log("TESTTFEATURE: ", feature.get("id_1"))
        console.log("RESULT: ",feat.get("id_1") == feature.get("id_1"))
        //BESTPRACTISE..WFS DEN GELEN DATA NIN TIKLANAN FEATURE IN SECILI OLMASI, TIKLANMAYANLARIN DA DEFAULT STYEL OLMASI DINAMIK OLACAK SEKILDE YAPILMASI
        if(feat.get("id_1") == feature.get("id_1")){
          console.log("YES ID_1 EQUAL ")
        //  feature.setStyle(highlightStyle);
          feat.setStyle(highlightStyle);
        }else{
        //  feature.setStyle(undefined);
          feat.setStyle(undefined);
        }
      })
      // overlayLayerGroup.getLayers().push(featureOverlayLayer);
      //  layerSwitcher.renderPanel();
      //  featureOverlayLayer.getSource().addFeature(feature);

      //  map.updateSize();
       }
       console.log("feature.getName: ",feature.get("name_1"))
       console.log("geometry: ",feature.get("geometry"))
       console.log("feature.getName: ",feature.get("id_1"))
       
       console.log("featuregetType: ",feature.get("type_1"))
      
    }
})

let source_modify = featureOverlayLayer.getSource();
let modify = new Modify({
  source:source_modify
});
map.addInteraction(modify);
//GEOJSON...AYRI BIR FILE OLARAK DA KULLANABILIYORUZ...OPENLAYERS DA AMA GEOSEERVER BIZE BUNU BIR WFS SERVICE I OLARAK SUNUYOR HARIKA BIR BESTPRACTISE....
//Biz burda geojson ile WFS service si araciligi ile geoserver dan bu sekilde layer in datalarina erisebiliyoruz..ki biz geoserver datasini alip bir dosyaya kaydederek de ayrica openlayers icerisinde kullanabiliyoruz bunu da unutmayalim....

function getPostData(layer_name,){
  return `<wfs:Transaction service="WFS" version="1.0.0"
  xmlns:topp="http://www.openplans.org/topp"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd">
  <wfs:Update typeName="${layer_name}">
    <wfs:Property>
      <wfs:Name>the_geom</wfs:Name>
      <wfs:Value>
        <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
          <gml:lineStringMember>
            <gml:LineString>
              <gml:coordinates>500000,5450000,0 540000,5450000,0</gml:coordinates>
            </gml:LineString>
          </gml:lineStringMember>
        </gml:MultiLineString>
      </wfs:Value>
    </wfs:Property>
    <ogc:Filter>
      <ogc:FeatureId fid="tasmania_roads.1"/>
    </ogc:Filter>
  </wfs:Update>
</wfs:Transaction>
`;
}

function edit_save(){
  var input = document.getElementById("input");
  var value_name1 = input.value;//Biz burda WFS ile kullandigmz layer icinde bulunan attributes lerden name_1 degerini update veya  edit etmek istiyoruz ondan dolayi biz ismine value_name1 diye yazdik anlasilsin diye
 // alert(value_name1);
 var mod_features = geoJson.getSource().getFeatures();//Bu sekilde WEB-FEATURE-SERVICE ILE ALDIGMZ LAYER IN TUM FEATURE LERINE ERISEBILIYORUZ.. 
 if(mod_features.length > 0){
  mod_features.forEach(feature => 
  {
      var geometry = feature.getGeometry();
      var format_GML3 = new GML3({
        srsName:'urn:ogc:def:crs:EPSG::4326',//EPSG:4326
      })  

      //WEB-FEATURE-SERVICE ILE GELEN FEATURES LARIN KENDISINE AIT ID LERI VAR BUNU UNUTMAYALIM KI BU GETKEYS LER ICINDEKI ID_1 HARICINDEKI ID LERDIR BUNLAR
    //  console.log("id: ",feature.getId())
      let feature_id = feature.getId();
      var gml3 = format_GML3.writeGeometryNode(geometry, {
        featureProjection:'urn:ogc:def:crs:EPSG::4326',
      })
    
      //Bu modfiye edildikten sonra bunu biz asagida kullanacagiz ki modifye edilmis datayi kullanabilmek ve getirebilmek icin

    //GML formatta yaziyoruz...update yapacagimz zaman  
    //geoserver a gideriz sol sidebar da en alt kisimdaki Demos a tikladigmiz zaman demo requests i acarsak ordan WFS-T yani edit islemleri  yapacagimiz zaman kullanacaigmz WFS_transictionUpdateGeom.xml i actgimiz zaman orda bulunan kodlairn aynisini kullanacagiz burda da 
   

    /*
    Request : WFS_transictionUpdateGeom.xml
    URL: http://localhost:9090/geoserver/wfs
    <!--       YOU PROBABLY DO NOT WANT TO RUN THIS QUERY SINCE 
              IT WILL MODIFY YOUR SOURCE DATA FILES

     This will update one of the geometry fields in the tasmania_roads dataset.   
-->
<wfs:Transaction service="WFS" version="1.0.0"
  xmlns:topp="http://www.openplans.org/topp"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd">
  <wfs:Update typeName="topp:tasmania_roads">
    <wfs:Property>
      <wfs:Name>the_geom</wfs:Name>
      <wfs:Value>
        <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
          <gml:lineStringMember>
          	<gml:LineString>
            	<gml:coordinates>500000,5450000,0 540000,5450000,0</gml:coordinates>
          	</gml:LineString>
          </gml:lineStringMember>
        </gml:MultiLineString>
      </wfs:Value>
    </wfs:Property>
    <ogc:Filter>
      <ogc:FeatureId fid="tasmania_roads.1"/>
    </ogc:Filter>
  </wfs:Update>
    */
   //BURDA SADECE DEGISTIRECEGIMZ SEY LAYERNAME DIR, YANI BIZ YUKARDAKI IFADEYI GEOSERVER IN DEMO-DEFAULT OLARAK VERDIGI DEGERDEN ALDIGIMZ ICIN O DEFAULT OLARAK VERDIGI LAYER BASKA BIR LAYER BIZIM LAYER ISMINI KENDI KULLANDIGIMZ LAYER ISMI NE ISE GEORSERVER DA ONU GIRMEMIZ GEREKIYOR
   //DEGISTIRMEMIZ GEREKKEN Y ERLER
   //topp:tasmania_roads  YERINE KENDI LAYERIMIZ OLAN geo-demo:ind_adm12_pg U KULLANIRIZ  YANI BU SEKILDE KI O LAYER E OZEL OLAN IFADELERI BIZ DINAMIK OALRAK KULLANACAK SEKILD AYARLAYAN BIR METHOD  YAPARIZ

      var url1 = 'http://localhost:9090/geoserver/wfs';
      var method = 'POST';
      var layername = 'geo-demo:ind_adm12_pg';
      //Bu geom kolonun biz geoserver da layer ayarinda edit layer diyerek bu WFS service sini kullandigmiz layer in attribute lerine bakiyoruz orda geom isminde bir kolon var biz onu aliyoruz geom olarak, yani geom yi isaret eden kolon ismi bizim layerimz da geom diye geciyor ama bazi layer larda ornegn the_geom diye de gecebilir
       //gml3 formatli datayi yazdiiriyoruz tekrardan ki bu modfiye edildikten sonra bunu biz asagida kullanacagiz ki modifye edilmis datayi kullanabilmek ve getirebilmek icin
      /* Sonr ada update edecegimz property-yani attribute icin kullaniyoruz asagidaki kismi 
        </wfs:Value>
      </wfs:Property>
      <wfs:Property>
      <wfs:Name>name_1</wfs:Name> name_1 attribute name dir bu
        <wfs:Value>
          ${value_name1} bu value_name1 i de biz input box icinde alacagiz... 
        </wfs:Value>
        </wfs:Property>
        Son olarak da id yi dogru almamiz gerekiyor bu cok onemlidir burasi uniq id dir
        
      ind_adm12_pg-layeri mizi biz openlayers da yayinlariz ve herhangi bir state-yani alan a bastigmiz zaman hangi attriubutes veya kolonlarin bulundugnu gorebliriz ve de fid ile de id nin isminin kolon ismini fid oldugunu gorebiliriz..
      fid	id_0	iso	name_0	id_1	name_1	hasc_1	ccn_1	cca_1	type_1	engtype_1	nl_name_1	varname_1
      ind_adm12_pg.20	105.0	IND	India	20.0	Maharashtra	IN.MH	0.0		State	State	
        */ 
   
      var postData =
      '<wfs:Transaction service="WFS" version="1.1.0"\n'
     +'xmlns:geo-demo="http://www.openplans.org/geo-demo"\n'
     +'xmlns:ogc="http://www.opengis.net/ogc"\n'
     +'xmlns:wfs="http://www.opengis.net/wfs"\n'
     +'xmlns:gml="http://www.opengis.net/gml"\n'
     +'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
     +'xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd">\n'
     +'<wfs:Update typeName="geo-demo:ind_adm12_pg">\n'
       +'<wfs:Property>\n'
         +'<wfs:Name>geom</wfs:Name>\n'
         +'<wfs:Value>\n'
       +gml3+'\n'
         +'</wfs:Value>\n'
       +'</wfs:Property>\n'
     +'<wfs:Property>\n'
         +'<wfs:Name>name_1</wfs:Name>\n'
         +'<wfs:Value>\n'
       +value_name1+'\n'
         +'</wfs:Value>\n'
       +'</wfs:Property>\n'
       +'<ogc:Filter>\n'
         +'<ogc:FeatureId fid="'+feature_id+'"/>\n'
       +'</ogc:Filter>\n'
     +'</wfs:Update>\n'
   +'</wfs:Transaction>\n';
      //Ajax request
      var req = new XMLHttpRequest();
      req.open("POST", url1, true);
      req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
      req.setRequestHeader('Content-type', 'text/xml');
      req.onreadystatechange = function () {
        if (req.readyState != 4) return;
        if (req.status != 200 && req.status != 304) {
      //    alert('HTTP error ' + req.status);
          console.log(req.status);
          return;
        }
     
     console.log(req.responseText);
    // alert(req.responseText);
    }
    if (req.readyState == 4) return;
    req.send(postData);

  });
 }
}

let btn = document.querySelector("#btn");
btn.addEventListener("click", function(e){
  edit_save()
});