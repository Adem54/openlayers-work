import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import DragRotate from 'ol/interaction/DragRotate.js';
import Draw from 'ol/interaction/Draw.js';
import { altKeyOnly } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON.js';
import Overlay from 'ol/Overlay.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Select from 'ol/interaction/Select.js';
import {singleClick} from "ol/events/condition";
import {fromLonLat} from 'ol/proj';
import {toLonLat} from 'ol/proj';
import {transformExtent} from 'ol/proj';

//[1165424.6321820915, 8435557.642169733] Skin-Kjørbekhøyda nun koordinatlari kendi map imizde tiklyarak aldik bu koordinatlari
// console.log(toLonLat([1070947.2438999824, 8218582.921817104],"EPSG:3857"))
//Bu bize [9.620482776810311, 59.17626721530215] bu degerleri veriyor yani bizim asagidak i view icinde center da kullandimigz googlemaps tan aldigmiz longtitude latitude degerlerinin aynisi yani biz kendi projeksiyonumuzdan x,y koordinatlarini googlemaps in projeksiyon koordinat referans sitemi olan longtitude ve latitute cevirmis olduk
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
   // center: [0, 0],
    center:fromLonLat([9.623351845722578,59.17848197148105],'EPSG:3857'), //Skien kjørbekhøyda nin longtitude ve latitude degerleri
    // center:fromLonLat([-103.35467849944357,57.570726559071396],'EPSG:3857'), 
    //Burasi norvecten bir alan di 
    //57.570726559071396, -103.35467849944357  canada
    zoom: 2,
    //lontitude,latitude degerlerini googlemapsten aliyoruz
    //import * as olExtent from 'ol/extent'; transformExtend icindeki parametreden 1.parametre extendi kullanirken optionslarimiz var
    //transformFn	TransformFunction Transform function. Called with [minX, minY, maxX, maxY] extent coordinates.	
//daha once aldimgiz kjørbekhøyda noktasinin sol,sag,ust ve alt tan noktalarini alacagiz ama googlemapsten alirken 2.deger longtitude onu unutmaylaim yani ordaki 2.degeri longtitude yi biz burda 1.sirada kullaniyoruz bucok onemlidir
//Googlemapsten aliyoruz
//minX:6.501162347614355      59.24644781168259, 6.501162347614355 kjørbekhøyda en soldan norvecin en bati tarafindan bir nokta aliyoruz kjørbekhøydanin sol tarafinda
//maxX:11.423037   59.240830, 11.423037  
//maxY:59.673967048973864    59.673967048973864, 9.645436012385009
//minY:58.930251,      58.930251, 9.756260
//transformExtent(extent, source, destination, stops){Extent}
//source:Google Maps in kullandigi projeksiyon olan EPSG:4326 olacak, 
//destination- bu da bizim mapimizde kullandgmiz projeksiyondur "EPSG:3857"
extent:transformExtent([6.5,58.930251,11.423037,59.67],"EPSG:4326","EPSG:3857"),
//Bunu kullandimgiz zaman hangi koordinatlara gore projeksiyonu extend isek o alanlar arasina gore gosteriyor yani haritayi acinca direk bu 4 nokta arasini gosteriyor
  }),
});



//Once bizim datayi almamiz lazm datayi nerden alacagiz, yani biz tamam VectorLayer kullanacagiz ama icerisinde kullanacagimz VectorImageLayer da biz source objesi icinde url den datayi cekecegimiz bir ulr gerekiyor sounc ta vector image icinde gostercegiz vector ler birer datadir..ve bir kaynaktan alinmasi gerekir...Biz datayi Geojson.io
//Geojson.io burasi kendi vektolerimizi cizebildigmiz,
//Burda geliriz ve 5 tane ulkenin baskentlerine draw point araci ile point koyariz ve o ulkelerin sinirlarini draw line tool ile cizeriz ve cizerken ki her bir noktanin koordinatlarini sag sidebar dag gorebiliriz ayrica point koydgumuz yerlerinde koordinatlerini gorebiliriz...ve sol ustte save menu elemntine tiklarsak o rda da bu datalari farkli datatype lerinda kaydedebilecegimzi de gorebilriz biz bunlari GeoJson olarak kaydetmeyi seceriz, ve map.geojson dosyasini indirilenler altnda gorebiliriz ve o dosyayi alip my-app map imizde data klasoru altinda vector_data klasoru olusturup onun altina tasiriz ve ismini de Central_EU_countries_GEOJSON

//Vector Layers
//Central EU Countries GeoJSON Vector Layer

// const EUContriesGeoJSON =new VectorLayer({
//   source:new VectorSource({
//     url:"./data/vector_data/Central_EU_countries_GEOJSON.geojson",//url bize datamizi verecek, cekecek ya bu sekilde bir data kaynagindan indirilen bir geojson data kaynagi ya da direk url uzaktan datayi fetch ededebilir
//     format:new GeoJSON(),
    
//   }),
//   visible:true,
// })
// map.addLayer(EUContriesGeoJSON);

//Biz burda VectorLayer i kullanarak avrupa baskentlerinin datasini geosjon.io da cizip o datayi aldik ve kendi map imizde kullandik ama birde VectorImage e bakacagiz VectorImageLayer ve VectorLayer nerde ise birbrinin aynisidir ama, VectorImageLayer in biraz daha hizli oldugu idda ediliyor
//ol/layer/VectorImage~VectorImageLayer
//options lar arasinda source kullanaagiz-ol/source/Vector~VectorSource-import VectorSource from 'ol/source/Vector.js';





const dragRotation=new DragRotate({
        condition:altKeyOnly,					
});
 map.addInteraction(dragRotation);

 const drawInteraction=new Draw({
  type:"Polygon",
  //freehand:false,
 // freehand:true,//Bu sekilde cizgi olarak degil mouse a tiklayarak artik istedigi gibi cizebilir...cizgi olarak degil illaki
 })
 map.addInteraction(drawInteraction);
 //DRAW INTERACTION I BITTIGINDE, KOORDINATLARA ERISMEK
 drawInteraction.on("drawend",function(e){
  console.log("coordinates:::",e.feature.getGeometry().getCoordinates())
  //GeoJSON formatinda koordinatlara erismek
  let parser=new GeoJSON();
  let drawnedFeatures=parser.writeFeaturesObject([e.feature]);
  //Icerisinde features listsi var ve 1.siradaki feature bizim aradgmiz, isimizi gorecek olan bizim fetaruemizdir
  console.log("drawnedFeatureAfterFinish: ",drawnedFeatures.features[0].geometry.coordinates);
 })

 //DRAW INTERACTION IMIZ BASLADIGINDA METHOT TETIKLENMESI ve ILK TIKLANAN NOKTANIN KOORDINATLARININ ALINMASI
//  drawInteraction.on("drawstart",function(e){
//   console.log("test: ",e.feature.getGeometry().getCoordinates());
//  })

 //DRAW ILE POLYGON-LINESTRING-POINT VE DIGER TUM.. CIZIMLERDE-INTERACTIONLARDA HER BIR TIKLAMADA O TIKLADIMGZ NOKTANIN, KOORDINATLARA ERISMEK

 map.on("click",function(e){
  //  console.log("map-click: ",e.coordinate);
 })


 const popupContainerElement=document.getElementById("popup-coordinates");		    
 //simdi overlay i olusturalim
 const popup=new Overlay({
  element:popupContainerElement,
  positioning:"center-right",
 })
     //Biz su anda overlay i olusturduk ama bu overlay i mapimize eklemedik
 map.addOverlay(popup);
// console.log("getElement; ",popup.getElement());//html kisminda hangi element icine yaziliyorsa o elementi alabilyoruz

//Biz map uzerinde bir noktanin uzerine tiklayinc o nokta ile ilgili detayli bilgileri map in click event handling i icerisinde yapacagiz
map.on("click",function(event){
  //zaten coordinatlari map click evntinden direk event.coordinate diye cok kolay aliyoruz
//  console.log("coordinate-map-click: ",event.coordinate);
  const clickedCoordinate=event.coordinate;
  popup.setPosition(undefined);
  popup.setPosition(clickedCoordinate);
  popupContainerElement.innerHTML=clickedCoordinate;
})


//1-pop up alanini gostercegmiz html elementinin referansini aliriz once...
  const overlayContainerElement=document.querySelector(".overlay-container");			
//2-Sonra overlayimizi olustururuz

const overlayLayer=new Overlay({
  element:overlayContainerElement,
})
//3-overlayerimizi mapimze ekleriz
map.addOverlay(overlayLayer);

// //Detayli bilgilieri gosterecegmiz ana container elementin nested veya child elementlerinin de referanslarini alalim
//   const overlayFeatureName=document.getElementById("feature-name");
//   const overlayFeatureAdditionalInfo=document.getElementById("feature-additional-info");

// //Simdide map eventhandlingi olan click eventi ile listeni yapalim dinleyelim....ki her tiklamada datalara erismemiz icin
// map.on("click",function(event){
//   console.log("HELLLLLLOOOOOOOO")
//           //COK ONEMLI---BESTPRACTISE									
//           overlayLayer.setPosition(undefined);
//       //BURAYI ANLAMAMIZ GEREKIYOR      
//   //Bu pozisyon disindaki alanlara tikaldimizda data gosterilmemesini saglayacak									
//         //Once pozisyonu undefined  yapacak, ardindan eger feature var ise pozisyon verilecek ve overlayed ile gosterilecek		
//         //Simdi bunu anlamaiz gerek, biz sonradan ekledmiiz bir geoJSON vektor data source sini map imiz icinde ki layers lar icinde ekledimgz vektorlayer in sourcesinde kullandik ve bunu biz haritamiz uzerinde diger layer lar ile birlikte de alabiliyoruz...ancak, biz her tikladigmiz yerde gidip feature icinde bizimi sadece belli alanlarini cizzdigmiz vektor layer sourcesinde var olan datalar icin o datalari alabiliriz yoksa bizim vektor toollari point,polygon,line ile cizip de aldigmiz datalar haric tikladigmiz nokta larda datalar olmayinca tiklayinca datayi bulamaz ve undefined gosterir....				
//         //MAP UZERINDE TIKLADIMGIZ NOKTADA BIZ CLICK, YAPINCA GELEN CALLBACK PARAMETRESI EVENT UZERINDEN SADECE KOORDINATLARA ERISIYORUZ, MAPIMIZ ICERISINDE KULLANDIGMIZ VEKTORLAYER A AIT FEATURESLERE ERISMEK ICINDE YINE MAP ALTINDA KULLANABILECEGMIZ METHODLAR VAR ONLARDAN BIRNI KULLANCAGIZ KI BIZ MAP ICINDE LAYER ALTINDA KKULLANDIGMZ VEKTOR LAEYRIMZ IN SOURCESINDE BULUNAN FEATURES LARA ERISEBILLIM VE O DATALARI MAP UZERINDE POPUP OLARAK GOSTEREBILELIM
//         map.forEachFeatureAtPixel(event.pixel,function(feature,layer){
//             console.log("map-overlay-additionalinfo")
//               console.log(feature.getKeys());
//               console.log(feature.getGeometry().getCoordinates());
//               let clickedFeatureAdditionalInfo=feature.get("additional info");
//               let clickedCoordinate=event.coordinate;
//              if(clickedFeatureName && clickedFeatureAdditionalInfo !=  undefined){
//                 overlayLayer.setPosition(clickedCoordinate);//BURASI COK ONEMLI....BESTPRACTISE..BURAYI VERMEZSEK O ZAMAN POZISYONU BULAMAZ...NERDE CALISACAGINI BULAMAZ..
//                 overlayFeatureName.innerHTML=clickedFeatureName;
//                 overlayFeatureAdditionalInfo.innerHTML=clickedFeatureAdditionalInfo;
//                }
//         })			
// })
//BESTPRACTISE...BIZ HICBIRZAMAN, BU SEKILDE GELEN FEATURES OBJESINI YAZIDRIP DA ICINDEKI PROPERTIES LER UZERINDEN DATALARI ALMAYA VE DEGISTIRMEYE CALISMAMALIYIZ..BU DOGRU BIR YONTEM DEGIL..ZATEN HATALAR DA ALIRIZ..BIZ OPENLAYERS DOKUMANTASYONUNDA BIZE HANGI METHODLAR, OPTIONSLAR VE EVENTHANDLING LER VERILDI ISE ONLARIN UZERINDEN YURUMELIYIZ.....

/*
Burdan da sunu anlamaliyiz demekki biz bircok islemi map options,map method ve map event handlingleri uzerinden yapabilecegiz...

*/

const selectInteraction=new Select({
  condition:singleClick,
})


//VEKTOR LAYER FEATURES UZERINDEN INTERACTIONS ISLEMI YAPMAK-(OVERLAY-POPUP IN DAHA ILERI SEVIYESI...)
/*
OLAYIN MANTIGINI BIR KERE ANLAYALIM....NE NERDEN GELIYOR...BELLI DATALARI ALABILMEK ICIN NELER YAPMALIYZ....
1-Oncelikle biz, overlay ile popup yapmistik ve ne gostermistik tabi ki koordinatlari gostermistik neden cunku bizim kullanidimgz map icindeki layer imiz olan openstreetmap den biz features da sadece koordinat datalari var ve onlari alabilyoruz daha detayli data alabilmeiz icin 2 sey onemli 1 ya bunlar veritabanindan gelecek biz bir noktaya tiklayinca...bu da geoserver-postgre nin devreye girmesi de gerekebiliyor
Ya da vektor layer olustururken, source ye data cekiliyor bildigmz gibi, bu data kimi zaman bir url uzerinden gelir kimi zaman da kullandigmz bir vektor layer websitesinden direk kendi ihtiyacmiz olan ornegin alanlari olustururuz o web-harita daki toollar ile ve o tikladimiz, veya nokta koydgumuz noktlara ek, bilgiler yukleriz, ki bu feature icerisine eklenecektir, feature icindeki geometry icine eklenecektir ve biz bu olusturdugmuz parcayi kaydedip dosya olarak indiririz ve map projemiz altinda bir klasor altina yerlestiririz ve de new VectorLayer eklerken onu source de cagirirsak o zaman, biz artik o cagirimz vektor layer ile, kendi hazirladimgz belli bolgeler nokta , polygon,lineString,point koydugmuz yerleri openstreet map imiz uzerinde gorebilecegiz ve features altinda geometry ile beraber ek datalar da alabilecegiz....
2.Ve birde bu detayli datayi alabilmek icin logic yazmaliyz

const map = new Map({
  target: 'map',
layers: [
    new TileLayer({
      source: new OSM()
    })
  ] ,
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
});
*/