var http = require('http');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.v2 = function(req, res){
  res.render('index2');
};

exports.datalatest = function(req, res){
  http.get('http://marsweather.ingenology.com/v1/latest/', function (got) {
var b = new Buffer(0);
			res.writeHead(200, {'Content-Type': got.headers['content-type'] || 'application/json'});
			got.on('data', function(d) {
				b += d;
			});
			got.on('end', function() {
				console.log('response ends');
				var str = b.toString();
				var data = JSON.parse(str).report;
				res.end(JSON.stringify(data,false));
			})
  });
};

exports.dataarchive = function(req, res){
  http.get('http://marsweather.ingenology.com/v1/archive/', function (got) {
var b = new Buffer(0);
			res.writeHead(200, {'Content-Type': got.headers['content-type'] || 'application/json'});
			got.on('data', function(d) {
				b += d;
			});
			got.on('end', function() {
				console.log('response ends');
				var str = b.toString();
				var data = JSON.parse(str).results;
				res.end(JSON.stringify(data,false));
			})
  });
};

exports.datageo = function (req, res) {
    lon = req.params.lon;
    lat = req.params.lat;
    http.get('http://openweathermap.org/data/2.0/find/station?lat='+lat+'&lon='+lon+'&cnt=10', function (got) {
var b = new Buffer(0);
			res.writeHead(200, {'Content-Type': 'application/json'});
			got.on('data', function(d) {
				b += d;
			});
			got.on('end', function() {
				console.log('response ends');
				var str = b.toString();
				var data = JSON.parse(str).list[0];
				res.end(JSON.stringify(data,false));
			})
  });

};