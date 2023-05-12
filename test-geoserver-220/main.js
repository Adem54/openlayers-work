import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';

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



let historicalPlaceWMS = new TileLayer({
  title:"Historical Places",
  source:new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
//geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
params:{"LAYERS":"geo-demo:historical2","TILED":true},
//hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",
visible:true
  })
});

map.addLayer(IndiaPolbnda_Ind_Pg4Tile)
map.addLayer(IndiaAdm1StateTile)
map.addLayer(historicalPlaceWMS)