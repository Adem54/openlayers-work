import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS.js';


let view =  new View({
  center: [0, 0],
  zoom: 2,
});
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view,
});


let wmsSource = new TileWMS({//WMS-geoserver dan gelen-Layer source for tile data from WMS servers.
  url:"http://localhost:8080/geoserver/topp/wms?",

  //url ile geoserver dan fetch edecegiz data kaynagini
  //geoserver da layerpreview dan hazirladigmz layer lardan indiastateboundary4 u openlayers da tiklayarak acariz ve o map i goruntuleriz ve o acilan adres cubugundaki url in wms e olan kismini kopyalariz
  params:{"LAYERS":"topp:states","TILED":true},
  //hangi geoserver da hangi layer i kullanacagmiz i belli etmek icin params kullaniyoruz. params a biz geoserver da previewlayer yaptiktan sonra gelen sayfadaki Name olarak hangisni kullaniyorsak onu yaziyourz
  //geoserver in wms server ini kullaniyoruz, consume ediyoruz
  serverType:"geoserver",
 // crossOrigin: 'anonymous',
  visible:true
    });

//polbnda_ind_pg4
let usaWMS = new TileLayer({
  title:"USA Population",
  source:wmsSource,
});

map.addLayer(usaWMS);


map.on('singleclick', function (evt) {
  document.getElementById('info').innerHTML = '';
  const viewResolution = /** @type {number} */ (view.getResolution());
  const url = wmsSource.getFeatureInfoUrl(
    evt.coordinate,
    
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/html',
    'INFO_FORMAT':'application/json'}
  );
  if (url) {
    console.log("url: ",url)
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        console.log("html: ", html);
        document.getElementById('info').innerHTML = html;
      });
  }
});

