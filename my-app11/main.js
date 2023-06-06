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
  console.log("geometryType: ",geometryType);
  console.log("getKeys(): ",feature.getKeys());
  console.log("getKeys(): ",feature.get('name'));//Bu sekilde atanmis olan name lere erisilebilir...
  let name = feature.get('name');

  //Text styles
  let featureID = feature.get("id");
  featureID = featureID.toString();
  console.log("featureIDD: ",featureID);
  console.log("getKeys(): ",feature.getKeys());
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
    console.log("Polygon-feature: ",feature);
    console.log("Polygon-name: ",name);//featurePolygon2,featurePolygon3
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
  //style:mySpecificStyleByFeature ,//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
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

let pointInteraction;
pointInteraction=new Draw({
  type:"Point",
  source:source,
 }) 

// map.addInteraction(pointInteraction);

 pointInteraction.on("drawend",function(event){
  console.log("point-feature_ ",event.feature);
  event.feature.set("id","new-point");
  //map.removeInteraction(pointInteraction);
 })



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
console.log(featurePolygon.getGeometryName());
console.log(featurePolygon.getId());
//Bir featuremize id(setId),name(setGeometryName),style(setStyle) atamalari yapabiliyoruz...
//AYRICA DA ISTEDIGIMIZ HERHANGI BIR KEYWORD VE VALUE SINI ATAMA YAPIP DAHA SONRA DA O KEYWORE ERISEBILIYORUZ...
featurePolygon.set("title","featurePolygonTitle");
featurePolygon.set("color","blue");
featurePolygon.set("style","blue");
console.log(featurePolygon.get("color"));//blue
console.log(featurePolygon.get("style"));//blue
console.log(featurePolygon.get("title"));
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

map.on("click",function(event){
  console.log("coordinates_: ",event.coordinate);
})




/*
BUNLARDA INCELENMELI....
var aObjects = JSON.parse(sJsonRet);
			var aIconFeatureList = [];

			for (let i = 0; i < aObjects.length; i++) {
				let lon = aObjects[i]['lon'];
				let lat = aObjects[i]['lat'];

				let oIconFeature = new ol.Feature({
					name: 'cabin',
					type: 'icon',
					geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]))
				});
				let iconStyle = new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0, 35],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						opacity: 0.9,
						scale: 0.5,
						rotation: 0,
						src: (aObjects[i]['validcont'] === 'T') ? "img/cottage_green.svg" :
							"img/cottage_red.svg"
					}),
					zIndex: 1
				});

				oIconFeature.setStyle(iconStyle);
				aIconFeatureList.push(oIconFeature);

*/

//HAREKETLI BIR ARACI SIMULE ETMEK...

let roteSource = new VectorSource();
let roteLineLayer = new VectorLayer({
  source: roteSource,
  title :'roteLineLayer',
 
});

map.addLayer(roteLineLayer);
let lineInteraction;
lineInteraction=new Draw({
  type:"LineString",
  source:roteSource,
  freehand:true,
 
 }) 

map.addInteraction(lineInteraction);

let storedData = [] ;

let livePosVectorLayer ;
var livePosSource;

let livePos = [ 0,0];

var livePosFeature = new Feature({
  geometry: new Point(livePos),

});

livePosSource = new VectorSource();
//if(livePosSource.getFeatures().length > 0)livePosSource.clear(); 
if(livePosSource.getFeatures().length == 0)livePosSource.addFeature(livePosFeature);


livePosVectorLayer = new VectorLayer({
  source: livePosSource,
  title :'livePosVector',
  style:pointStyle
});


//if(livePosSource.getFeatures().length == 0)map.addLayer(livePosVectorLayer);
map.addLayer(livePosVectorLayer);

lineInteraction.on("drawend",function(event){
  if(roteSource?.getFeatures().length > 0)roteSource.clear();

//  if(livePosSource?.getFeatures().length > 0)livePosSource.clear();
  console.log("Line-coordinates ",event.feature.getGeometry().getCoordinates());
  


  if(localStorage.getItem("coordinates")){
    localStorage.removeItem("coordinates");
  }
    localStorage.setItem("coordinates",JSON.stringify(event.feature.getGeometry().getCoordinates()))
  


storedData  = localStorage.getItem('coordinates');
console.log("storedDAta: ",JSON.parse(storedData))
// storedData = JSON.parse(storedData) ?? [];
storedData = JSON.parse(storedData) ? JSON.parse(storedData) : [];

let sendDataEvery5Sec = setInterval(sendPosition, 100);
  

let count = 0;
function sendPosition(){
  console.log("storedDataaa: ",storedData)
  livePos = storedData[count] ?? [];
  console.log("livePos: ",livePos)
  livePosFeature.getGeometry().setCoordinates(livePos);
  count++
  if(count == storedData.length)clearInterval(sendDataEvery5Sec);
}

// clearInterval(sendDataEvery5Sec);




  console.log("COORD-LOCALSTORAGE: ",localStorage.getItem("coordinates"))
  let coordinates = event.feature.getGeometry().getCoordinates();
  let firstCoordinate;
  firstCoordinate = event.feature.getGeometry().getFirstCoordinate();
  console.log("firstCoordinate: ",firstCoordinate);
  let lastCoordinate;
  lastCoordinate = event.feature.getGeometry().getLastCoordinate();
  console.log("lastCoordinate: ",lastCoordinate);
  let getLength = event.feature.getGeometry().getLength();
  console.log("getLength: ", getLength);

  event.feature.set("id","new-point");

  map.getAllLayers().forEach(layer=>{
    console.log("layer: ",layer);
   
  })
  //map.removeInteraction(lineInteraction);
 })


    var myCoord = [
      [
          1955548.4763025586,
          6074562.815386482
      ],
      [
          1955548.4763025586,
          6074562.815386482
      ],
      [
          1962886.4310179357,
          6072116.830481356
      ],
      [
          1962886.4310179357,
          6069670.84557623
      ],
      [
          1965332.4159230613,
          6069670.84557623
      ],
      [
          1970224.3857333125,
          6067224.860671105
      ],
      [
          1972670.370638438,
          6067224.860671105
      ],
      [
          1975116.3555435636,
          6067224.860671105
      ],
      [
          1977562.3404486892,
          6067224.860671105
      ],
      [
          1982454.3102589408,
          6064778.875765979
      ],
      [
          1984900.2951640664,
          6062332.890860854
      ],
      [
          1987346.280069192,
          6062332.890860854
      ],
      [
          1989792.2649743175,
          6062332.890860854
      ],
      [
          1992238.249879443,
          6062332.890860854
      ],
      [
          1994684.2347845687,
          6059886.905955728
      ],
      [
          1997130.2196896947,
          6059886.905955728
      ],
      [
          1999576.2045948203,
          6059886.905955728
      ],
      [
          2004468.1744050714,
          6059886.905955728
      ],
      [
          2006914.159310197,
          6059886.905955728
      ],
      [
          2009360.1442153226,
          6059886.905955728
      ],
      [
          2011806.1291204481,
          6059886.905955728
      ],
      [
          2014252.1140255742,
          6059886.905955728
      ],
      [
          2016698.0989306998,
          6059886.905955728
      ],
      [
          2019144.0838358253,
          6059886.905955728
      ],
      [
          2021590.068740951,
          6059886.905955728
      ],
      [
          2024036.0536460765,
          6059886.905955728
      ],
      [
          2026482.038551202,
          6059886.905955728
      ],
      [
          2028928.0234563276,
          6059886.905955728
      ],
      [
          2031374.0083614537,
          6059886.905955728
      ],
      [
          2033819.9932665792,
          6059886.905955728
      ],
      [
          2036265.9781717048,
          6059886.905955728
      ],
      [
          2038711.9630768304,
          6059886.905955728
      ],
      [
          2041157.947981956,
          6059886.905955728
      ],
      [
          2043603.9328870815,
          6059886.905955728
      ],
      [
          2046049.917792207,
          6059886.905955728
      ],
      [
          2048495.9026973331,
          6059886.905955728
      ],
      [
          2050941.8876024587,
          6059886.905955728
      ],
      [
          2053387.8725075843,
          6059886.905955728
      ],
      [
          2055833.8574127099,
          6059886.905955728
      ],
      [
          2058279.8423178354,
          6059886.905955728
      ],
      [
          2060725.827222961,
          6059886.905955728
      ],
      [
          2065617.7970332126,
          6059886.905955728
      ],
      [
          2068063.7819383382,
          6059886.905955728
      ],
      [
          2070509.7668434638,
          6059886.905955728
      ],
      [
          2072955.7517485893,
          6059886.905955728
      ],
      [
          2075401.736653715,
          6059886.905955728
      ],
      [
          2077847.7215588405,
          6059886.905955728
      ],
      [
          2080293.7064639665,
          6059886.905955728
      ],
      [
          2082739.691369092,
          6059886.905955728
      ],
      [
          2085185.6762742177,
          6059886.905955728
      ],
      [
          2087631.6611793432,
          6059886.905955728
      ],
      [
          2090077.6460844688,
          6062332.890860854
      ],
      [
          2092523.6309895944,
          6062332.890860854
      ],
      [
          2094969.61589472,
          6064778.875765979
      ],
      [
          2099861.5857049716,
          6064778.875765979
      ],
      [
          2099861.5857049716,
          6067224.860671105
      ],
      [
          2099861.5857049716,
          6069670.84557623
      ],
      [
          2102307.570610097,
          6072116.830481356
      ],
      [
          2102307.570610097,
          6077008.800291607
      ],
      [
          2104753.5555152227,
          6077008.800291607
      ],
      [
          2104753.5555152227,
          6079454.785196734
      ],
      [
          2104753.5555152227,
          6084346.755006985
      ],
      [
          2107199.5404203483,
          6084346.755006985
      ],
      [
          2107199.5404203483,
          6086792.73991211
      ],
      [
          2107199.5404203483,
          6091684.7097223615
      ],
      [
          2107199.5404203483,
          6094130.694627487
      ],
      [
          2107199.5404203483,
          6096576.679532613
      ],
      [
          2109645.525325474,
          6099022.664437738
      ],
      [
          2109645.525325474,
          6101468.649342864
      ],
      [
          2109645.525325474,
          6103914.634247989
      ],
      [
          2109645.525325474,
          6106360.619153115
      ],
      [
          2109645.525325474,
          6108806.6040582415
      ],
      [
          2112091.5102305994,
          6108806.6040582415
      ],
      [
          2112091.5102305994,
          6111252.588963367
      ],
      [
          2112091.5102305994,
          6113698.573868493
      ],
      [
          2114537.4951357255,
          6116144.558773618
      ],
      [
          2116983.480040851,
          6116144.558773618
      ],
      [
          2119429.4649459766,
          6116144.558773618
      ],
      [
          2121875.449851102,
          6116144.558773618
      ],
      [
          2126767.4196613533,
          6121036.528583869
      ],
      [
          2129213.404566479,
          6121036.528583869
      ],
      [
          2131659.389471605,
          6121036.528583869
      ],
      [
          2134105.3743767305,
          6121036.528583869
      ],
      [
          2136551.359281856,
          6121036.528583869
      ],
      [
          2138997.3441869817,
          6121036.528583869
      ],
      [
          2141443.3290921072,
          6121036.528583869
      ],
      [
          2143889.313997233,
          6121036.528583869
      ],
      [
          2146335.2989023584,
          6121036.528583869
      ],
      [
          2148781.2838074844,
          6121036.528583869
      ],
      [
          2151227.26871261,
          6121036.528583869
      ],
      [
          2153673.2536177356,
          6121036.528583869
      ],
      [
          2156119.238522861,
          6121036.528583869
      ],
      [
          2158565.2234279867,
          6121036.528583869
      ],
      [
          2161011.2083331123,
          6121036.528583869
      ],
      [
          2163457.193238238,
          6121036.528583869
      ],
      [
          2165903.178143364,
          6121036.528583869
      ],
      [
          2168349.1630484895,
          6121036.528583869
      ],
      [
          2170795.147953615,
          6121036.528583869
      ],
      [
          2173241.1328587406,
          6121036.528583869
      ],
      [
          2175687.117763866,
          6121036.528583869
      ],
      [
          2180579.0875741174,
          6118590.543678744
      ],
      [
          2183025.0724792434,
          6116144.558773618
      ],
      [
          2185471.057384369,
          6113698.573868493
      ],
      [
          2187917.0422894945,
          6113698.573868493
      ],
      [
          2190363.02719462,
          6113698.573868493
      ],
      [
          2192809.0120997457,
          6113698.573868493
      ],
      [
          2195254.9970048713,
          6113698.573868493
      ],
      [
          2197700.981909997,
          6113698.573868493
      ],
      [
          2200146.966815123,
          6113698.573868493
      ],
      [
          2202592.9517202484,
          6113698.573868493
      ],
      [
          2205038.936625374,
          6113698.573868493
      ],
      [
          2207484.9215304996,
          6113698.573868493
      ],
      [
          2209930.906435625,
          6113698.573868493
      ],
      [
          2212376.8913407507,
          6113698.573868493
      ],
      [
          2214822.8762458763,
          6116144.558773618
      ],
      [
          2217268.8611510023,
          6116144.558773618
      ],
      [
          2219714.846056128,
          6118590.543678744
      ],
      [
          2219714.846056128,
          6121036.528583869
      ],
      [
          2222160.8309612535,
          6125928.4983941205
      ],
      [
          2224606.815866379,
          6125928.4983941205
      ],
      [
          2224606.815866379,
          6130820.468204372
      ],
      [
          2227052.8007715046,
          6130820.468204372
      ],
      [
          2227052.8007715046,
          6133266.453109497
      ],
      [
          2227052.8007715046,
          6135712.438014623
      ],
      [
          2227052.8007715046,
          6138158.422919748
      ],
      [
          2231944.770581756,
          6140604.407824874
      ],
      [
          2231944.770581756,
          6145496.377635126
      ],
      [
          2231944.770581756,
          6147942.362540252
      ],
      [
          2231944.770581756,
          6150388.347445377
      ],
      [
          2234390.755486882,
          6150388.347445377
      ],
      [
          2234390.755486882,
          6152834.332350503
      ],
      [
          2236836.7403920074,
          6152834.332350503
      ],
      [
          2239282.725297133,
          6152834.332350503
      ],
      [
          2241728.7102022585,
          6152834.332350503
      ],
      [
          2244174.695107384,
          6157726.302160754
      ],
      [
          2249066.6649176353,
          6157726.302160754
      ],
      [
          2251512.6498227613,
          6157726.302160754
      ],
      [
          2256404.6196330125,
          6160172.287065879
      ],
      [
          2258850.604538138,
          6160172.287065879
      ],
      [
          2261296.5894432636,
          6160172.287065879
      ],
      [
          2263742.574348389,
          6160172.287065879
      ],
      [
          2266188.5592535147,
          6160172.287065879
      ],
      [
          2268634.544158641,
          6160172.287065879
      ],
      [
          2275972.4988740175,
          6160172.287065879
      ],
      [
          2278418.483779143,
          6160172.287065879
      ],
      [
          2283310.453589394,
          6165064.256876131
      ],
      [
          2285756.4384945203,
          6165064.256876131
      ],
      [
          2288202.423399646,
          6167510.241781256
      ],
      [
          2290648.4083047714,
          6167510.241781256
      ],
      [
          2293094.393209897,
          6167510.241781256
      ],
      [
          2295540.3781150226,
          6167510.241781256
      ],
      [
          2300432.3479252737,
          6167510.241781256
      ],
      [
          2302878.3328303997,
          6169956.226686382
      ],
      [
          2307770.302640651,
          6169956.226686382
      ],
      [
          2312662.272450902,
          6172402.211591507
      ],
      [
          2317554.242261153,
          6174848.196496633
      ],
      [
          2320000.227166279,
          6174848.196496633
      ],
      [
          2322446.212071405,
          6174848.196496633
      ],
      [
          2324892.1969765304,
          6174848.196496633
      ],
      [
          2327338.181881656,
          6174848.196496633
      ],
      [
          2332230.151691907,
          6174848.196496633
      ],
      [
          2332230.151691907,
          6177294.181401759
      ],
      [
          2334676.1365970327,
          6177294.181401759
      ],
      [
          2337122.1215021587,
          6177294.181401759
      ],
      [
          2342014.09131241,
          6177294.181401759
      ],
      [
          2346906.061122661,
          6177294.181401759
      ],
      [
          2349352.0460277866,
          6177294.181401759
      ],
      [
          2349352.0460277866,
          6179740.166306885
      ],
      [
          2354244.015838038,
          6182186.1512120105
      ],
      [
          2356690.0007431637,
          6184632.136117136
      ],
      [
          2361581.970553415,
          6184632.136117136
      ],
      [
          2364027.9554585405,
          6187078.121022262
      ],
      [
          2366473.940363666,
          6189524.105927387
      ],
      [
          2371365.9101739177,
          6189524.105927387
      ],
      [
          2371365.9101739177,
          6191970.090832513
      ],
      [
          2376257.879984169,
          6191970.090832513
      ],
      [
          2381149.84979442,
          6191970.090832513
      ],
      [
          2386041.819604671,
          6191970.090832513
      ],
      [
          2395825.759225174,
          6191970.090832513
      ],
      [
          2405609.6988456766,
          6191970.090832513
      ],
      [
          2412947.6535610533,
          6191970.090832513
      ],
      [
          2420285.60827643,
          6191970.090832513
      ],
      [
          2425177.5780866817,
          6191970.090832513
      ],
      [
          2434961.517707184,
          6191970.090832513
      ],
      [
          2442299.472422561,
          6191970.090832513
      ],
      [
          2444745.4573276867,
          6189524.105927387
      ],
      [
          2452083.4120430634,
          6187078.121022262
      ],
      [
          2454529.396948189,
          6187078.121022262
      ],
      [
          2456975.381853315,
          6184632.136117136
      ],
      [
          2459421.3667584406,
          6184632.136117136
      ],
      [
          2461867.351663566,
          6182186.1512120105
      ],
      [
          2464313.336568692,
          6179740.166306885
      ],
      [
          2466759.3214738173,
          6179740.166306885
      ],
      [
          2469205.306378943,
          6177294.181401759
      ],
      [
          2471651.2912840685,
          6174848.196496633
      ],
      [
          2474097.2761891945,
          6174848.196496633
      ],
      [
          2476543.26109432,
          6172402.211591507
      ],
      [
          2481435.2309045712,
          6169956.226686382
      ],
      [
          2483881.215809697,
          6167510.241781256
      ],
      [
          2486327.2007148224,
          6162618.271971005
      ],
      [
          2488773.185619948,
          6162618.271971005
      ],
      [
          2493665.1554301996,
          6157726.302160754
      ],
      [
          2496111.140335325,
          6157726.302160754
      ],
      [
          2501003.1101455763,
          6155280.317255628
      ],
      [
          2505895.0799558274,
          6152834.332350503
      ],
      [
          2508341.0648609535,
          6152834.332350503
      ],
      [
          2513233.0346712046,
          6152834.332350503
      ],
      [
          2518125.004481456,
          6147942.362540252
      ],
      [
          2523016.974291707,
          6145496.377635126
      ],
      [
          2525462.959196833,
          6145496.377635126
      ],
      [
          2527908.9441019585,
          6145496.377635126
      ],
      [
          2532800.9139122097,
          6143050.3927299995
      ],
      [
          2535246.8988173353,
          6140604.407824874
      ],
      [
          2542584.8535327124,
          6138158.422919748
      ],
      [
          2545030.838437838,
          6135712.438014623
      ],
      [
          2547476.8233429636,
          6133266.453109497
      ],
      [
          2549922.808248089,
          6130820.468204372
      ],
      [
          2552368.7931532147,
          6130820.468204372
      ],
      [
          2554814.7780583403,
          6128374.483299246
      ],
      [
          2559706.747868592,
          6125928.4983941205
      ],
      [
          2562152.7327737175,
          6123482.513488995
      ],
      [
          2564598.717678843,
          6123482.513488995
      ]
  ]