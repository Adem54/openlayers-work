import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {Draw, Modify, Snap} from 'ol/interaction.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {get} from 'ol/proj.js';

const raster = new TileLayer({
  source: new OSM(),
});

const source = new VectorSource({
 
});
const vector = new VectorLayer({
  source: source,
  style: {
    'fill-color': 'rgba(255, 255, 255, 0.2)',
    'stroke-color': '#ffcc33',
    'stroke-width': 2,
    'circle-radius': 7,
    'circle-fill-color': '#ffcc33',
  },
});

// Limit multi-world panning to one world east and west of the real world.
// Geometry coordinates have to be within that range.
const extent = get('EPSG:3857').getExtent().slice();

console.log("extentstart: ",extent);

extent[0] += extent[0];
extent[2] += extent[2];
console.log("extent: ",extent);
const map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [-11000000, 4600000],
    zoom: 4,
    extent,
    /*0
    : 
    -40075016.685578491:-20037508.342789244 2:  40075016.685578493:  20037508.342789244 */
  }),
});

const modify = new Modify({source: source});
map.addInteraction(modify);

let draw, snap; // global so we can remove them later
const typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new Draw({
    source: source,
    type: typeSelect.value,//Burda dinamiik bir durum ayarlaniyor kullanici hangi interaction i secer ise o burda devereye giriyor ve burda html icindeki interaction isimleri icin kullanilan html elemntlerinde value olarak burda interaction type lara verilmesi gereken isimler verilmis
  });
  map.addInteraction(draw);
  // snap = new Snap({source: source});
  // map.addInteraction(snap);
}

/**
 * Handle change event.
 */
/* 
BESTPRACTISE...FARKLI BUTONLAR ILE FARKLI TYPE DAKI DRAW -POLYGON, LINE, POINT INTERACKTIFILIGI YAPILACAGI ZAMAN HER ZAMAN KULLANICI BU BUTONLARDAN BIRINE TIKLADIGI ZAMAN ORDA CALISACAK OLAN METHOD ICINDE ILK OLARAK YAPILACAK ISLEM BIR ONCEKI INTERAKTIFLIGI KALDIRMAK OLMALIDIR BU COK ONEMLI BUNA DIKKAT EDELIM......BESTPRACTISE.....BENIM YAPTGIM ISLEMDE DE BOYLE HATALAR OLUYOR DU SEBEBI DE BU DEMEKKI
burda her bir selecticinde yeni bir optiona tiklanarak secildiginde ilk once bir onceki interaction i kaldiriyor ardindan yeni interaction i devreye sokacak olan methodu calistiriyor 
Kullanici ornegin 3 4 tane, farkli
*/
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();
