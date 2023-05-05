import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';

const parser = new WMTSCapabilities();
let map;

fetch('data/WMTSCapabilities.xml')
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
      layer: 'norgeskart_bakgrunn',
      matrixSet: 'EPSG:3857',
    });

    let wmtsService = new TileLayer({
      opacity: 1,
      source: new WMTS(options),
    });

    map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.7,
        }),
       
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    map.addLayer(wmtsService);
  });
