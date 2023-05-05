import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import Point from "ol/geom/Point.js";
import Draw from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';

const map = new Map({
   target: "map",
   layers: [
      new TileLayer({
         source: new OSM(),
      }),
   ],
   view: new View({
      center: [0, 0],
      zoom: 2,
   }),
});


let draw = new Draw({
  source: new VectorSource({wrapX: false}),
  type: "Point",
});
map.addInteraction(draw);

const feature = new Feature({
   // geometry: new Polygon(polyCoords),
   //Bir polygonun, koodrinatlari bu sekilde alinir
   geometry: new Polygon([
      [
         [26.651448388196457, 51.09849278644998],
         [22.695347433271564, 50.37774777091764],
         [25.830775073079423, 48.18783655806928],
         [26.651448388196457, 51.09849278644998],
      ],
   ]),
   // labelPoint: new Point(labelCoords),
   labelPoint: new Point([22.360792843408376, 51.23365101733839]),
   name: "My Polygon",
});

/*
Vektor icindeki Polygon,Point ve line ile ilgili feature lar olusturarak onlara ait koordinatllari alabiliriz var olan mevcut koordinatlari ve sonra tekrardan o feature ler uzerinden koordinatlari heme alaiblirz hem de set edegbilriz..
*/


// get the polygon geometry
const poly = feature.getGeometry();
console.log("polycoordintates: ", poly.getCoordinates());

//koordinatlari tekrardan set edebiliyoruz...
// poly.setCoordinates();

feature.setGeometryName("labelPoint");
//isim de atayabiliyoruz...
//
console.log("polyGeometryName: ", feature.getGeometryName());


// Render the feature as a point using the coordinates from labelPoint


// get the point geometry
const point = feature.getGeometry().getCoordinates();
console.log("point: ", point); //point:  (2) [22.360792843408376, 51.23365101733839]

/*
Feature yeni feature u biz layer Vektor laye eklerken icerisine features olarak Polygon, Point, i koordinatlari ile ekleyerek sonra o koordinatlari biz set edebiliyoruz

*/

map.on("dblclick",function(event){
  console.log(event)
})