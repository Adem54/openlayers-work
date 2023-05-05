import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Polygon from "ol/geom/Polygon.js";
import Point from 'ol/geom/Point.js';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';

import {Cluster, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer2, Vector as VectorLayer} from 'ol/layer.js';
import {boundingExtent} from 'ol/extent.js';
import AnimatedCluster from "ol-ext/layer/AnimatedCluster";

let polygonCoord2 = [
  [
    [669431.7755232407, 8881812.341647647],
[922573.5103251962, 8832817.167169848],
[1000149.203248376, 8653168.19408459],
[889910.0606733309, 8506182.670651197],
[591856.0826000609, 8510265.60185768],
[542860.9081222634, 8673582.850117007],
[669431.7755232407, 8881812.341647647],
  ]
]


let polygonCoord = [
 [
  [1138055.9561527735, 8181997.386207917],
  [1190510.5612002006, 8291370.818008934],
  [1019754.080939428, 8337129.090497116],
  [860158.1549440654, 8289138.707155853],
  [776453.9979534906, 8173068.942795589],
  [1138055.9561527735, 8181997.386207917],
 ]
]


let fillStyleForPolygon = new Fill({// fill styling for polygon styling
  color:[255,255,0,0.3],//son color transaprencydir..
});

let stylePolygon=new Style({
  fill:fillStyleForPolygon,//polygon styling
  
});

let fillStyleForPolygon2 = new Fill({// fill styling for polygon styling
  color:[230,108,185,0.3],//son color transaprencydir..
});

let stylePolygon2=new Style({
  fill:fillStyleForPolygon2,//polygon styling
  
});

let telemarkAreaFeature = new Feature({
  geometry:new Polygon(polygonCoord),
  name:"telemark",
  id:1
})

let newAreaFeature =  new Feature({
  geometry:new Polygon(polygonCoord2),
  name:"new_area",
  id:2
})

let polygonSource = new VectorSource({
  features:[telemarkAreaFeature, newAreaFeature]
});
let vectorlayer2 =  new VectorLayer({
  source:polygonSource,
  style:stylePolygon
})
newAreaFeature.setStyle(stylePolygon2);

let skienPlaces = [
  {id:1,name:"Skien-1",coord:[1067745.2998383467, 8222799.520519945]},
  {id:2,name:"Skien-2",coord:[1063430.4844371157, 8223724.123820209]},
  {id:3,name:"Skien-3",coord:[1062274.730311786, 8226574.983996022]},
  {id:4,name:"Skein-4",coord:[1078147.086966314, 8230658.648572187] },
  {id:5,name:"Skien-5",coord:[1073601.1207400172, 8232276.704347649] },
];

skienPlaces = skienPlaces.map(item=>{
  let {coord,name,id} = item;
  return new Feature({
    geometry:new Point(coord),
    name,
    id
  })
})

let porsgrunPlaces = [
  {id:1,name:"Porsgrunn-1",coord:[1066906.3430176247, 8209035.741119681]},
  {id:2,name:"Porsgrunn-2",coord:[1069176.8212111434, 8207601.754892196]},
  {id:3,name:"Porsgrunn-3",coord: [1079578.6800066372, 8209765.06050861]},
  {id:4,name:"Porsgrunn-4",coord:[1079399.4317282017, 8211199.046736096]},
];

porsgrunPlaces = porsgrunPlaces.map(item=>{
  let {coord,name,id} = item;
  return new Feature({
    geometry:new Point(coord),
    name,
    id
  })
})

//Cluster mantiginda coordinatlerin birbirine yakinligina gore kendisi otomatik olarak birine tiklayinca onun alanina giren digerlerine yakinlasitiriyor yani biz elimzdeki tum features leri bir dizi icnde tutacagiz ve koordinatlarin yakinligina gore cluster tikladikca digerlerini gosterecek galiba



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

let telemarkFeature = new Feature({
  geometry:new Point([1005844.0034385305, 8265580.37022253]),
  name:"Telemark",
  // features:municipalityFeatures//nested features
});

const source = new VectorSource({
  features: [...municipalityFeatures],
});

//Cluster da ol/source den geliyor yani aslindas bir tur source dir ve herhangi layer in option i olarak kullanilir ve kendi option i icerisinde de feature lerle olusturulmus bir VectorSource den olusur
const clusterSource = new Cluster({
  name:"clusterSource-NAME",
  //distance: parseInt(50, 10),//input value sinden 40 geliyor 
  distance:30,
  //10 sayisi arttikca haritadaki noktalar azaliyor aralrindanki mesafe artiyor..ama 10 sayisi 5 olunca nokta sayisi artarken aralarindaki distance azaliyor
  minDistance: parseInt(20, 10),
  source: source,
});


console.log("clusterSource-features-lengthhh: ",clusterSource.getSource().getFeatures().length);

const styleCache = {};

//Burdaki feature lar harita da ilk actigimzda karsimiza gelen pointlerdir noktalardir ve biz zoom-in yaptgmizda bu noktlarin sayisi artiyor..AnimatedCluster bir layer a karsilik geliyor... bunu bilelim
// const clusters = new AnimatedCluster({
  const clusters = new VectorLayer({
  //AnimatedCluster
  name:"Clusterlayer",
  //source: clusterSource,
//  style: clusterStyleFunction,
});


function clusterStyleFunction (feature) {
  // console.log("feature.get('features'): ",feature.get('features'));
   //Her bir feature icerisinde o feature ye ait features isminde key var ve onun value si de onun alt feature leridir yani dizi icerisindeki feature lerdir... 
   
   const size = feature.get('features').length;//Kac tane ise o numarayi gosteriyoruz bakinca kullanici sunu bilecek bu point marker kac numara gosteriyorsa yaklasinca o adette alt datalarini gorecek
  let originalFeature = feature.get("features")[0];
          let name = originalFeature.getKeys();
     // console.log("keys: ",name);
     // console.log("city: ",originalFeature.get("city"));
     // console.log("name: ",originalFeature.get("name"));
   //BESTPRACTISE....
   //Burda eger ki size:1 ise o zaman sen bu pointin artik detay bilgilerini gosteren style i uygula diyebiliriz... 
 //  console.log("size: ",size);
   //Burda gruplayamayi kendisi coordinatlarin yakinligina gore otomatik yapiyor ve ona gore de size:2, size:1, size:3 geliyor..
   let style = styleCache[size];
   var dynamic_text = size > 1 ? size.toString() : "Hytta";
   var color = size > 100 ? "255, 0, 0 " : size > 50 ? "243, 156, 18 " : size > 20 ? "240, 2, 153 " : size > 15 ? "220, 2, 240 " : size > 10 ? "0, 150, 0" : size == 1 ? "2, 240, 228 " : size > 0.99 ? "42, 240, 2 " : "192, 192, 192";
   var dynamic_text_color = size > 10 ? "#fff" : "#000";

   if(size == 1){
       
   var selectedFeature = feature.get('features')[0];
  // console.log(selectedFeature.get("name") );
   //Burda biz style a text i uygulayamayiz cunku burda dinamik bir sekilde surekli style i degistiriyor ama size i n kac oldugunu gorebiliyoruz..yani kac tane ayri point e veya parcaya boldu ise onu gorebiliriz.. onun sayisini gorebiliiriz.. 
 
   //Boyle yaptigimz zaman hangisi ilk once 1 olursa onun textini diger tum noktalara da basmis oluruz eger ki size i 1 olunca ayarladimgiz dinamik text i genel style da kullanirsak
   dynamic_text_color = selectedFeature.get("name") ? selectedFeature.get("name") :  dynamic_text;  
   style = new Style({
     image: new CircleStyle({
       radius: 12,
       stroke: new Stroke({
         color: '#fff',
       }),
       fill: new Fill({
         color: '#3399CC',
         color:"rgba("+color+",05)"
       }),
     }),
     text: new Text({
       text: selectedFeature.get("name"),
       scale:1,
       fill: new Fill({
          color: dynamic_text_color,
         
       }),
     }),
     zIndex:100,
   });
   }else if(size<=6){
     {
       if (!style) {
         style = new Style({
           image: new CircleStyle({
             //radius noktanin icinde numara olan noktalarin daire seklinde genislemesini sagliyor
             radius: 15,
             stroke: new Stroke({
               color: '#fff',
             }),
             fill: new Fill({
               color: '#3399CC',
               color:"rgba("+color+",05)"
             }),
           }),
           text: new Text({
             text: size.toString(),
             scale:1.2,
             fill: new Fill({
                color: dynamic_text_color,
               
             }),
           }),
           zIndex:100,
         });
         styleCache[size] = style;
       }
     }

   }else if(size<=11){
     {
       if (!style) {
         style = new Style({
           image: new CircleStyle({
             //radius noktanin icinde numara olan noktalarin daire seklinde genislemesini sagliyor
             radius: 18,
             stroke: new Stroke({
               color: '#fff',
             }),
             fill: new Fill({
               color: '#3399CC',
               color:"rgba("+color+",05)"
             }),
           }),
           text: new Text({
             text: size.toString(),
             scale:1.5,
             fill: new Fill({
                color: dynamic_text_color,
               
             }),
           }),
           zIndex:100,
         });
         styleCache[size] = style;
       }
     }

   }else{
     if (!style) {
       style = new Style({
         image: new CircleStyle({
           //radius noktanin icinde numara olan noktalarin daire seklinde genislemesini sagliyor
           radius: 18,
           stroke: new Stroke({
             color: '#fff',
           }),
           fill: new Fill({
             color: '#3399CC',
             color:"rgba("+color+",0.9)"
           }),
         }),
         text: new Text({
           text: size.toString(),
           scale:2,
           fill: new Fill({
              color: dynamic_text_color,
             
           }),
         }),
         zIndex:100,
       });
       styleCache[size] = style;
     }
   }

   return style;
 }



const raster = new TileLayer2({
  source: new OSM(),
});

const map = new Map({
  layers: [raster],
  target: 'map',
  view: new View({
    center: [713762.4545817552, 8628216.967363391],
    zoom: 4,
  }),
});

clusters.setSource(clusterSource);
clusterSource.set("name","myclusterSource");
console.log("CLUSTERS-SOURCE-NAME: ",clusterSource.get("name"))
//BESTPRACTISE...ILK EKLENEN EN ALTTA SON EKLENEN USTTE KALACAKTIR STYLE OLARAK BU COK ONEMLIDIR... 
clusters.setStyle(clusterStyleFunction);
map.addLayer(vectorlayer2);
map.addLayer(clusters);




console.log("clusters-LAYER-FEEATURES_LENGTH: ",clusters.getSource().getSource().getFeatures().length);

map.on("click",function(event){
  console.log(event.coordinate);
})

map.on('click', (e) => {
  
  //Cluster vector layer getFeatures methodu Promise donduruyor, burdaki amac tiklandigi zaman ona islev kazandiriyor...ondan dolayi
  clusters.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      console.log("features-length: ",features.length);
     
     features.forEach(item=>{
      // console.log("name::: ",item.get("name"))
     
     })
      
      console.log("munfeatures2:")
      if (features.length > 1) {
        const extent = boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates())
        );
        map.getView().fit(extent, {duration: 3500, padding: [100, 100, 100, 100]});
      }
    }
  });
});


// get the cluster features
var clusterFeatures = clusterSource.getFeatures();
console.log("showClusterFeaturesLength: ",clusterFeatures.length);
// loop through the features and change the style for the selected feature
for (var i = 0; i < clusterFeatures.length; i++) {
  console.log("test")
  var clusterFeature = clusterFeatures[i];
  var clusterSize = clusterFeature.get('features').length;
  
  if (clusterSize === 1) {
    // change the style for the selected feature
    
    var selectedFeature = clusterFeature.get('features')[0];

    selectedFeature.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        stroke: new ol.style.Stroke({
          color: '#fff'
        }),
        fill: new ol.style.Fill({
          color: '#FF0000'
        }),
        text: new Text({
          text: selectedFeature.get("name") ? selectedFeature.get("name") : "default" ,
          fill: new Fill({
            color: '#fff',
          }),
        }),
      })
    }));
  }
}



source.getFeatures().forEach(feature=>{
 // console.log(feature.get("name"));
  let text = feature.get("name");
  if(feature.get("name")){
    let newStyle =  new Style({
      image: new CircleStyle({
        radius: 10,
        stroke: new Stroke({
          color: '#fff',
        }),
        fill: new Fill({
          color: '#e66c70',
        }),
      }),
      text: new Text({
        text:text,
        fill: new Fill({
          color: '#fff',
        }),
      }),
      zIndex:100,
    });
  feature.setStyle(newStyle)
  }
})








/*
EXAMPLES OF CLUSTER FEATURES IN OPENLAYERS
Cluster features:  https://openlayers.org/en/latest/examples/cluster.html 
Dynamic Cluster:  https://openlayers.org/en/latest/examples/clusters-dynamic.html

 Ilk once elimzdeki tum feature leri biz bir array icine atip bunu sources e veriyoruz
 Ardindan da bu cluster da source olarak kullanililiyor ve cluster in yapisi su sekildedir
 Kendisi point lerin koordinatlarinin birbirine yakinliklarina gore, onlari grupluyor ve bizim karsimiza da grupladigi pointler icin
 yuvarlak bir style olusturup uzerinde kac adet point barindiriyo ise onu gosteriyor
 Bunu kendisi coordinatlarin yakinligina gore yapiyor ve biz zoom-in i kullandikca da dinamik olarak tekrar bir gruplama yapiyor 
 Bunu asagidaki yerde yapiyor

 const clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    console.log(feature.getKeys());
    const size = feature.get('features').length;
    console.log("size: ",size);//features icerisinde bulunan adet sayisini verecek
    let style = styleCache[size];

    Daha sonra ise 


map.on('click', (e) => {
  
  clusters.getFeatures(e.pixel).then((clickedFeatures) => {
    if (clickedFeatures.length) {
      // Get clustered Coordinates
      const features = clickedFeatures[0].get('features');
      console.log("features.length: ",features.length);
      if (features.length > 1) {
        const extent = boundingExtent(
          features.map((r) => r.getGeometry().getCoordinates())
        );
        map.getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
      }
    }
  });

  Yukardaki map.on("click",(e)=>{ ) kisimda biz const features = clickedFeatures[0].get('features'); olarak tikladigmz point altinda kac tane feature var ise onlari bir dizi icerisinde aldigmiz yerdir ama tiklanan point altindaki feature lari de zaten cluster ozelligi coordinatlarin birbrine yakinligina gore ayarliyor yani burda bizim features leri parent child iliskisinde yerlestiremize gerek yok biz sadece ilk bas elimizdeki tum feature leri bir dizi icine atariz ve eger varsa spesifik ozelliklerimiz onlari da o feature ler icerisine yazariz geririsini cluster hallediyor ve bura da her bir dizimize ait spesifk name, id vs var ise onlari foreach ile dondurerek alabiliriz
  Ve tiklandigi zaman burasi hem animasyonu  hem padding i ayarliyor hem de tekrar dan tiklanan point altindaki noktalar yakinliklarina gore gruplaniyor ve birkez daha  const clusters = new VectorLayer({ tetiklenerek bunlari bir kez daha yakinliklarina gore grupluyor ve ona gore de her grup features un lengthine gore point markalari uzerinde kac adet feature var ise onlari gorecek sekilde geliyor karsimiza

  VE tekrardan gruplanmis olan noktalar dan ornegin uzerinde 4 yazan bir noktaya tikladigmz zaman bu 4 feature a ait datalara erisebiliyoruz ve tekrardan bir zoom-in olmus oluyor her tiklagimzda ve yeniden bir daha yaklasarak birbrine yakinliklarina gore bir gruplama soz konusu olacaktir 
 
*/