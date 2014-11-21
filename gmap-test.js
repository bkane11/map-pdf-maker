var gm = require('googlemaps'),
	esri2geo = require('esri2geo'),
	util = require('util'),
	http = require('http'),
	phantom = require('phantom'),
	fs = require('fs'),
	request = require('request'),
	simplify = require('simplify-geojson'),
	gju = require('geojson-utils');

gm.config({'encode-polylines': true});

var url = 'http://jls-gispweb1.portoakland.internal/arcgis/rest/services/Essentials/Base_boundaries/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'

function getLayer(url, next){
	console.log('getting', url);
	http.get(url, function(res) {
	    var body = '';
	    res.on('data', function(chunk) {
	        body += chunk;
	    });
	    res.on('end', function() {
	        var json = JSON.parse(body)
	        if(next)
	        	next(json)
	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});
}

function handleEsriJSON(next, esrijson){
	// console.log(json, arguments)
	var geoJSON,
		cb=function(err, data){
			geoJSON=data;
			var createImages = [];
			if(geoJSON.features)
				// var simplified = simplify(geoJSON, 0.001);
				// simplified.features.forEach(function(feature){
				geoJSON.features.forEach(function(feature){
					var terminal = feature.properties.TermnialName,
						geom = feature.geometry;
					console.log(terminal)
					// if(terminal==='TraPac Terminal'){
						var center = gju.rectangleCentroid(geom);
						var coords = [];
						geom.coordinates.forEach(function(coord){
							coord.forEach(function(a){
							    a.reverse();
							    coords.push(a.join(','));
							})
						});
						var paths = [
						    { 
						    	'color': 'red', 
						    	// 'color': '0x0000ff', 
						    	'weight': '4',
						    	'points':coords
						    }
						]
						// console.log(coords.length, coords, center);
						createImages.push(
						 	createImage.bind(this, 
						 		gm.staticMap(center, 15, '600x400', false, false, 'satellite', false/*markers*/, false/*styles*/, paths), 
						 		'c:/temp/'+terminal.replace('/', ' - ').replace('\\', ' - ')+'.jpg',
						 		function(){
						 			if(createImages.length>0)
						 				createImages.shift()();
						 			else 
						 				console.log('done');
						 		} 
						 	) 
						 );
					// }
				})
			if(next)
				next(createImages)
		};
	esri2geo(esrijson,cb);
}

function log(){
	for(var arg in arguments){
		// console.log( arguments[arg] );
		if(arguments[arg] instanceof Array)
			// while(arguments[arg].length>0){
				// function(){
					arguments[arg].shift()()
				// }
				// var func = arguments[arg].shift()

				// console.log(func(), arguments.length);
			// }
	}
}

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){console.log(arguments, 'complete'); if(callback)callback()});
  });
};


function createImage(url, filename, next){
	console.log('image url:', url, 'output', filename);//, markers, styles, paths))
	download(url, filename, next);
	// phantom.create(function(ph){
	// 	ph.createPage(function(page) {
	// 	    page.set("paperSize", { format: "A4", orientation: 'landscape', margin: '1cm' });
	// 	    page.open(url, function(status) {
	// 	        page.render("c:/temp/dwr-lep.pdf", function(){
	// 	            console.log("page rendered");
	// 	            ph.exit();
	// 	        })
	// 	    })
	// 	})
	// })
}

getLayer(url, handleEsriJSON.bind(this, log))
// createImage(gm.staticMap('Oakland, CA', 15, '600x400', false, false, 'satellite'), 'c:/temp/gmap.jpg')


// gm.reverseGeocode('41.850033,-87.6500523', function(err, data){
//   util.puts(JSON.stringify(data));
// });

// gm.reverseGeocode(gm.checkAndConvertPoint([41.850033, -87.6500523]), function(err, data){
//   util.puts(JSON.stringify(data));
// });

// markers = [
//     { 'location': '246 4th St Davis, CA' },
//     { 'location': '1333 Broadway Oakland, CA',
//         'color': 'red',
//         'label': 'A',
//         'shadow': 'true',
//         'icon' : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
//     }
// ]

// styles = [
//     { 'feature': 'road', 'element': 'all', 'rules': 
//         { 'hue': '0x00ff00' }
//     }
// ]

// paths = [
//     { 'color': '0x0000ff', 'weight': '5', 'points': 
//         [ '41.139817,-77.454439', '41.138621,-77.451596' ]
//     }
// ]

// util.puts(gm.staticMap('Oakland, CA', 15, '600x400', false, false, 'satellite'));//, markers, styles, paths));
