var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moving_object');
var app = express();

var moving_object = mongoose.model('moving_object', {
  Source : String,
  Latitude : Number,
  Longtitude : Number,
  Name : String,
  Time : Date,
  Speed : Number,
  Course : Number,
  Altitude : Number,
  Comment : String}
);
  
  app.use(bodyParser.json());
 //app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/moving_object', function(req, res) {
    	//console.log(req.url);
    	console.log(req.body.cnt);
    var MovOb = new moving_object({
      Source: req.body.data.Source,
      Latitude: req.body.data.Latitude,
      Longtitude: req.body.data.Longtitude,
      Name: req.body.data.Name,
      Speed: req.body.data.Speed,
      Course: req.body.data.Course,
      Altitude: req.body.data.Altitude,
      Comment: req.body.data.Comment});
    
   MovOb.save(function (err) {
  if (err) 
  console.log('error');
else console.log("success")
  });

   res.send("Success");
  });
    app.listen(3000);