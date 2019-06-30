
'use strict';

var convexHull = require('monotone-convex-hull-2d');
var pointInPolygon = require('point-in-polygon');
var fs = require("fs");


var coordsfile ="./" + (process.argv[2]);	
console.log(coordsfile);

if(coordsfile){

	var points = require(coordsfile);

		var result =drawConvexHull(points);
		let data ='';
		for(let k=0;k<result.length;k++){
			data += "["+result[k]+"],";
		}
		data = data.substring(0,data.length-1);	

		data = "["+data+"]";
		let file = coordsfile.replace('coords','convex');
		
		fs.writeFile(file, data, (err) => {
			if (err) console.log(err);
			else
				console.log("Successfully Written to File.");
		});

}



	function drawConvexHull(points) {
    var left = points[0];
    var top = points[0];
    var right = points[0];
    var bottom = points[0];

    // find the leftmost, rightmost, topmost and bottommost points
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < left[0]) left = p;
        if (p[0] > right[0]) right = p;
        if (p[1] < top[1]) top = p;
        if (p[1] > bottom[1]) bottom = p;
    }

    // filter out points that are inside the resulting quadrilateral
    var cull = [left, top, right, bottom];
    var filtered = cull.slice();
    for (i = 0; i < points.length; i++) {
        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
    }

    // get convex hull around the filtered points
    var indices = convexHull(filtered);

    // return the hull as array of points (rather than indices)
    var hull = [];
    for (i = 0; i < indices.length; i++) hull.push(filtered[indices[i]]);
    return hull;
}
