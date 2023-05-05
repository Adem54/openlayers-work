import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import Overlay from 'ol/Overlay.js';
import Feature from 'ol/Feature.js';
import Cluster from 'ol/source/Cluster.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import {Tile as TileLayer2, Vector as VectorLayer} from 'ol/layer.js';

//ol-ext eklentisini indirmemiz gerekiyor.. 
import AnimatedCluster from "ol-ext/layer/AnimatedCluster";
import FontSymbol from 'ol-ext/style/FontSymbol';
import OverlayPopup from 'ol-ext/overlay/popup';
import SelectCluster from 'ol-ext/interaction/SelectCluster';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,

} from 'ol/style.js';
import {fromLonLat} from 'ol/proj';


const fontSymbol = new FontSymbol({
  form: 'marker', // or 'hexagon', 'square', 'triangle' etc.
  radius: 10,
   glyph: 'ue800',//
   fontSize:16,
  
  color: 'red'
});

const styleFontSymbol = new Style({
  image: fontSymbol
});

let cities = [
  // {id:1,name:"Skien",coord:[1068935.7233506376, 8225579.575152853],places:skienPlaces},
  {id:1,name:"Skien-1",coord:[1067745.2998383467, 8222799.520519945]},
  {id:2,name:"Skien-2",coord:[1063430.4844371157, 8223724.123820209]},
  {id:3,name:"Skien-3",coord:[1062274.730311786, 8226574.983996022]},
  {id:4,name:"Skein-4",coord:[1078147.086966314, 8230658.648572187] },
  {id:5,name:"Skien-5",coord:[1073601.1207400172, 8232276.704347649] },
  {id:2,name:"Porsgrunn",coord:[1073831.3255811376, 8210138.675505912],},
  {id:3,name:"Sandefjord",coord:[1131890.6986440904, 8194202.11543706],},
  {id:4,name:"Tønsberg",coord:[1157792.0928421684, 8238836.714127301],},
  {id:1,name:"Porsgrunn-1",coord:[1066906.3430176247, 8209035.741119681]},
  {id:2,name:"Porsgrunn-2",coord:[1069176.8212111434, 8207601.754892196]},
  {id:3,name:"Porsgrunn-3",coord: [1079578.6800066372, 8209765.06050861]},
  {id:4,name:"Porsgrunn-4",coord:[1079399.4317282017, 8211199.046736096]},
  {id:0,name:"Skien7",coord:[1007129.3797322173, 8294679.372293536]},
  {id:0,name:"Skien8",coord:[971379.8524345149, 8293220.207914038]},
  {id:0,name:"Skien9",coord:[948762.8045522951, 8291761.04353454]},
  {id:0,name:"Skien10",coord:[923227.4279110791, 8272062.324411316]},
  {id:0,name:"Skien11",coord:[980864.4209012523, 8237042.379303362]},
  {id:0,name:"Skien12",coord:[974298.181193511, 8214425.331421142]},
  {id:0,name:"Skien13",coord:[926875.3388598243, 8220991.571128883]},
  {id:0,name:"Skien14",coord:[888937.064992875, 8206399.9273339035]},
  {id:0,name:"Skien15",coord:[864131.270541408, 8220261.988939134]},
  {id:0,name:"Skien16",coord:[859024.1952131648, 8256011.516236837]},
  {id:0,name:"Skien17",coord:[824733.8322949606, 8200563.269815911]},
  {id:0,name:"Skien18",coord:[1080687.7211708282, 8259009.946109484]},
  {id:0,name:"Skien19",coord:[1080687.7211708282, 8295181.758577816]},
  {id:0,name:"Skien20",coord:[708135.374458666, 8813269.280461924]},
  //newAreaFeature s coordinates
  {id:0,name:"Skien21",coord:[810746.0501567379, 8809164.853434]},
  {id:0,name:"Skien22",coord:[883257.5943167086, 8764016.15612685]},
  {id:0,name:"Skien23",coord:[920197.4375680145, 8695609.0389948]},
  {id:0,name:"Skien24",coord:[898307.1600857591, 8635410.7759186]},
  {id:0,name:"Skien25",coord:[839477.0393521979, 8582053.2245556]},
  {id:0,name:"Skien26",coord:[705399.0897733839, 8580685.08221296]},
  {id:0,name:"Skien27",coord:[634255.687956054, 8631306.348890675]},
  {id:0,name:"Skien28",coord:[621942.4068722855, 8687400.184938954]},
  {id:0,name:"Skien29",coord:[720448.6555424344, 8712026.747106493]},
  {id:0,name:"Skien30",coord:[788855.7726744825, 8654564.768715572]},
  {id:0,name:"Skien31",coord:[794328.3420450464, 8735285.166931389]},
  {id:0,name:"Skien32",coord:[891466.4483725545, 8664141.765114058]},
  {id:0,name:"Skien33",coord:[761492.9258216633, 8608047.929065779]},
  {id:0,name:"Skien34",coord:[732761.9366262031, 8740757.736301953]},
];

var municipalityFeatures = [];
console.log(municipalityFeatures.length);
cities.forEach(city=>{
  let {name,coord,id,places} = city;
 
  let feature = new Feature({
    geometry:new Point(coord),
    name,
    id,
    // features:places//nested features
  });
  municipalityFeatures.push(feature);
})

let skienFeature = new Feature({
  geometry:new Point([1068935.7233506376, 8225579.575152853]),
  name:"Skien-city",
  id:3735
})
skienFeature.set("city","Skien");
municipalityFeatures.push(skienFeature);

let mapLayers = [
  new TileLayer({
    source: new OSM(),
    name:"OSMLayer"
  }),
];

const popup = new OverlayPopup({
 popupClass:"default anim",//"tooltips", "warning", "default", "tips", "shadow"
 closeBox:true,
 autoPan:true,
 autoPanAnimation: { duration: 100 }
});

const map = new Map({
  target: 'map',
 
  view: new View({
    center: [713762.4545817552, 8628216.967363391],
    zoom: 2,
  }),
  layers: mapLayers ,
  // overlays:[popup]
});

// map.on("click", function(event){
//   console.log("event: ",event.coordinate);
// })
let vectorSource = new VectorSource({
  features: [...municipalityFeatures],
});
//Bir cluster source kisaca neden olusuyor, distance, yani bunu vermemiz gerekiyor ki vermezsek bile default olarak kendisinin veridigi distance degeri mutlaka vardir,
//Ozellikle vectorsource yi sourceye option una atamam miz gerekiyor ki hangi features lari cluster uygulayacagini bilsin...bu cook onemlidir
let clusterSource = new Cluster({
  distance:75,
  source:vectorSource
});

//AnimatedCluster i nasil npm package ile install edip import ile opnelayes7 de kullanabilirz bunu bulmaliy iz
// let clusterLayer2 = new AnimatedCluster({

// })

let clusterLayer = new AnimatedCluster({
  name:"Cluster",
  source:clusterSource,
  style:getStyle
  // style:styleFontSymbol
})
//Burasi normalde AnimatedCluster isminde bir extention i ekleyip onu kullanacaktik ama onu install edemedik ondan dolayi simdililk normal Vectorlayer kullanalim..clusterLayer icin , bu su demek hangi featuerslerimzi cluster ozelligi ile kullanacagiz.. yani point feature lerimzi

map.addLayer(clusterLayer);

map.getAllLayers().forEach(layer=>{
  console.log(layer.get("name"))
  if(layer.get("name") == "Cluster"){
     console.log(layer.getKeys())
  }
});

// refreshData();

var styleCache = {};
function getStyle(feature,resolution){
  var featSize =  feature.get("features").length;
  console.log("featSize: ",featSize);
  var totalPopulation = 0;
  /*Gruplanan feature leri burda donduruyoruz yani burda ornegin cluster ozelligi ile
   haritayi ilk actigmzda 2 ayri yerde 20-24 adet 2 nokta gozukuyor ise o zaman burda 
   feature dedigi o an biz kac adet ayri ayri yuvarlak goruyorsak her birisi featureslardan
    olusan yani dizi olarak gelen feature dur feature derken parametreye gelen feature
     manasinda yook sa tek basian feature degildir feature lardan olusan dizidir
      parametreye gelen feature ...Her bir grup tur feature aslinda yani o feature u
       biz foreach ile dondururnce her bir featuremize erisebiliriz ancak ve de her
        bir feature miziin icerisindeki spesifik degerlere gore onlara style ayarlamasi yapabiliriz
   */

  /* Burda biz feature uzerine feature a ait populasyonu basabiliriz bu sekilde 
  yani feature lerimiz iceriisindeki herhangi bir datayi basabiliriz...  */
  for(var j = 0; j < feature.get("features")[j]["population"]; j++){
    var population = parseInt(feature.get("features")[j].get("population"),10);
    // totalPopulation = totalPopulation + population;
  } 
  
   var size = totalPopulation;
  // var style = styleCache[size];BURASI COOK ONEMLI BURDA SIZE NE ISE CLUSTER DA  YANI HER BIR FEATURES GRUBUNDA O GOZUKECEKTIR
  var style = styleCache[featSize];
  if(!style){
    // var color = size > 100 ? "255, 0, 0 " : size > 50 ? "243, 156, 18 " : size > 25 ? "125, 206, 160 " : size > 10 ? "0, 150, 0" : size > 0.99 ? "0, 255, 0" : "192, 192, 192";
    // var color = featSize > 100 ? "255, 0, 0 " : featSize > 50 ? "243, 156, 18 " : featSize > 25 ? "125, 206, 160 " : featSize > 10 ? "0, 150, 0" : featSize > 0.99 ? "0, 255, 0" : "192, 192, 192";
    var color = featSize > 100 ? "255, 0, 0 " : featSize > 50 ? "243, 156, 18 " : featSize > 20 ? "240, 2, 153 " : featSize > 15 ? "220, 2, 240 " : featSize > 10 ? "0, 150, 0" : featSize == 1 ? "2, 240, 228 " : featSize > 0.99 ? "42, 240, 2 " : "192, 192, 192";
    
    var radius = Math.max(8, Math.min(size*0.75, 20));
    var dash = 2 *  Math.PI * radius / 6;
    var dash = [0, dash , dash, dash, dash, dash, dash];
    style = styleCache[size]  = new Style({
      image: new CircleStyle({
        radius: radius,
        stroke: new Stroke({
          color:"rgba("+color+",0.5)",
          width:15,
          lineDash:dash,
          lineCap:"butt"
        }),
        fill: new Fill({
          color:"rgba("+color+",1)"
        }),
      }),
      text: new Text({
        text: featSize.toString(),
        fill: new Fill({
          color: '#fff',
        }),
      }),
      zIndex:100,
    });
  }
  return style;
}


var img = new CircleStyle({
  radius:5,
  stroke:new Stroke({
    color:"rgba(0,255,255,1)",
    width:1
  }),
  fill:new Fill({
    color:"rgba(0,255,255,0.3)",
  })
})

var style0 = new Style({
  image:img
});

var style1 = {
 image:img,
 stroke:new Stroke({
  color:"#fff",
  width:1
 })
}

let selectCluster = new SelectCluster({
  pointRadius:7,
  animate:true,
  featureStyle:function(){
    return [true ? style1 : style0];
  },

  style:function(feature,resolution){
    var cluster = feature.get("features");
    //COOOK ONEMLI.. 
    //Her bir gruplanan features larin adina biz bir cluster diyoruz... unutma bunu ve bu sekilde aliyoruz..Bu yeni ve daha net bir bilgi.. 
    if(cluster.length > 1){
      var s = [getStyle(feature,res)];
      return s;
    }else{
      return [
        new Style({
          image:new CircleStyle({
            stroke:new Stroke({color:"rgba(0,0,192,0.5)", width:2}),
            fill:new Fill({color:"rgba(0,0,192,0.3)"}),
            radius:5
          })
        })
      ]
    }
    

  }
});

map.addInteraction(selectCluster);

//HER BIR INTERACTION DAN BIZ FEATURES LARA ERISEBILIYORUZ
// On selected => get feature in cluster and show info...burda yapiyoruz popup islevini.. her bir cluster icindeki feature lari burda alabiliyoruz.. ve  icindeki detay datalari gosterebilecegiz
selectCluster.getFeatures().on(['add'], function(e){
    var c = e.element.get("features");
    if(c.length == 1){
      var feature = c[0];
      var countryName = e.element.get("features")[0].get("country");
      var cityName = e.element.get("features")[0].get("city");
      var cityPopulation = e.element.get("features")[0].get("population");
      var content = "";

      content += "<h3> Country :</h3>"+ countryName;
      content += "<h3> Country :</h3>"+ cityName;
      content += "<h3> Country :</h3>"+ cityPopulation;

      popup.show(feature.getGeometry().getCoordinates(), content);
      //popup bir eklenti den gelen ozelliktir ve bu ozelligin show methodu oldugu ve parametrelerine neler girmesi gerektigini tabi ki eklenti kaynadingan ogreniyoruz
      //http://viglino.github.io/ol-ext/doc/doc-pages/ol.Overlay.Popup.html#show__anchor
      //show(coordinate, html)
      // Set the position and the content of the popup.
    }else{
      $(",infos").text("Cluster (" + c.length +  " features)");
    }
})

selectCluster.getFeatures().on(["remove"], function(e){
  popup.hide();
})


var features = [];

//BESTPRACTISE... VEKTOR LAYER DATA MIZIN COORDINATLARI VEYA LONG-LAT DATA VE ONUN DISINDAKI SPESIFIK DATALARI TXT DOSYASINDA TUTUP SONRA ORDAN OKUYUP ONLARDAN FEATURE LAR OLUSTURMA VE O FEATURE LERE SPESIFIK DATALARI DA YERLESTIRME...BUNU IILK DEFA GORDUM... 
// function refreshData(){
//   $.get('world_cities_population.txt', function(data1){
//     var splitRow = data1.split(/\r?\n/);
//     features = [];
//     $.each(splitRow, function(eachRow){
//       var splitColumn = splitRow[eachRow].split("|");
//       // features[eachRow] = new Feature(new Point({fromLonLat([splitColumn[3], splitColumn[2]])}))
//       features[eachRow].set("country", splitColumn[0]);
//       features[eachRow].set("country", splitColumn[0]);
//       features[eachRow].set("country", splitColumn[0]);
//     });
//     clusterSource.getSource().clear();
//     clusterSource.getSource().addFeatures(features);
//   });
//   $.get('world_cities_population.txt').abort();
// }

//Eger her bir saniye de biz bu datayi refresh edelim dersek de o zaman 
//var id = setInterval(refreshData, 1000) yapariz
//world_cities_population.txt dosyasi icinde 
//country|city|lat|lng|population|pop_lac
//India|Delhi|28.66|77.23|29617000|296.17
//India|Mumbai|18.9667|77.8333|23355000|233.55