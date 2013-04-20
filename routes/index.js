var http = require('http');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.data = function(req, res){
  //var body = '';
  http.get('http://marsweather.ingenology.com/v1/latest/', function(res) {
    var body
      res.on('data', function(chunk) {
         body += chunk;
      });

      res.on('end', function() {
        var fbResponse = JSON.parse(body)
        console.log("Got response: " + fbResponse);
      });
      
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
 //res.send(body);
};