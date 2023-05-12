import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import TileSource from 'ol/source/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
//Layer source for the OpenStreetMap tile server.

import LayerGroup from 'ol/layer/Group.js';
import MousePosition from 'ol/control/MousePosition.js';
import {format} from 'ol/coordinate.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import Overlay from 'ol/Overlay.js';

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
import GML2 from 'ol/format/GML2.js';


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});


let USAWMS = new TileLayer({
  title:"USA States",
  source:new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
url:"http://localhost:9090/geoserver/topp/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
//geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
params:{"LAYERS":"topp:states","TILED":true},
//hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",

visible:true
  })
});

let wfs_url = 'http://localhost:9090/geoserver/topp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=topp%3Astates&maxFeatures=50&outputFormat=application%2Fjson';

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


 map.addLayer(USAWMS);
 map.addLayer(geoJson);

   const overlayContainerElement=document.querySelector(".overlay-container");	
 const overlayLayer=new Overlay({
  element:overlayContainerElement,
})
//3-overlayerimizi mapimze ekleriz
map.addOverlay(overlayLayer);

  const overlayFeatureName=document.getElementById("feature-name");
  const overlayFeatureId=document.getElementById("feature-id");
  const overlayFeatureAdditionalInfo=document.getElementById("feature-additional-info");


map.on("click", function(event){
  geoJson.getSource().getFeatures().forEach(feature=>{
    console.log("STATE_NAME: ", feature.get("STATE_NAME"));
    console.log("SUB_REGION: ", feature.get("SUB_REGION"));
    //SUB_REGION

})

  console.log("MAPCLICKKK......");

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
       let STATE_NAME = feature.get("STATE_NAME");
       let id = feature.getId();
       let SUB_REGION = feature.get("SUB_REGION");
       let clickedCoordinate=event.coordinate;
   
       if(STATE_NAME && SUB_REGION){
        overlayLayer.setPosition(clickedCoordinate);
          overlayFeatureId.innerHTML = `id: ${id}`;
          overlayFeatureName.innerHTML=`name: ${STATE_NAME}`;
          overlayFeatureAdditionalInfo.innerHTML=`type: ${SUB_REGION}`;
      geoJson.getSource().forEachFeature(feat=>{
        console.log("STATE_NAME: ", feature.get("STATE_NAME"));
        console.log("SUB_REGION: ", feature.get("SUB_REGION"));
        //BESTPRACTISE..WFS DEN GELEN DATA NIN TIKLANAN FEATURE IN SECILI OLMASI, TIKLANMAYANLARIN DA DEFAULT STYEL OLMASI DINAMIK OLACAK SEKILDE YAPILMASI
        if(feat.getId() == feature.getId()){
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
       console.log("KEYS: ",feature.getKeys());
       console.log("feature.getName: ",feature.get("STATE_NAME"))
       console.log("geometry: ",feature.get("the_geom"))
       
       console.log("feature.getName: ",feature.getId())
       
       console.log("featuregetType: ",feature.get("SUB_REGION"))
      
    }
})


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
       // srsName:'urn:ogc:def:crs:EPSG::4326',//EPSG:4326
      })  

      //WEB-FEATURE-SERVICE ILE GELEN FEATURES LARIN KENDISINE AIT ID LERI VAR BUNU UNUTMAYALIM KI BU GETKEYS LER ICINDEKI ID_1 HARICINDEKI ID LERDIR BUNLAR
    //  console.log("id: ",feature.getId())
      let feature_id = feature.getId();
      var gml3 = format_GML3.writeGeometryNode(geometry, {
        featureProjection:'urn:x-ogc:def:crs:EPSG:4326',
      })
    //Bizim burda geom ile ilgili kullanilan kolon bilgisi hangisi ise, onu girmemiz gerekiyor bu onemli..
//update isleminde, geom, ve id birde tabi degistirilecek olan alan cok onemlidir... bu 3 u cok isimize lazim olacak



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

      var url1 = 'http://localhost:9090/geoserver/wfs?';
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
   
      //response hatali geliyor problem yasiyoruz cunku, 
      var postData =
      '<wfs:Transaction service="WFS" version="1.1.0"\n'
     +'xmlns:topp="http://www.openplans.org/topp"\n'
     +'xmlns:ogc="http://www.opengis.net/ogc"\n'
     +'xmlns:wfs="http://www.opengis.net/wfs"\n'
     +'xmlns:gml="http://www.opengis.net/gml"\n'
     +'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
     +'xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd">\n'
     +'<wfs:Update typeName="topp:states">\n'
       +'<wfs:Property>\n'
         +'<wfs:Name>the_geom</wfs:Name>\n'
         +'<wfs:Value>\n'
          +'<gml:MultiPolygonString srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n'
          +'<gml:polygonStringMember>\n'
            +'<gml:PolygonString>\n'
            +gml3+'\n'
            +'</gml:PolygonString>\n'
          +'</gml:polygonStringMember>\n'
        +'</gml:MultiPolygonString>\n'
      
         +'</wfs:Value>\n'
       +'</wfs:Property>\n'
     +'<wfs:Property>\n'
         +'<wfs:Name>STATE_NAME</wfs:Name>\n'
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
          console.log("req.status: ",req.status);
          return;
        }
     
     console.log("responseText: ",req.responseText);
    //  alert(req.responseText);
   
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