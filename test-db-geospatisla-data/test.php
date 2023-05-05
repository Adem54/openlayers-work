<?php 


$host = "localhost";
$username = "root";
$password = "admin1499";
$dbname = "test_geo_db";


//Yukarıda belirtilen veritabanına bağlan. Her iki halde veritabanı olacak. Ya önceden vardı ya da yeni oluşturuldu.



try {
	$db=new PDO("mysql:host=localhost;dbname=test_geo_db","root",""); 
	echo "Succesffull connection";
	} catch (PDOException $e) {//PDO nun Exception sinifida var, eger baglnti da hata olusursa kullnalim, hatayi yakalayip bize mantikli bir mesaj donmesi icin
	 echo  $e->getMessage();
	 //Eger olmayan bir database e baglanmaya calisirsak 
	 //SQLSTATE[HY000] [1049] Unknown database 'testdb2' boyle bir hata aliiriz
	}
	

	$sSql = "INSERT INTO map_layers (provider_id,name,note,shape_names,shape_types,shape,active) VALUES (:provider_id,:name,:note,:shape_names,:shape_types,ST_GeomFromText(:shape,4326),:active)";


//ST_GeomFromText('GEOMETRYCOLLECTION()')
$stmt = $db->prepare($sSql);
$stmt->execute( [
	':provider_id' => 1,
	':name' => "Rode1111",
	':note' => "Rode1 noteeeee",
	':shape_names' => "shape1,shape2,shape3",
	':shape_types' => "shapetype1,shapetype2,shapetype3",
	':shape' =>"GEOMETRYCOLLECTION(POINT(9.619726077029418 59.167713481609155),LINESTRING(9.61940421194763 59.168494304588364,9.616528883883666 59.16826335880333,9.613245860049439 59.16890120527205),POLYGON((9.61332096190186 59.168048907749295,9.613835946032719 59.16761450277525,9.612580672213749 59.16760350510933,9.610134497592167 59.16822486768751,9.61332096190186 59.168048907749295)))",
	':active' => "T"
]);




/*
"INSERT INTO 'map_layers' (provider_id,name,note,shape_names,shape_types,shape,active) VALUES (:provider_id,:name,:note,:shape_names,:shape_types,ST_GeomFromText(:shape,4326),:active)"
*/
var_dump($stmt);

?>