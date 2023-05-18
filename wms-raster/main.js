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



let ankaraTileWMS = new TileLayer({
  title:"USA States",
  source:new TileWMS({
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
params:{"LAYERS":"geo-demo:my_new_raster1","TILED":true},
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",

visible:true,
  }),
  
})

map.addLayer(ankaraTileWMS);

let udyuTileWMS = new TileLayer({
  title:"USA States",
  source:new TileWMS({
url:"http://localhost:9090/geoserver/geo-demo/wms?",
//url ile geoserver dan fetch edecegiz data kaynagini
params:{"LAYERS":"geo-demo:uydu33","TILED":true},
//geoserver in wms server ini kullaniyoruz, consume ediyoruz
serverType:"geoserver",

visible:true,
  }),
  
})

map.addLayer(udyuTileWMS);