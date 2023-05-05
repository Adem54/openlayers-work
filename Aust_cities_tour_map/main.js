import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Text from 'ol/style/Text.js';

let centerCoordinates = [15091875.53, -2890099.029];
const map = new Map({
  target: 'openlayers-map',//html de map imizi icinde tuttugumuz elemntin id si bu olmalidir ve ayni id css de de kullanilyor
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: centerCoordinates,//CENTER AUSTRALIA OLACAK
    zoom: 4,//mapimizin bize ne kadar yakin olacagi ayarlanir
    extend:[9354817.935027812, -9599353.669611076,21526038.822932996,427304.6834888605]//minX,minY,maxX,maxY
    //extend ozelligi ile spesifik koordinatlari belirlenen alani secmek																	
  })
});

//Australian cities GeoJSON

//ol/style/Style
// StyleFunction()
// style/Style.js, line 10
// A function that takes an Feature and a {number} representing the view's resolution. The function should return a Style or an array of them. This way e.g. a vector layer can be styled. If the function returns undefined, the feature will not be rendered.
//parametrede gelen feature australianCitiesLayer icindeki source da var olan  tum feature lari alt alta listeleycektir
const aussieCitiesStyle = function(feature){
  console.log("feature: ",feature);
  console.log("feature-KEYS: ",feature.getKeys());// ['geometry', 'ID', 'Cityname', 'Cityimage']
  //source- data mizda var olan, propertyleri dizi icinde getiriri ayni Object.keys() methodunda ki gibi
  //Simdi biz data mizin icerisine bu properties leri ekledimgiz icin ve VectorLayer observable-baseobject old icin bu properties isimleri uzerinden  o value leri cekebiliyoruz...
  //Mesela ID datalarini almak icin 
  console.log("FEATURE-ID: ", feature.get("ID"));
  let cityID = feature.get("ID");
  let cityIDString = cityID.toString();
  const styles =[
    new Style({
      image: new CircleStyle({
         fill:new Fill({
          color:[77,219,109,0.6]
         }) ,
         stroke:new Stroke({
          color:[6,125,34,1],
          width:2
         }),
         radius:12
      }),
      text:new Text({//Harika bestpractise...biz elimzdeki datalara ait text leri de vektor-layer larimizdaki point, gibi alanlar uzerine datayi style li bir sekilde basarak effektif islemler yapabiliyoruz...
        text:cityIDString,
        scale:1.5,
        fill:new Fill({
          color:[232,26,26,1]
        }),
        stroke:new Stroke({
          color:[232,26,26,1],
          width:0.3
        })
      })
    })
  ]
  return styles;
}


const styleForSelect = function(feature){
  console.log("feature: ",feature);
  console.log("feature-KEYS: ",feature.getKeys());// ['geometry', 'ID', 'Cityname', 'Cityimage']
  //source- data mizda var olan, propertyleri dizi icinde getiriri ayni Object.keys() methodunda ki gibi
  //Simdi biz data mizin icerisine bu properties leri ekledimgiz icin ve VectorLayer observable-baseobject old icin bu properties isimleri uzerinden  o value leri cekebiliyoruz...
  //Mesela ID datalarini almak icin 
  console.log("FEATURE-ID: ", feature.get("ID"));
  let cityID = feature.get("ID");
  let cityIDString = cityID.toString();
  let cityName = feature.get("Cityname");
  const styles =[
    new Style({
      image: new CircleStyle({
         fill:new Fill({
          color:[247,26,10,0.5]
         }) ,
         stroke:new Stroke({
          color:[6,125,34,1],
          width:2
         }),
         radius:12
      }),
      text:new Text({//Harika bestpractise...biz elimzdeki datalara ait text leri de vektor-layer larimizdaki point, gibi alanlar uzerine datayi style li bir sekilde basarak effektif islemler yapabiliyoruz...
        // text:cityIDString,
        text:cityName,//BURASI BIZIM ISMIZE COK YARAYACAK...HARIKA BESTPRACTISE...BIZ TIKLAMA ILE BU SEKILDE STYLE ICINDE FEATURE ICINDEKI DATLAARI EKRANA BASABILIYORUZ..YANI SADECE TIKLANAN FEATURE E AIT DATALARI EKRANA BASABILIRIZ BU SEKILDE...
        scale:1.5,
        fill:new Fill({
          color:[87,9,9,1]
        }),
        stroke:new Stroke({
          color:[87,9,9,1],
          width:0.5
        })
      })
    })
  ]
  return styles;
}



const australianCitiesLayer = new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),//Birda spesifikltestirmemize gerek yok cunku GeoJSON bizm projeksiyonumuza uyuyor zaten
      url:"./data/aust_cities_geojson.geojson"
    }),
    style:aussieCitiesStyle
})

map.addLayer(australianCitiesLayer);

//Map Features Click Logic 
//Oncelikle bizim, right-sidebar a tiklanan city-point e ait city-name ve image i basmak icin index.html de  bu alanlar icin olusturdgumuz html elementlerinin id lerini kullanacagiz
//Ayrica sol-sidebar da icon listesinde tiklanan ciyt-pointe karsilik geleecek olan, circle iconunun green yapmak icinde yine o listenin parent ina ait class ismini kullanacagiz
//Ve de bizim view a erismemiz gerekiyor view ile ilgili ozellikleri de tiklanan city-point e gore eklemek icin

//const navElements = document.querySelectorAll(".column-navigation > a");
//Bu sekilde querySelectorAll ile direk a elemtnlerini isaret edererk cagirirsak bize array gelecektir...ama direk parent class i cagirirsak o zaman da 1 elemanli array donduruyor
const navElements = document.querySelector(".column-navigation");
//navElements uzerinden onun children larina ersimek istersek de navElements.children diyerek erisebiliriz..
console.log("navElements: ",navElements)
const cityNameElement = document.getElementById("Cityname");
const cityImageElement = document.getElementById("Cityimage");

const mapView = map.getView();

//HARIKA BESTPRACTISE...BIZ OZELLIKLE TIKLANAN BIR NOKTAYA AIT ISLEMLER YAPARKEN BUNU COK FAZLA KULLANACAGIZ...ONDAN DOLAYI BURAYI COK IYI ANLAMALIYIZ....HARIKA BESTPRACTISE....TIKLADIGMIZ NOKTAYA AIT FEATURE E ERISEBILIYORYZ BURDA AYNI SELECT INTERACTION DA OLDUGU GIBI
//BIZ FEATURE UZERINDEN FEATURENIN OBSERVABLE OLMASINI KULLNARAK FEATURE ICERISINE DATALARIMIZI SET- FONKSIYONUNU KULLANARAK EKLYEREK SONRA DA GET ILE O DATALARA ERISEREK BU ISLEMLERI COK EFEKTIF BIR SEKILDE OZELLIKLE TIKLANAN ELEMENTLERE AIT DETAYLI DATALARI POPUP SEKLINDE TIKLANAN DATAYA GORE GOSTERMEK ICIN HARIKA BESTPRACTISE LERDIR....
//ASAGIDAKI DATALARA DIKKAT EDELIM...BIZ BU SEKILDE HER BIR FEATURE UMUZE AIT NAME,ID,IMAGE(BURDA IMAGE ILE ILIGLI DE BIZ HER BIR CITY ICIN IMAGE INDIRIYOURZ VE O INDIRILEN IMAGE LERE VERILEN ISIMLERIN AYNISINI FEATURE UNE AIT DATASINDA DA GIRIYORUZ KI IMAGE I EKRANA BASARKEN O IMAGE ISMINI KULLANMAMIZ GEREKIRKEN, HANGI FEATURE E TIKLANIRSA ONUN IMAGE I EKRANA BASILABILMESI ICIN IMAGE ISIMLERINI DE HER BIR FEATURE ICINDE TUTUYORUZ....HARIKA BESTPRACTISE...BU MANTIGINI KESINLIKLE COK IYI KAVRAMALAIYIZ....BU COK ISIMIZE YARAYACAK)
//Ve bu sekilde hangisine tiklanirsa ona ait, olan data yi biz basmak istedigmiz durumlarin bircogunda ayni islemi yapariz aslinmda ne yapariz, feature ile tiklanan elementi  iliskilendirmemiz gerekir bunu da html elementlerinin attribute leri ile feature un, observable-baseobject-setter ve getter fonksiyonmlarindna yararlanarak, her bir html elemntine has attribute value nin aynisini ona karsilik gelen feature ye de atama yapariz once ardindan da tiklanan feature de o degere eriserek , html elemntlerini ayni class altinda foreach ile dondurerek, her bir addEventlistener ile click eventini uygulariz ve ordand a tiklanan html elemtnine eriserek, 

map.on("click",function(event){
  //Biz ayrica tikladigmiz alana ait coordinatlara direk map in click methodu uzerinden de erisebiliriz
  console.log("event.coordinate: ",event.coordinate);//event.coordinate:  (2) [16908019.322055787, -3144481.4591330662]
   map.forEachFeatureAtPixel(event.pixel, function(feature,layer){
        console.log("feature: ",feature.get("ID"));
        console.log("feature: ",feature.get("Cityname"));
        console.log("feature: ",feature.get("Cityimage"));
       // console.log("feature: ",feature);
        let featureName = feature.get("Cityname");
        console.log("featureName: ",featureName)
        
      //let clickedNavElement = document.getElementById(featureName);
        let navElement = navElements.children;
        console.log("navElement: ",navElement);//navElement ine ait tum elemtnleri bu sekilde alabiliyoruz
       // mainLogic(feature,clickedNavElement);
       //1.YONTEM...
       //navElement html collection dir ve direk forEach ile veya array leri itere edebildgimz methdlari kullanarak itere edemiyoruz ondan dolayi once arraye ceviririz....
       //html collection direk, dogrudan itere edilmiyor once array e cevirmek gerekiyor
      /*let iconElement;
       Array.from(navElement).forEach(function(element) {
            console.log("element: ",element.title)
            if(element.title === featureName)iconElement = element;
        });
        console.log("iconElememnt: ",iconElement);
        */
        //2.YONTEM: BU YONTEM ILE COK DAHA KOLAY BIR SEKILDE...VE BURDA NAMEDITEM() METHDODUNA PARAMETRE OLARAK O HTML ELEMENTINE AIT ID GECILMESI GEREKIR...BIZ DE ID LERIMIZI FEATURENAME ILE AYNI ISIMLER VERDGIMIZ ICIN BU SEKIILDE KOLAY BIR YONTEM ILE HTML ELEMNTIMIZE ERISEBILIYORUZ...YANI O HTML ELEMNTIMIZE KARSILIK GELEN ID YE HIC DONGU VS KULLANMADAN ERISEBILIYORUZ..SU MANTIGI ANLAMAMIZ GEREKIR SUREKLI YAPTIMIGZ IS ASLINDA HEP BU....VE BIZ ANCAK BU YONTEM ILE DISARDAN BUTONLAR ARACILIGI ILE OPENLAYERS OZELLIKLERINE VE ORDAK IKI FEATURE LERE MUDAHELE EDECEGIZ BUNU UNUTMAYALIM...VE OPENLAYERS DA FEATURE OBSERVABLE OZELLIIGI UZERINDEN DEGERLERI SET EDEERIZ VE DE INPUT BUTTONLARIMZA DA ATTRIBUTE LER ATARIZ FEATURE LERIMIZDE SET ETTIMGIZ DEGERLER ILE AYNI OLAN VE BU SEKILDE BUTTTONLARIMZ I FEATURE LER ILE ESLESTIREREK BUTONLAR ARACIGLI ILE OPENLAYER DA VECTOR-GEO(POINT-LINE-POLYGON) LARI YONETEBILIRIZ...
        let findNavElement = navElement.namedItem(featureName);
        console.log("findElement: ",findNavElement);
        //Ve artik map uzerinde kullanicinin tikladigi feature ve ona karsilik gelen html a link elementini almis olduk ve fonksiyonumuzun parametresine gonderdik
        mainLogic(feature,findNavElement);//Dikkat edelim...biz pointlerimz uzerinden disardaki, butonlarimiza mudahele ediyoruz...ve tikladigmz point-city ye karsilik gelen icon-btn un class ini degistiriyoruz...ve bu sekilde hangisini tiklarsak, ona ait oloan icon button green yaparak aktif hale getirmis oluyoruz...Bu birkere cepte demekki biz bu ozelligi yapabiliyoruz...COK ONEMLI...NE YAPABILECEGMIZI BILMEK COOK ONEMLIDIR..
   })
})

function mainLogic(feature, clickedAElement){
  //1.si tiklanan elemente KARSILIK GELEN ICON-BUTTON A active class ini atama yapacagiz
  //Reassign active class to the clicked element
  //Once biz 1 tane active class i olan bir a elementi olusturmustuk en ustte ve icon olarak da home iconunu vermistik
  //Biz class lar arasinda replace islemi yapabiliyourz dinamik bir sekilde
  let currentActiveStyledElement = document.querySelector(".active");
  //currentActiveStyledElement.classList.remove("active");
  currentActiveStyledElement.className = currentActiveStyledElement.className.replace("active","");
//Ve burda birseye dikkat edelim, bu harika bir dinamik islem oldu burda cunku biz her seferinde tikladigmz elemente active class ini veriyoruz ama oncesinde hangi element active class ini almis ise ondan da active class in i kaldiriyoruz ve active class i verilen elementi de querySelector uzerinden active class ini yazarak buluyoruz.... BURAYA DIKKAT EDELI.....BESTPRACTISE...BUNU BIR BASKA YONTEM ILE DE FOREACH ILE TEK TEK TUM ELEMNTLERI DONUP HER BIRISI ICERSINDEN ACTIVE CLASS I NI ONCESINDE TEMIZLEYIP ARDINDAN DA HANGISI TIKLANDI ISE SADECE ONA ACTIVE CLASS I VERILSIN GIBI DE DUSUNEBILIRDIK AMA YAPTIMGIZ YONTEM DE HARIKA BIR DINAMIK BESTPRACTISE OLMUS...

  //Bir kez tiklaninca active class ini verdigmiz home-iconlu en ustteki a link elementinden kaldiriyoruz yukardaki replace islemi ile ve o active class ini clickedAElementine atayacagiz...
  clickedAElement.className = "active";
  /*
  BU SEKILDE DE DINAMIIK BIR SEKILDE ACTIVE ELEMENTINI TIKLADIGMIZ A LINK ELEMENTINDE YER DEGISTIREBILIRDIK....
  AMA HER SEFERINDE ACTIVE ELEMENTI HANGI A LINK HTML ELEMENTINDE ISE ONDAN KALDIRMAMIZ GEREKIYOR...BUNU BILELIM...BESTPRACTISE....
  let currentActiveStyledElement = document.querySelector(".active");
  currentActiveStyledElement.classList.remove("active");
  clickedAElement.classList.add("active");
  */
 //Change the view based on the feature
 //We can get the coordinates of the clicked point.
 //console.log("Get-coordinates: ",feature.getGeometry().getCoordinates())
 //let featureCoordinates = feature.getGeometry().getCoordinates();
 //Simdi, bizim view imiza animasyonlu bir sekilde center ve zoom level i degistirebilme imkanina sahibiz...HARIKA BESTRPACTISE...BU BIZE COOK LAZIM OLACAK....
 //mapView.animate({center:featureCoordinates}, {zoom:5});
 //Bu animate methodu bizim degistirgimiz view ozellikleri arasinda smooth-transition yani yavas bir gecis ozelligi saglayacaktir
 //import View from 'ol/View.js'; view kaynagina gidersek orda animate(var_args) bu sekilde bir methodun oldugunu methodlarin altinda gorebiliriz ve daha ekstra neler kullanabiliriz onu da gorebiiriz demekki biz view uzerinden harikka animate methodu kullanarak animasyon islemleri yaparak harika isler cikarabiliriiz.....HARIKA BESTPRACTISE....
 //Burda view altinda extend ozelligi kullanilarak, biz haritamizin belirledimgz 4 nokta arasini gostermesini de sagliyorduk, bu extend ozelligini biraz daha genisleterek mapView.animate fonksiyonunun daha da belirginlesmesini saglayabiliriz
 //feature.setStyle(styleForSelect);
 //Burda biz hangisine tiklarsak o featuru styleForSelect ile stilini degistirecek, ama dikkat edelim...her tikladgimz artik bu style i alacak burda bir yanlislik var biz her seferinde hangisnie tiklar isek tikladgimiz andaki point bu style i alsin ve tekrar yeni tikladgimiz yine bu style i almasini istiyoruz bu sekilde her bir tiklanan feature de styleForSelect stili kalacaktir...bunu istemiyoruz 
 //BU COZUME DIKKAT EDELIM....BU SEKILDE COZECEGIZ....
 //Bunu asmak icin once tum features lari normal style i ile stillendiririz hemen ardindan tiklanan featuru styleForSelect stili ile stillendiririz..
 //ISTE SADECE TIKLANAN FEATURE FARKLI BIR STYLE ALMASI ICIN ONCE, TUM FEATURE LERI ESKI STYLE ILE TEKRAR STILLENDIRIP SONRA YINE TIKLANAN FEATURE UN SADECE STYLEFORSELECT STILINI ALMASINI SAGLARIZ
//  let allFeatures = australianCitiesLayer.getSource().getFeatures();
//  allFeatures.forEach(feat=>{
//   feat.setStyle(aussieCitiesStyle);
//  })
//feature.setStyle(styleForSelect);

 //Son olarak da sunu istiyoruz..hangi point-city ye tiklarsak ona ait image i sag-sidebarda gormek istiyoruz...

 //BURASI ONEMLIDIR...
 //Biz eger a elementlerinin hepsine karsilik gelen bir feature miz olur ise sorun yasamayiz ama ornegin home a html elemnti gibi feature karsiligi olmayan bir isi icin yapar ve feature undefined gelir ise o zaman islem patlar...ondan dolayi da bir onlem almamiz gerekir...
 if(clickedAElement.id === "Home"){
  //animate initial ozellikleri verioruz center ve zoom olarak yani baslarken map imizde ne var ise onu veriyourz
    mapView.animate({center:centerCoordinates},{zoom:4});//Burda da view da kullandigmiz center degerlerini verecegiz
    cityNameElement.innerHTML = "Welcome to Australian Capital Cities Tour Map";
    cityImageElement.setAttribute("src","./data/City_images/Austrailan_flag.jpg")
    
 }else{
  console.log("Get-coordinates: ",feature.getGeometry().getCoordinates())
  let featureCoordinates = feature.getGeometry().getCoordinates();
  //Simdi, bizim view imiza animasyonlu bir sekilde center ve zoom level i degistirebilme imkanina sahibiz...HARIKA BESTRPACTISE...BU BIZE COOK LAZIM OLACAK....
  mapView.animate({center:featureCoordinates}, {zoom:5});

  feature.setStyle(styleForSelect);
  let allFeatures = australianCitiesLayer.getSource().getFeatures();
  allFeatures.forEach(feat=>{
   feat.setStyle(aussieCitiesStyle);
  })

  console.log("cityNameElement.id: ",cityNameElement.id)
 let featureName = feature.get("Cityname");
 console.log("featureName:::featureName:: ",featureName);
 let featureImage =feature.get("Cityimage");

 cityNameElement.innerHTML = `Welcome to the ${featureName} `;
 cityImageElement.setAttribute("src",`./data/City_images/${featureImage}.jpg`); 
 }
 //cityNameElement
 //ASAGIDAKI OZELLIKLER HARIKA OZELLIKLER....BU OZELLIKLERI MUTLAKA....IYI SINDIRIP ANLAYALIM CUNKU TAM DA BUNA BENZER OZELLIKLERE COK IHTIYACIMIZ OLACAK......
//  console.log("cityNameElement.id: ",cityNameElement.id)
//  let featureName = feature.get("Cityname");
//  console.log("featureName:::featureName:: ",featureName);
//  let featureImage =feature.get("Cityimage");//feature image bize deger olarak bizim data/City_images altindaki her sehre ait image jpg ler ile ayni ismi vermistik...ve bu sayede de hangi feature e tiklar isek ona ait resme de bu sekilde eriserek o tiklanan city ye ait resmin  ve de tiklanan sehrin name inin de sag sidebarda dinamik olarak gelmesini saglamis olacagiz....
 //cityNameElement.innerHTML = feature.get(`${cityNameElement.id}`);
 //cityNameElement.innerHTML = `Welcome to the ${featureName} `;
 //cityImageElement
 //cityImageElement.src =`./data/City_images/${feature.get(`${cityImageElement.id}`)}.jpg`; 
 //cityImageElement.src =`./data/City_images/${featureImage}.jpg`; 
 //cityImageElement.setAttribute("src",`./data/City_images/${featureImage}.jpg`); 
 //feature.get(`${cityImageElement.id}`) + ".jpg";
 //Burasi da yine  harika bir bestpractise...burayi da dogru anlayalim...Burayi da dogru anlamamiz cook onemlidir...

}

/*
Feature Click Logic Part-1

1-Oncelikle biz herhangi bir feature ye tikladigmz zaman yani point e tikladimgiz zaman sunu istiyoruz tikladigmiz point in oldugu konuma zoom yapilsin ve tiklanan yer center olarak alinsin...
Bunu yapmak icin ise once View imzin center degerlerini ve zoom-level degerini tiklanan feature un datasina gore degistirmeliyiz...
Ve bu islemler dinamik ve hareketli olacagi icin bu islemleri animasyonlu bir sekilde yapacagiz
2-2.olarak da tikladigmiz point-city nin ismini ve o city ye ait image i biz, right-sidebar da gostermek istiyoruz
3-3.olarak da tikladigmiz point-city nin rengi de farkli olacak, hem map uzerindeki ismi farkli olacak hem de sol sidebarda tikadigmiz city yi temsil eden circle iconu green renginde olacak(Bu mantik iki yonlu olacak yani hem sol-sidebardaki hangi icona tiklanirsa ona karsilik gelen map uzerindenki point-city highlighted olacak ve sag sidebar da o city ye ait name ve image i gorecegiz ayni sekilde kullanici eger direk, map uzerindeki point-city noktasindan herhangi birine tiklnirsa da bu sefer de sol-sidebar daki icon green olacak ve sag sidebarrda tiklanan city name ve image i gormek istiyoruz)
Burda dikkat edilmesi gereken bir nokta sudur
Biz bir fonksiyon olusturacagiz ve bu fonksiyon a parametre olarak feature ve navigation elemnti verecegiz yani birbirlerine karsilik gelen peki biz, nasil feature mize karsilk gelen, a elementini buluruz tabi ki feature mize biz, a html elemnterimize onlara karsiklik gelen feature ler e biz html elemntlerinin id lerini name olarak verdigmiz icin bizim elimzde feature var ise biz o feature e ait a html elemntine kolay ca erisebiliyoruz bu sekilde....HARIKA BESTPRACTISE...MANTIK....
BIZ BU ORNEKLERI KENDIMIZE GORE KULLANABILIRZ SADECE BURDA SUNU ANLAYALIM...FEATURE ICERISINE DATAYI GEOJSON.IO DA YENI DATALAR EKLEYEREK ONU BIR DOSYA OLARAK INDIIRP SONRA DA SOURCE DA URL OLARAK O DOSYA ADRESINI GOSTERIP O DATALARI MAP UZERINDE GOREBILMEYI SAGLIYORUZ KI BUNLARIN BENZER MANTIKTA MANUEL OLARAK YAPABILIYORUZ ASLINDA ISTE BUNLARI TEST EDEREK ALABILECEGIZ...BIZ BU MANTIGI KENDI UYGULAMALARIMIZDA COK HARIKA BIR SEKILDE KULLANABILIRIZ

Feature Click Logic Part-2
2.olarak da biz herhangi bir point-city ye tikladigmz zaman tikladigmiz noktayi highlighted olmasini istiyoruz yani tiklanan noktaya  ozel bir style verecegiz...._Bize mevcut kullandigmz style dan daha farkli bir style lazim ondan dolayi mevcut style i biz kopyalayip bazi degerlerini degistirip tikladmgiz noktalarin daha farkli style e sahip olmalarini saglayacagiz...

*/

//Navigation Button Logic

//const navElements = document.querySelector(".column-navigation");
//Bu elemnt tum a elemntlerinin parenti olan div class in donduruyor yani bu itere edilecek bir array degil bu HTML collection tipinde bir data bunu dondurmek icin bizim Array.from ile array a dondurmemiz gerekir
//Direk a elemntlerinin icine atacak bir array olusmasini istiyorsak.. o zaman asagidaki gibi yapariz
//Bu bestpractisi inde degerini bilelim...direk css secisi ile javascriptte istedigmz elemntlere kolayca erismemizi sagliyor...
const aNavElements = document.querySelectorAll(".column-navigation > a");
for(let aNavElmnt of aNavElements){
   
  aNavElmnt.addEventListener("click",function(event){
      console.log("aNavelementCURRENTARGET: ",event.currentTarget);//<a title="Adelaide" id="Adelaide" >  <i class="fa-regular fa-circle" id="Adelaide"></i> </a>
      console.log("aNavelementTARGET: ",event.target);// <i class="fa-regular fa-circle" id="Adelaide"></i>
      //BESTPRACTISE....EVENT.CURRENTTARGET HER ZAMAN EN USTTEKI PARENTI VERIRKEN,EVENT.TARGET ISE EN ALTTAKI ELEMENTI VERIYOR... 
      //SIMDI BIZ IM BURDA AMACIMIZ BU SEFERDE SOL-SIDEBARDAKI BUTONLARIMZ UZERINDEN BIZ HEM BU BUTONLARIN TIKLANANI ACTIVE CLASS I VERECEGIZ AMA SADECE TIKLANANA HEM DE TIKLNANA CITY YE KARSIKLIK GELEN CITY HEM MAP DE FARKLI BIR STYLE VERCEGIZ HEM DE SAG SIDEBAR DA O CITY YE AIT BILGILIER GELECEK YANI BIZ DISARDAN BUTTONUMUZ UZERINDEN FEATURE LARA DA DINAMIK OLARAK ISLEM YAPACAGIZ AYNEN FEATURE LARA TIKLANINCA DISARDAKI BUTONLARIMZDA DINAMIK ISLEMLER YAPTIMGIZ GIBI....ISTE PUF NOKTA VE KRITIK NOKTA BUDUR...DOLAYIIS ILE ASLINDA YUKARDA KULLANDIGMIZ FONKSIYONUN AYNISINI BURDA DA KULLANACAGIZ VE BIZE SADECE IKI SEY LAZIM...1.SI BIZE TIKLANAN A ELEMENTI LAZIM ONA ERISIYOURZ 2.SI DEE TIKLANAN A ELEMNTININ CITY SINE KARSILIK GELEN FEATURE-POINT LAZIM BUNA ERSIMEMIZ GEREKIYOR...KI MAINLOGIC FONKSIYONUNU BURDA DA INVOKE EDEBILELIM...
      let clickedAnchorElement = event.currentTarget;
     
      let clickedAnchorElementID = clickedAnchorElement.id;
      //BU MANTIGI COK FAZLA KULLANACAGIZ NE YAPIYORUZ BIZ ONCE TIKLANAN ELEMENTE ERISIYORUZ SONRA DA TIKLANAN HTML ELEMNTIMIZ E AIT VERDIGMIZ ATTRIBUTE DEGERLERINI BIZ ONLARA KARSILIK GELEN FEATURE LERE DE OBSERVABLE OZELLGIINDEN YARARLANARAK ATMAA YAPARAK IKISI ARASINDA HARIKA BIR BAGLANTI KURABILMIS OLUYORUZ VE BU SAYEDE DE GEREK, MAP UZERINDDE VECTOR-POINT UZERINDEN DISARDAKI BUTONUMUZA, GEREKSE DISARDAKI BUTON UZERINEN ONA KARSILIK GELEN VECTOR-POINT STYLE DA DINAMIK HARIKA ISLEMLER GERCEKLESTIREBILIYORUZ...ISTE ANA MANTIK BUDUR
      let aussieCitiesFeatures = australianCitiesLayer.getSource().getFeatures();
      aussieCitiesFeatures.forEach(feature=>{
          console.log("featuureName:  ",feature.get("Cityname"));
          let featureCityname =feature.get("Cityname");
          if(clickedAnchorElementID === featureCityname ){
              mainLogic(feature,clickedAnchorElement);
          }
      })
    //Home navigation case
      if(clickedAnchorElementID === "Home"){
          mainLogic(undefined,clickedAnchorElement);
      }
      
  })
}