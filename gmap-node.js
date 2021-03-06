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

var queryForAll = '/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'



function getLayer(url, next){
	// console.log(arguments);
	// console.log('getting', url);
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


function handleTerminals(next, layers, err, json){
	// console.log(arguments, Object.keys(arguments).length);
	// 	console.log(layers);
		var createImages = [];
		if(json.features)
			var simplified = simplify(json, 0.0001);
			simplified.features.forEach(function(feature){
				var terminal = feature.properties.TermnialName,
					Terminal_ID = feature.properties.Terminal_ID,
					geom = feature.geometry;
					// console.log(terminal)
				// if(terminal==='TraPac Terminal'){
					var center = gju.centroid(geom).coordinates.reverse();
					// var center = gju.rectangleCentroid(geom);
					console.log(center);
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
					    	// 'fillcolor': 'yellow',
					    	'weight': '4',
					    	'points':coords
					    }
					]
					for(var name in layers){
						var layer = layers[name]
						if(layer.Terminal_ID === Terminal_ID){
							// console.log(layer.name, 'matched', Object.keys(layer));
							paths.push(layer.path);
						}
					}
					// console.log(coords.length, paths.length);
					createImages.push(
						function(){
							getBuildings(
								gju.boundingBoxAroundPolyCoords(geom.coordinates).join(','),
							 	function(buildings){
							 		// console.log('buildings', buildings)
							 		layers.buildings = buildings;
							 		paths.push(buildings.paths)
							 		paths.reverse();
							 		createImage(
							 		// .bind(
								 	// 	this,
								 	// 'Oakland, CA', 15, '600x400', false, false, 'satellite'));//, markers, styles, paths 
								 		gm.staticMap( center, 16, '2400x1600', 2/*scale*/, false, false, 'satellite', false/*markers*/, false/*styles*/, paths), 
								 		'c:/temp/'+terminal.replace('/', ' - ').replace('\\', ' - ')+'.jpg',
								 		function(){
								 			if(createImages.length>0)
								 				createImages.shift()();
								 			else 
								 				console.log('done');
								 		} 
								 	)
							 	}
							 )
						}
					 );
				// }
			})
		if(next)
			next(createImages)
	}

function cyclethrough(){
	for(var arg in arguments){
		if(arguments[arg] instanceof Array)
			arguments[arg].shift()()
	}
}

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){console.log(arguments, 'complete'); if(callback)callback()});
  });
};


function createImage(url, filename, next){
	console.log('image url:', url, 'output', filename);//, markers, styles, paths))
	download(url, filename, next);

}


function processBerths(next, err, json){
	var berths = {};
	var simplified = simplify(json, 0.0001);
	simplified.features.forEach(function(feature){
		var Terminal_ID = feature.properties.Terminal_ID,
			name = feature.properties.Berth
			geom = feature.geometry;
		var coords = [];
		geom.coordinates.forEach(function(coord){
			coord.forEach(function(a){
			    a.reverse();
			    coords.push(a.join(','));
			})
		});
		var path = { 
		    	'color': 'blue', 
		    	'weight': '2',
		    	'points':coords
		    };
		 berths[name] = {
		 	name: name,
		 	Terminal_ID : Terminal_ID,
		 	path : path
		 }
	})
	return next(berths);
}

function processBuldingss(next, err, json){
	var buildings = {}, markers = [];
	var simplified = simplify(json, 0.001);
	simplified.features.forEach(function(feature){
		var geom = feature.geometry;
		var coords = [];
		geom.coordinates.forEach(function(coord){
			coord.forEach(function(a){
			    a.reverse();
			    coords.push(a.join(','));
			})
		});
		var paths = { 
		    	'color': '0x151515ff',
		    	'weight': '1',
		    	'fillcolor' : '0x545454ff',
		    	'points':coords
		    };
		  buildings.paths = paths;
		markers.push(
		    	{ 'location': gju.centroid(geom) }
		    )
	})
	buildings.markers = markers;
	return next(buildings);
}

function getGates(){
	var url = 'http://jls-gispweb1.portoakland.internal/arcgis/rest/services/Essentials/Base_fences/MapServer/1' + queryForAll;
		esri2geo(esriJson, processBuldingss.bind(this, next));
	} )
}

function getBuildings(bounds, next){
	// console.log(next, arguments);
	var url = 'http://jls-gispweb1.portoakland.internal/arcgis/rest/services/Essentials/Base_structures/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry='+ bounds +'&geometryType='+ 'esriGeometryEnvelope' +'&inSR='+ 4326 +'&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'
	getLayer(url, function process(esriJson){
		esri2geo(esriJson, processBuldingss.bind(this, next));
	} )
}

function getBerths(layers){
	var url = 'http://jls-gispweb1.portoakland.internal/arcgis/rest/services/Essentials/Base_boundaries/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'
	getLayer(url, function process(esriJson){
		esri2geo(esriJson, processBerths.bind(this, getTerminals));
	} )
}

function getTerminals(layers){
	var url = 'http://jls-gispweb1.portoakland.internal/arcgis/rest/services/Essentials/Base_boundaries/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson'
	getLayer(url, function process(esriJson){
		esri2geo(esriJson, handleTerminals.bind(this, cyclethrough, layers)) 
	} )
}

// getBerths();
