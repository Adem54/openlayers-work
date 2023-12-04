
const cacheName = "tile-cache";


 self.addEventListener('fetch', (event) => {
	event.respondWith(
		 caches.open(cacheName).then((cache) => {
			  return cache.match(event.request).then((response) => {
				  //Eger gonderilen request ile cacheimiz match oluyorsa yani gonderilen request in respons u eger cache de var ise , o zaman sen respons u cache den al da kullan, request gonderme onun yerine...
					if (response) {
						 return response;
					} else {
					  //Eger sen gonderdigin request e ait response cache de bulunmaz ise o zaman normal fetch ile request gonderip response u al
					  //request gonderidginde ise gelen response u tekrar cache e yaz ki, ayni request gonderilmesi gerektitrginde onu bir dahakine cache den getirelim
						 return fetch(event.request.clone()).then((response) => {
							  cache.put(event.request, response.clone())
							  return response;
						 })
					}
			  })
		 }).catch((err) => {
			  console.log('error', err)
		 })
	)
})


 // Listen for install event
self.addEventListener('install', function(event) {
	event.waitUntil(
	  caches.open('tile-cache').then(function(cache) {
		 return cache.addAll([
			'index.html',
			'main.js',
			'style.css'
			// Add more URLs as needed
		 ]);
	  }).catch((err)=>{
		console.log("error: ",)
	  })
	);
 });
 



 /*
 
Certainly! To extract the zoom level from a tile URL, you'll typically find a pattern in the
 URL that indicates the zoom level. For example, a common structure might be /{z}/ in the URL template.
  Here's an example implementation using JavaScript's regular expressions:
  Let's assume your tile URLs follow the pattern "https://.../{z}/{x}/{y}...", where {z} represents the zoom level.
  This function uses a regular expression (/\/(\d+)\/\d+\/\d+/) to find a pattern where a number is present after the first slash (/{z}/) in the URL.
The match variable holds the result of matching the URL against the regex pattern.
If a match is found and it contains at least one captured group (denoted by (\d+)), it extracts that number as the zoom level.
The extracted zoom level is then returned as an integer.
You might need to adjust the regular expression pattern based on the exact structure of your tile URLs. Test this function with your specific URLs to ensure it accurately captures the zoom level.
 
 */

console.log("HELLO")