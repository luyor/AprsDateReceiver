var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var wdb = mongoose.createConnection('mongodb://localhost/weather');
var odb = mongoose.createConnection('mongodb://localhost/moving_object');
var app = express();

var weather = wdb.model('weather', {
    Type: Number,
    Month: Number,
    Day: String,
    Hour: String,
    Min: String,
    Sec: String,
    Lat: String,
    Long: String,
    WindDirection: String,
    WindSpeed: String,
    AprsSoft: String,
    WeatherUnit: String,
    Gust: String,
    Temp: String,
    RainLastHr: String,
    RainLast24Hr: String,
    RainSinceMid: String,
    Humidity: String,
    Barometric: String
});

var moving_object = odb.model('moving_object', {
    Source: String,
    Latitude: Number,
    Longtitude: Number,
    Name: String,
    Time: Date,
    Speed: Number,
    Course: Number,
    Altitude: Number,
    Comment: String
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/weather', function(req, res) {
    //console.log(req.url);
    console.log(req.body.cnt);
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
        AprsSoft: req.body.data.AprsSoft,
        WeatherUnit: req.body.data.WeatherUnit,
        Gust: req.body.data.Gust,
        Temp: req.body.data.Temp,
        RainLastHr: req.body.data.RainLastHr,
        RainLast24Hr: req.body.data.RainLast24Hr,
        RainSinceMid: req.body.data.RainSinceMid,
        Humidity: req.body.data.Humidity,
        Barometric: req.body.data.Barometric
    });

    Wea.save(function(err) {
        if (err)
            console.log('error');
        else console.log("weather success")
    });

    res.send("Success");
});

app.post('/moving_object', function(req, res) {
    //console.log(req.url);
    var MovOb = new moving_object({
        Source: req.body.Source,
        Latitude: req.body.Latitude,
        Longtitude: req.body.Longtitude,
        Name: req.body.Name,
        Speed: req.body.Speed,
        Course: req.body.Course,
        Altitude: req.body.Altitude,
        Comment: req.body.Comment
    });

    MovOb.save(function(err) {
        if (err)
            console.log('error');
        else console.log("moving_object success")
    });

    res.send("Success");
});

app.listen(3000);