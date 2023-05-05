// import './style.css';
// import {Map, View} from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';

// import XYZ from 'ol/source/XYZ';

// const googleMapsSource = new XYZ({
//   url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
//   tileSize: [256, 256],
//   maxZoom: 20,
//   attributions: [
//     '<a href="https://www.google.com/maps">Google Maps</a>',
//     '<a href="https://www.google.com/intl/en-US_US/help/terms_maps/">Terms of Use</a>'
//   ],
//   crossOrigin: 'anonymous',
//   apiKey: 'YOUR_API_KEY_HERE'
// });

// const googleMapsLayer = new TileLayer({
//   source: googleMapsSource
// });


// const map = new Map({
//   target: 'map',
//   layers: [
//     // new TileLayer({
//     //   source: new OSM()
//     // })
//     googleMapsLayer
//   ],
//   view: new View({
//    // center: [10.4964249, 61.2641154],
//     center: [61.2641154,10.4964249],
 
//     zoom: 2
//   })
// });

// import './style.css';
// import {Map, View} from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';

// const map = new Map({
//   target: 'map',
//   layers: [
//     new TileLayer({
//       source: new OSM()
//     })
//   ],
//   view: new View({
//     center: [0, 0],
//     zoom: 2
//   })
// });


import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import Point from "ol/geom/Point.js";
import LineString from "ol/geom/LineString.js";
import Draw from "ol/interaction/Draw.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Modify from "ol/interaction/Modify.js";
import Select from 'ol/interaction/Select.js';
import { singleClick } from "ol/events/condition";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { Circle } from "ol/geom";
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Text from "ol/style/Text";

import RegularShape from 'ol/style/RegularShape.js';
import Icon from 'ol/style/Icon.js';
 import XYZ from 'ol/source/XYZ';
 import Overlay from 'ol/Overlay.js';

//import Style from "ol/style/Style";
//style i spesifiklestirmek istedgimz zaman burayi kullaniriz

let fillStyleForPolygon = new Fill({// fill styling for polygon styling
  color:[255,255,0,0.5],//son color transaprencydir..
});
let strokeStyleForPoint =new Stroke({//styling for point under CircleStyle
  color:[255,255,0,1],
  width:2,
 });
 let fillStyleForPoint = new Fill({//styling for point under CircleStyle
  color:[247,26,10,1],
});

let styleForPoint = new CircleStyle({//point-styling CircleStyle which consist of fill,radius,stroke
  fill:fillStyleForPoint,//fill  styling for point
  radius:12,
  stroke:strokeStyleForPoint,//stroke styling for point under CircleStyle
 })

let strokeStyleForLine=new Stroke({//stroke styling for line 
  color:[255,255,0,1],
  width:4,
  lineCap:'square',//uclari koseli
  lineJoin:'bevel',//line in donme koseleri sivri mi ya da duz mu olsun
lineDash:[1,6],//1-size of the dot, 6-between dot
 });

 let fillTextStyling = new Fill({//fill styling for text
  color:[87,9,9,1]
});

let strokeTextStyling =new Stroke({//stroke styling for text
  color:[87,9,9,1],
  width:0.5
});

 let textStyling = new Text({//text styling for text which consist of fill,stroke,text and scale options
  text:'text',
  scale:1.5,
  fill:fillTextStyling,
  stroke:strokeTextStyling
});

//Points-regularShape-Biz eger circle yapmak istemiyor da point imizin yerine ucgen, dortgen , besgen gibi duzenli sekiller yapmak istersek o zaman regularShape i kullaniriz yok ama biz point imizin yerine yine circle seklinde bir sekil istersek o zaman regularShape degil CircleStyle kullanacagiz...ki zaten CircleStyle da regularShape in subclass idir....
//Zaten CircleStyle da da fill,radius ve stroke tanimlariz...bununla ilgili ornek zaten yukarda var..
let regularShapePointStyle = new RegularShape({
  fill:fillStyleForPoint,
  stroke:strokeStyleForPoint,
   points:3,//3 sides-Ucgen / 5 yaparsak Besgen olarak gelir..Ama radius u kullanmazsak alamayiz goruntuyu
 //  radius:10,
   // eger radius1 ve radius2 yu kullanirsak yukardaki radius u kullanmamiza gerek kalmaz
   //radius1-radius2 outer and inner
   radius1:10,//outer--disardaki koseleri buyutur..bu da ... 
   radius2:5,//inner--bu icerdeki koseleri verir
    rotation:.5 //saati yonune dogru dondurmek istersek de bu sekilde dondurebliriz
})


//Pointlerimz icin icon veya image kullanmak! iconStyle class i araciligi ile
//Oncelikle iconlarimizi bulmak iicn icon8.com dan istegimiz iconu bulalim....

//Once gostermek istedgmiiz png veya svg leri indiriyoruz bir klasor altina atariz, biz images klasourmuz altina attik
//Sonra da  import Icon from 'ol/style/Icon.js'; sayfasina gideriz ve orda
//scale-image imizin ne boyutunu ayarlariz
//opacity-
//size

let iconMarkerStyle = new Icon({
  src:"/images/map_marker.png",//Burasi cook onemlidir...burayi vermez isek style imizi goremeyiz..
  size:[100,100],//px cinsinden widht-height
  offset:[0,0],//default one
  opacity:1,
  scale:0.4,//Ozellikle burasi boyutunu cok etiliyor
  color:[10,98,240,1],//burda da imageimizin rengini de degistirebiliyoruz... 
  //anchor option i kullanirsak pointimizn pozisyonu da degisebilir onun icin kullanmak cok tavsiye edilmiyor
});

//STYLING FEATURES BASED ON PROPERTIES...YANI FEATURES UNA GORE...NASIL STYLE VEREBILIRIZ....BESTPRACTISE....
//BUNU YAPMAK ICIN....ONCE VECTOR DATA MIZA VECTOR DATAMIZ NEDIR, FEATURE S LERDIR...HER BIR FEATURES UMUZUN OZELLIKLERINE GORE...PROPERTYLER ATAMASI YAPARIZ...OBSERVABLE-BASECLASS OZELLIGNDEN FAYDALANARAK
//HER BIR FEATURE MIZI KENDIMIZ OLUSTURUUYORUZ VE HER BIR FEATURE MIZDE MAP E BASMAK ISTEDIGMZ ICON-SEMBOL-IMAGE E GORE BIR KEYWORD VEYA TITLE VEYA NAME ATAMASI YAPARIZ..FEATURE UZERINDEN ERISEBILECEGIMIZ....
//HEM TITLE HEM DE ID ATAMASI YAPABIRIZ HER BIR FEATURE MIZE VE BU DEGERLER UZERINDEN DE SPESIFIK OLARAK HER BIR FEATURE U DINAMIK OLARAK STYLE VEREBILIRIZ...SIMDI BAKALIM BUNU NASIL YAPARIZ...
//1-ID-TITLE ATAMASI YAPARIZ FEATURE LERIMIZIN HER BIRISINE
//Yukardaki ornekler ile biz tum pointlerimize bir style ayarlamis olduk peki biz ya her bir point, line veya polygon umuz icin ayri bir style kullanmak istersek o zaman ne yapariz...Simdi de ona  bakalim....


let style=new Style({
  fill:fillStyleForPolygon,//polygon styling
// image:styleForPoint,//point styling-new CircleStyle
//image:regularShapePointStyle,
image:iconMarkerStyle,
 //text:textStyling,//text styling
 stroke:strokeStyleForLine,//line styling
});


//AYRICA NEW STYLE DA OPTION OLARAK TEXT DE KULLANABILIRZ EGER TEXT GOSTERMEK ISTERSEK VECTORLERIN USTUNDE
//Z-INDEX ILE DE STYLING I PRIORITY YAPABILIRIZ MESELA, BIR VECTOR LAYER DA BIRDEN FAZLA STYLING KULLANIP ARALARINDA PRIORITING SIRALAMASI YAPABILIRZ


//ol/style/Style   da GEOMETRYFUNCTION:
//A function that takes an Feature as argument and returns an Geometry that will be rendered and styled for the feature.



let minX=[-482448.8844272373, 6948537.808663547];
let minY=[1243954.0938784746, 5418990.528870807];
let maxX=[2855125.4802697455, 6736944.794138221];
let maxY= [1067306.316037831, 7855455.623686972];


//KENDIMZ BOS BIR LAYER VE BOS BIR SOURCE OLUSTURURUZ DAHA SONRA DA ELIMIZDE VAR OLAN, point,polygon ve line fetaures larini hazirlayip sourcer miz e eklersek artik ekkledmgiz koordinatlari layer uzerinde goereibiliriiz
//StyleFunction()
// style/Style.js, line 10
// A function that takes an Feature and a {number} representing the view's resolution. The function should return a Style or an array of them. This way e.g. a vector layer can be styled. If the function returns undefined, the feature will not be rendered.

let pointStyle = new Style({
  image:new CircleStyle({//Buraya CircleStyle yerine Circle girersek hata aliriz ama hata da bize bunu soylemiyor cunku Circle diye de bir class var ama o class altinda bizim kullandigmiz methodlar yokk..
    fill:new Fill({
      color:[227, 16, 19,1],
    }),
    radius:7,
    stroke:new Stroke({
      color:[227, 16, 19,1],
      width:2
    })
  })
})

let pointImageStyle =new Style({
  image:iconMarkerStyle,

});

let lineStringStyle = new Style({
  stroke:new Stroke({
    color:[89, 88, 88,1],
    width:2
  })
})

let featurePolygonStyle2=new Style({
  fill:new Fill({// fill styling for polygon styling
    color:[16, 12, 245,0.5],//son color transaprencydir..
  }),
});

let featurePolygonStyle3=new Style({
  fill:new Fill({// fill styling for polygon styling
    color:[12, 245, 39,0.5],//son color transaprencydir..
  }),
});

let mySpecificStyleByFeature ;

//Bu sekilde biz her bir point,line,polygona ozel style verme imkanini elde etmis olacagiz...
//Dikkat edelim..biz vector layer icindeki style da bir function variable veriyoruz direk..yani invoke ederek degil de direk function olarak veriyoruz ve bu feature argmenti aliyor.. style:mySpecificStyleByFeature de tum feature lar vardir
mySpecificStyleByFeature = function(feature){
 // console.log("feature: ",feature);
  //Buraya style i icerisinde kullandigmiz VectorLayer de kac adet fetaures var ise hepsi gelecektir..tum feature lar burda biizim icin musait artik..ARtik bunlara erisip bunlara spesifik style lar verebiliriz burda
  //ol.feature aramasi ile dokumantasyonu incelersek bizim feature.setStyle ile her bir feature mize spesifik bir style atamasi yapabilirz ayrica da bu style lari da get ile alabiliriz..
  //Bu sekilde biz bir feature nin type ini alabilriz.
  let geometryType = feature.getGeometry().getType();
  // console.log("geometryType: ",geometryType);
  // console.log("getKeys(): ",feature.getKeys());
  // console.log("getKeys(): ",feature.get('name'));//Bu sekilde atanmis olan name lere erisilebilir...
  let name = feature.get('name');

  //Text styles
  let featureID = feature.get("id");
  featureID = featureID.toString();
  // console.log("featureIDD: ",featureID);
  // console.log("getKeys(): ",feature.getKeys());
  let textStyles = new Style({
    //import Style from 'ol/style/Style.js'; text	Text | undefined	 Text class style.
    //ol/style/Text~Text new Text(options) ve bircok options gorebiliriz text kullanirken...burda da yine feature a ozel text kullanma imkanina sahibiz...
    //Bu arada ayrica biz bir point,line veya polygon feature mize birden fazla style lar uyggulayabilirz hatta bunlar arasinda z-index ile oncelik sirasi das belirleyebilirz...
    text:new Text({//text styling for text which consist of fill,stroke,text and scale options
      text:featureID,//Buraya number type atayamayiz...string type atamamiz gerekir...number atama durumudna hata aliriz.
      scale:1.5,
      fill:fillTextStyling,
      stroke:strokeTextStyling
    })
  })
  //Asagidaki gibi type a gore feature leri belirleyip ya da spesifik name lere gore de belirleyip sonra direk o feature ye style atamasi yapabiliriz....spesifik bir style
  if(geometryType === "Point"){
    //  console.log("point-feature: ",feature);
      feature.setStyle([pointStyle,textStyles]);//2.style olarak aliyoruz...
  }
  if(geometryType === "LineString"){
    feature.setStyle([lineStringStyle]);
    
  }
  //featurePolygon3
  if(geometryType === "Polygon"){
    // console.log("Polygon-feature: ",feature);
    // console.log("Polygon-name: ",name);//featurePolygon2,featurePolygon3
    if(name === "featurePolygon2"){
       feature.setStyle([featurePolygonStyle2]);
    }
    //COOOK ONEMLI...
    //Biz istersek tabi featurePolygon3 feature si icine color isminde bir key atariz ve karsina value olarak da ister spesifik isim veririrz blue vs gibi ister direk rgb-hex color i string olark atayip...getirip burda kullaniriz...yani daha spesifklestirme adina bircok detay yapabilirz artik....
    if(name === "featurePolygon3"){
      feature.setStyle([featurePolygonStyle3]);

    }
  }
  if(name == "featurePoint4"){//Bu feature ye spesifik olarak bir image icon u vermis olduk burda da.... 
    feature.setStyle([pointImageStyle]);
 
  }

}


//styling i biz dinamik olarak kullanirken fonksiyon ile birlikte kullanabiliyoruz ornegini asagida gorebiliriz

const source = new VectorSource();
const vector = new VectorLayer({
   source: source,
  title :'MyVectorLayer',
  style:mySpecificStyleByFeature ,//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
 //style,
  
});

const map = new Map({
   target: "map",
   layers: [
      new TileLayer({
         source: new OSM(),
      }),
      vector,
   ],
   view: new View({
      center: [1598434.680154215, 6473258.354921961],
      zoom: 6,
      extend:[minX,minY,maxX,maxY]
     
   }),
});

// const googleMapsSource = new XYZ({
//   url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
//   tileSize: [256, 256],
//   maxZoom: 20,
//   attributions: [
//     '<a href="https://www.google.com/maps">Google Maps</a>',
//     '<a href="https://www.google.com/intl/en-US_US/help/terms_maps/">Terms of Use</a>'
//   ],
//   crossOrigin: 'anonymous',
//   apiKey: 'YOUR_API_KEY_HERE'
// });

// const googleMapsLayer = new TileLayer({
//   source: googleMapsSource
// });


// const map = new Map({
//   target: 'map',
//   layers: [
//     // new TileLayer({
//     //   source: new OSM()
//     // })
//     googleMapsLayer,
//     vector
//   ],
//   view: new View({
//    // center: [10.4964249, 61.2641154],
//     center: [61.2641154,10.4964249],
 
//     zoom: 2
//   })
// });


let polyCoords = [
   [
    [816876.2628476555, 6547692.4899035385],
    [1097695.9539145145, 6337923.564046366],
    [701841.6906033999, 6185671.924311323],
    [624024.185849933, 6425891.178115503],
      [816876.2628476555, 6547692.4899035385],
   ],
];

let polyCoords2 = [[
  [2224522.1101688095, 5854811.401793875],
 [1906135.8712262376, 5423825.151517955],
 [2810818.720904521, 5093790.635540899],
  [3129204.959847093, 5602432.066046715],
 [2224522.1101688095, 5854811.401793875],
]
]



let lineCoords = [
  [1253330.9634214486, 6683027.280779134],
  [1510467.0660850785, 6743927.936673151],
  [1595051.3103823252, 6858962.508917406],
  [1733769.47102981, 6916479.795039535],
];


let lineCoords2 = [
  [2269602.9872447476, 6740173.340662673],
  [2336505.881373996, 6522261.064219243],
  [2137708.826916475, 6331109.938135675],
  [1705707.311134959, 6443889.022314776],
];

const featureLine2 = new Feature({
  geometry: new LineString(lineCoords2),
  name: "My Line2",
  mytitle:"featureLine2",
  id:1,
});


let pointCoords = [1598434.680154215, 6473258.354921961];
let pointCoords2 =[1525055.1330004458, 6185855.128569698];
let pointCoords3 =[443929.80493491306, 5957155.539940451];
let pointCoords4 = [744785.9482653667, 6952671.396326587];


const featurePolygon2 = new Feature({
  geometry: new Polygon(polyCoords),
  name:"featurePolygon2",
  id:2,
});

const featurePolygon3 = new Feature({
  geometry: new Polygon(polyCoords2),
  name:"featurePolygon3",
  id:3,
});

let labelCoords = [2657546.144073617, 7730494.596156541];
const featurePolygon = new Feature({
   geometry: new Polygon(polyCoords),
   labelPoint: new Point(labelCoords)
});

//get the polygon geometry
//BIR FEATURE MIZE name ve id atamasini bu sekilde yapabilyoruz...Observable ozelligi uzerinden.. 
const polyGeometry = featurePolygon.getGeometry();
//COK ONEMLI BURAYI BILMEMIZ GEREKYOR..EGER BIZ SETGEOMETRYNAME ILE YENI BIR GEOMETRYNAME ATAMASI YAPARSAK O ZAMAN MEVCUT POLYGON UMUZ DEGISTIGI ICIN MAP-LAYER ARTIK BIZIM KOORDINATLARINI VEREREK OLUSTURDGMUZ POLYGON FEATURE SINI TANIMAYACAKTIR..VE BIZ EGER KI MEVCUT TANIMLADIGMIZ POLYGON FEATURE SINI DEGISTIRMEK ISTERSEK DE O ZAMAN ICERIISNDE labelPoint veya bu isim farki da olablir ama onemli olan bir geometry yani new Polygon,new point veya new LineString gibi bir value atanmasidir... ve setGeometry ile de bu  labelPoint atanir ise artik feature olarak bu degeri taniyacaktir yani aslinda polygon olarak tanimladiik ama sonrada pointe donusturmus oluyyoruz....
featurePolygon.setGeometryName("featurePolygon");
featurePolygon.setGeometryName("labelPoint");
featurePolygon.setId("featurePolygonID");
// console.log(featurePolygon.getGeometryName());
// console.log(featurePolygon.getId());
//Bir featuremize id(setId),name(setGeometryName),style(setStyle) atamalari yapabiliyoruz...
//AYRICA DA ISTEDIGIMIZ HERHANGI BIR KEYWORD VE VALUE SINI ATAMA YAPIP DAHA SONRA DA O KEYWORE ERISEBILIYORUZ...
featurePolygon.set("title","featurePolygonTitle");
featurePolygon.set("color","blue");
featurePolygon.set("style","blue");
// console.log(featurePolygon.get("color"));//blue
// console.log(featurePolygon.get("style"));//blue
// console.log(featurePolygon.get("title"));
//AYRICA PROPERTIES ATAMASI DA YAPABILYORUZ...setproperties.. ile ve de getproperties ile alabilyoruz
//setKeys ve getKeys ile de ayni sekilde keys atamasi ve okumasi yapaibloiriz



//new Point(labelCoords),
const featureLine = new Feature({
   geometry: new LineString(lineCoords),
   name: "featureLine",
   featureLine:"featureLine",
   id:4
});

const featurePoint = new Feature({
   geometry: new Point(pointCoords),
   name: "featurePoint",
   id:5,
});

// featurePoint.setGeometryName("featurePoint");
featurePoint.setId("featurePointID");
featurePoint.set("title","featurePointTitle");


const featurePoint2 = new Feature({
  geometry: new Point(pointCoords2),
  name: "featurePoint2",
  id:6
});

// featurePoint2.setGeometryName("featurePoint2");
featurePoint2.setId("featurePoint2ID");
featurePoint2.set("title","featurePoint2Title");

const featurePoint3 = new Feature({
  geometry: new Point(pointCoords3),
  name: "featurePoint3",
  id:7
});

// featurePoint3.setGeometryName("featurePoint3");
featurePoint3.setId("featurePoint3ID");
featurePoint3.set("title","featurePoint3Title");

const featurePoint4 = new Feature({
  geometry: new Point(pointCoords4),
  name: "featurePoint4",
  id:8
});

// featurePoint4.setGeometryName("featurePoint4");
featurePoint4.setId("featurePoint4ID");
featurePoint4.set("title","featurePoint4Title");

let features = [featurePoint,featurePoint2,featurePoint3,featurePoint4, featureLine, featurePolygon,featurePolygon2,featurePolygon3];
source.addFeatures([...features]);

//1-Sonradan herhangi bir feature e eklemenenin yollarindan biri bu
//source.addFeature(featureLine2);

//2. Sonradan bir feature eklemenin baska bir yolu da budur
source.addFeatures([featureLine2]);

for(let i = 1; i<=3; i++ ){
  console.log("i: ",i);
  map.on("click",function(event){
    console.log("coordinates_: ",event.coordinate);
  })
}

