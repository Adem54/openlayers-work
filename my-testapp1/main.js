import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";



let minX=[-482448.8844272373, 6948537.808663547];
let minY=[1243954.0938784746, 5418990.528870807];
let maxX=[2855125.4802697455, 6736944.794138221];
let maxY= [1067306.316037831, 7855455.623686972];


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [1598434.680154215, 6473258.354921961],
    zoom: 6,
    extend:[minX,minY,maxX,maxY]
  })
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


let iCircleOpacity = .8;//added
		  
		let pointCircleFillStyle = new Fill(
		{
			color:[201, 184, 30, iCircleOpacity],
		});

		let pointCircleStrokeStyle = new Stroke(
		{
			color:[201, 184, 30, iCircleOpacity],
			width:2
		});
	
		let defaultPosCircleStyle = new Style
		({
			image: new CircleStyle(
			{
				//fill:this.aMovedObjPosList ? pointCircleFillStyle : null,
				fill: pointCircleFillStyle,
				//radius:radius2,
				radius:38,
				//stroke:this.aMovedObjPosList ? pointCircleStrokeStyle : null,
				stroke: pointCircleStrokeStyle ,
			}) ,
			
		})

const source = new VectorSource();
const vector = new VectorLayer({
   source: source,
  title :'MyVectorLayer',
  //style:pointStyle
  //style:mySpecificStyleByFeature ,//Biz bir degiskeni fonksiyon olarak kullandigmiz zaman, style tum feature leri o kullandigmz fonksiyonun parametresine geciyor..
 //style,
  
});


let pointCoords = [1598434.680154215, 6473258.354921961];
let pointCoords2 =[1525055.1330004458, 6185855.128569698];
let pointCoords3 =[443929.80493491306, 5957155.539940451];
let pointCoords4 = [744785.9482653667, 6952671.396326587];


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

let features = [featurePoint,featurePoint2,featurePoint3,featurePoint4];
source.addFeatures([...features]);



source.getFeatures().forEach((feature)=>feature.setStyle([defaultPosCircleStyle, pointStyle  ]));


map.addLayer(vector);


// map.on("click",function(event){
//   console.log("coordinates_: ",event.coordinate);
//   map.forEachFeatureAtPixel(event.pixel, function(feature,layer){
//     let featureName = feature.get("name");
//     console.log("featureName: ",featureName);
//   })
  
// })


// Custom hit detection logic
map.on('click', function (event) {
  map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
    // Check if the click was on the center point style
    const pixel = map.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
    const distance = Math.sqrt(
      Math.pow(event.pixel[0] - pixel[0], 2) + Math.pow(event.pixel[1] - pixel[1], 2)
    );

    if (distance <= 7) { // Adjust this value to match your point radius
      let featureName = feature.get('name');
      console.log('featureName: ', featureName);
    }
  });
});