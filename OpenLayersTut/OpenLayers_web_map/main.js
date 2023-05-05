
//BURASI COK ONEMLI BIZIM HERZAMAN ONCE HTML DOSYAMIZIN YUKENMESI ONDAN SONRA JSCRIPT DOSYAMIZ OLAN MAIN.JS IN CALISMASI GEREKIR ONU GARANTI ALTINA ALMAK ICINDE WINDOW.ONLOAD ILE INIT FONKSIYONUNUN HTML DOSYASI  YUKLENDIKTEN SONRA CALISMASINI SAGLIYORUZ.. 
// window.onload=init
//Bu fonksiyon window tamamen load edildiginde yani window icindeki html tamaen load edildiginde calismasini saglayacak ondan dolayi da biz  window.onload i kullanuyioruz
function init(){
    const map=new ol.Map({
        view:new ol.View({
            center:[0,0],//x ve y koordinatlaridir bunlar
            zoom:3,
            maxZoom:6,
            minZoom:2,
           // rotation:0.5
        }),
        layers:[
          new ol.layer.Tile({
            source:new ol.source.OSM()//Open street map
          }) 
        ],
        target:"js-map",//div containerimizdan geleck olan id dir 
        //Bizim map objemiz index.html deki div i container olarak kullanacak
        keyboardEventTarget:document
    });
   const popupContainerElement=document.getElementById("popup-coordinates");
    //simdi overlay i olusturalim
    //new ol.Overlay({ }) icerisine html element tanimlayacagiz..property element olacak
    const popup=new ol.Overlay({
      element:document.getElementById("popup-coordinates"),
   
    })
    //Biz su anda overlay i olusturduk ama bu overlay i mapimize eklemedik
    map.addOverlay(popup);//map imize olusturdugmuz overlayimizi de eklemis olduk
    //Biz overlayi olusturup map imize de ekledik ama bizim bu overlay icerisinde bu popup i gosterecegimz bir container imiz yok henuz
    //Bizim tiklanan noktaninn coordinatlari gostermemiz lazim di popup icerisinde
    //Bunun icin once tiklanan noktanin koordinatlarini bulmamiz gerekiyor...onun icinde click-eventini tanimlarsak ordan erisebiliriz....
    //Herhangi bir noktaya tiklandiginda click eventinin callback fonksiyonu parametresine gelen e uzerinden biz tiklanan noktanin koordinatlarini alabiliyoruz
    console.log("map: ",map);
    const element=popup.getElement();
    console.log("element: ",element);
    map.on('click',function(e){
      //   console.log(e.coordinate); 
      //Her tiklamada koordinat alabiliyoruz bu ornegin asagida polygon cizerken adam 5 gen olusuturdugunda da her bir tiklamada tiklanan yerine koordinatini alacaktir bu biz bu tiklandigi zaman koordinat almayi polygon gibi islemlerde kullanmayiz cunku polygon gibi cizimler yaparken Draw constructor func uzerinden drawend eventini tetikleyerek en son tum coordinatlari birlikte aliriz
         /*oo {type: 'click', target: Ya, map: Ya, frameState: {…}, originalEvent: {…}, …},  coordinate: Array(2)0: 1223579.551040472 1: 8391034.021345163 */
         const clickedCoordinate=e.coordinate;
         //Koordinatlari aldik simdi de popup izmda bir pozisyon ayarlayabiliriz
         popup.setPosition(undefined);//once var olan popup var ise onu kaldiriyoruz bu sekilde
         popup.setPosition(clickedCoordinate);//Simdi bir onceki popup pozisyonunu kaldirip tiklanan koordinatlari da popup pozisyonun atadiiktan sonra
         //p etiketiinin contain-icerigini degstirelim simdi
         popupContainerElement.innerHTML=clickedCoordinate;
        // element.innerHTML="Hello Openlayers"
    })

    const dragRotateInteraction=new ol.interaction.DragRotate({
      condition:ol.events.condition.altKeyOnly
    })
    //Ve biz bu sekilde bir interaction olusturduk ve bizim map imize bunu eklememiz gerkeiyor
    map.addInteraction(dragRotateInteraction);

    //import Draw from 'ol/interaction/Draw';
//import GeoJSON from 'ol/format/GeoJSON';
    const drawInteraction=new ol.interaction.Draw({
      type:"Polygon",
      freehand:false,
    })

    map.addInteraction(drawInteraction);

    drawInteraction.on("drawend", function(e){
      console.log("Drawing finished:  ",e);
      let parser=new ol.format.GeoJSON();
      let drawnedFeatures=parser.writeFeaturesObject([e.feature]);
      console.log("drawnedFeatureAfterFinish: ",drawnedFeatures);
    })
  
}

init();
/*
OpenLayers icerisidne bircok farkli tipte Layers lar mevcuttur
Biz burd TileLayer i kullanacagiz
map objesi olusturan fonksiyonumuzu invoke eetmemiz gerekiyor
*/

/*
IMPORT ILE VE OPENLAYERS7 ILE YAPACAK OLURSAK
COOK ONEMLI
Yukrda biz OpenLayers.6 ile manuel bir sekilde dahil ettik herseyi 
ve biz vite.js development ile degil tmamen kendimiz yaptik manuel oalrak ondan dolayi..Burda style.css i biz import ile yapamayiz dogrudan html sayfasina dahil edecegiz
AYRICA DIKKAT ETMEMIZ GEREKEN COK ONEMLI BIR NOKTA BIZ OPENLAYERS DAKI HTML DOSYAMIZI KESINLIKLE LIVESERVER VEYE HERHANGI BIR SERVER DA ACMALIYIZ TUM OZELLIKLERI DOGRU ALABILMEK ICIN KI DAHA DA ILERLEDIKCE YENI OZELLILKLER ILE BIRLIKTE AJAX KULLANIMI VS DE GELECEK VE EGER LIVESERVER DA DEGIL DE DOGRUDAN CALISTIRMAYA CALISIRSAK TUM OZELLIKLERI ALAMAYIZ...BUNA COK DIKKAT EDELIM...BU COK ONEMLI....
*/
