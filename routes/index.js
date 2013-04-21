var http = require('http');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
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
				var data = JSON.parse(str);
				res.end(JSON.stringify(data,false));
			})
  });
};