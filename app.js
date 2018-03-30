var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res){
  request('http://fundgz.1234567.com.cn/js/110023.js?rt=1522337816604', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
  })
});
app.listen(3000);