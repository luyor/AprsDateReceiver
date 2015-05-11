var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var wdb = mongoose.createConnection('mongodb://localhost/weather');
var odb = mongoose.createConnection('mongodb://localhost/moving_object');
var app = express();
var port = 3000

var weather = wdb.model('weather', {
	Type: Number,
	Month: Number,
	Day: Number,
	Hour: Number,
	Min: Number,
	Sec: Number,
	Lat: Number,
	Long: Number,
	WindDirection: Number,
	WindSpeed: Number,
	AprsDevice: String,
	Gust: Number,
	Temp: Number,
	RainLastHr: Number,
	RainLast24Hr: Number,
	RainSinceMid: Number,
	Humidity: Number,
	Barometric: Number,
	Luminosity: Number
});

var moving_object = odb.model('moving_object', {
	Source: String,
	Latitude: Number,
	Longitude: Number,
	Name: String,
	Time: Date,
	Speed: Number,
	Course: Number,
	Altitude: Number,
	Comment: String
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var w_save_cnt = 0
var o_save_cnt = 0
app.post('/weather', function(req, res) {
	//console.log(req.url);
	//console.log(req.body.cnt);
	var Wea = new weather({
		Type: req.body.data.Type,
		Month: req.body.data.Month,
		Day: req.body.data.Day,
		Hour: req.body.data.Hour,
		Min: req.body.data.Min,
		Sec: req.body.data.Sec,
		Lat: req.body.data.Lat,
		Long: req.body.data.Long,
		WindDirection: req.body.data.WindDirection,
		WindSpeed: req.body.data.WindSpeed,
		AprsDevice: req.body.data.AprsDevice,
		Gust: req.body.data.Gust,
		Temp: req.body.data.Temp,
		RainLastHr: req.body.data.RainLastHr,
		RainLast24Hr: req.body.data.RainLast24Hr,
		RainSinceMid: req.body.data.RainSinceMid,
		Humidity: req.body.data.Humidity,
		Barometric: req.body.data.Barometric
		Luminosity: req.body.data.Luminosity
	});

	Wea.save(function(err) {
		if (err)
			console.log('database error');
		//else console.log("weather success")
		else console.log('weather_save_cnt:'+(++w_save_cnt))
	});

	res.send("Success");
});


app.post('/moving_object', function(req, res) {
	//console.log('receive_cnt:'+(++receive_cnt))
	//console.log(req.url);
	var MovOb = new moving_object({
		Source: req.body.Source,
		Latitude: req.body.Latitude,
		Longitude: req.body.Longitude,
		Name: req.body.Name,
		Time: req.body.Time,
		Speed: req.body.Speed,
		Course: req.body.Course,
		Altitude: req.body.Altitude,
		Comment: req.body.Comment
	});

	MovOb.save(function(err) {
		if (err)
			console.log('database error');
		//else console.log("moving_object success")
		else console.log('object_save_cnt:'+(++o_save_cnt))
	});

	res.send("Success");
});

app.listen(port);

wdb.on('error', function(error) {
	console.log(error);
});

odb.on('error', function(error) {
	console.log(error);
});