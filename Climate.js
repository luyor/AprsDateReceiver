var net = require('net');
var http = require('http');

var port = 14580;
var host = 'hangzhou.aprs2.net';
var user = 'user BG5ZZZ-89 pass 24229 ver Jia\n';
var filter = '#filter t/w\n';

var client = new net.Socket();

var count = 0; //debugging
var errCount = 0;

client.connect(port, host, function() {
  client.write(user);
  client.write(filter);
});

client.on('data', function(data) {
  //console.log('Data');
  //console.log(data.toString());
  //var DataOnetime=new Array();
  //DataOnetime = data.toString().split('\n');
  var dataReceived = data.toString().split('\n')
  //console.log(data.toString());

  for (var i = 0; i < dataReceived.length; i++) {

    // console.log("@@@@@@@@@@@@@@@@@");
    //console.log(dataSplit(dataReceived[i]));
    var dataToBePosted = dataSplit(dataReceived[i]);
    //postData(dataSplit(dataReceived[i]));
    if (dataToBePosted != undefined)
      postData(dataToBePosted);

  }
  /*
		for (i=0;i<DataOnetime.length;i++){
			//console.log(i+DataOnetime[i]);
			//dealwithData
			postData(DataOnetime[i]);	//post data to backend (One string per time)
		}
        */
});

function postData(dataToPost) {
  //console.log(dataToPost);
  var dataString = JSON.stringify({
    data: dataToPost,
    cnt: ++count
  });
  //console.log(dataString);
  var opts = {
    host: "localhost",
    port: 3000,
    path: '/weather',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    }//，
    //keepAlive: true
  };

  var req = http.request(opts, function(feedback) {
    //console.log("whatever");
  });

  req.on('error', function(err) {
    console.log('problem with request:' + err);
    console.log(++errCount + "/" + count);
  });

  req.write(dataString, function(feedback) {
    //console.log('shit sent');
  });
  req.end();

}

client.on('error', function(error) {
  console.log('error' + error);
  //client.destory();
});

client.on('close', function() {
  console.log('Closed.\n');
  client.end();
});

client.on('end', function() {
  console.log('disconnected\n');
});

function dataSplit(data) {
  //console.log("++"+data);
  if (data.charAt(0) != '#' && data.charAt(0) != '') {

    if (data != '') {
      if (data.indexOf(':') == -1) {
        throw new Error("Error");
      }
    } else {
      throw new Error("Error");
    }


    var dataStr = data.split(/:/);
    //     console.log(dataStr);
    //     dataStr[1] = dataStr[1].toString().substring(0, dataStr[1].length-1);
    // console.log(typeof(dataStr[1]));

    /*      if(dataStr[1] == undefined) {
              throw new Error("Error");

          }*/

    var weatherType = dataStr[1].charAt(0);
    //console.log(dataStr);
    //console.log(weatherType);


    // Begin to deal with the weather data
    var ObjName;
    var time;
    var latitute;
    var longitude;
    var windInfo;
    var compressedWindInfo;
    var WeatherData;
    var SoftwareIdentifier;
    var MachineIdentifier;

    switch (weatherType) {

      case '@':

        // console.log("Type is @");
        var newWeatherData;
        if (dataStr[1].charAt(16) == '/') {
          //Complete Weather data with Lat/Long and Time Stamp
          time = dataStr[1].substring(1, 8);
          latitute = dataStr[1].substring(8, 16);
          longitude = dataStr[1].substring(17, 26);
          windInfo = dataStr[1].substring(27, 34);
          compressedWindInfo = '';
          WeatherData = dataStr[1].substring(34, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);

        } else {
          //Complete Weather data with Compressed Lat/Long and Time Stamp
          time = dataStr[1].substring(1, 8);
          latitute = dataStr[1].substring(9, 13);
          longitude = dataStr[1].substring(13, 17);
          compressedWindInfo = dataStr[1].substring(18, 20);
          windInfo = '';
          WeatherData = dataStr[1].substring(21, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);
        }
        /*
            console.log(time);
            console.log(latitute);
            console.log(longitude);
            console.log(windInfo);
            console.log(newWeatherData);*/
        break;

      case '/':
        var newWeatherData;
        //console.log("Type is /");
        if (dataStr[1].charAt(16) == '/') {
          //Complete Weather data with Lat/Long and Time Stamp
          time = dataStr[1].substring(1, 8);
          latitute = dataStr[1].substring(8, 16);
          longitude = dataStr[1].substring(17, 26);
          windInfo = dataStr[1].substring(27, 34);
          compressedWindInfo = '';
          WeatherData = dataStr[1].substring(34, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);

        } else {
          //Complete Weather data with Compressed Lat/Long and Time Stamp
          time = dataStr[1].substring(1, 8);
          latitute = dataStr[1].substring(9, 13);
          longitude = dataStr[1].substring(13, 17);
          compressedWindInfo = dataStr[1].substring(18, 20);
          windInfo = '';
          WeatherData = dataStr[1].substring(21, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);
        }

        /*  console.log(time);
          console.log(latitute);
          console.log(longitude);
          console.log(windInfo);
          console.log(newWeatherData);*/
        break;

      case '!':

        // console.log("Type is !");
        var newWeatherData;
        if (dataStr[1].charAt(2) != '!') {
          if (dataStr[1].charAt(9) == '/') {
            //Complete Weather data with Lat/Long and NO Time Stamp
            time = '';
            ObjName = '';
            latitute = dataStr[1].substring(1, 9);
            longitude = dataStr[1].substring(10, 19);
            windInfo = dataStr[1].substring(21, 28);
            compressedWindInfo = '';
            WeatherData = dataStr[1].substring(28, dataStr[1].length);
            var newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);

          } else {
            //Complete Weather data with Compressed Lat/Long and NO Time Stamp
            time = '';
            ObjName = '';
            latitute = dataStr[1].substring(2, 6);
            longitude = dataStr[1].substring(6, 10);
            compressedWindInfo = dataStr[1].substring(11, 13);
            windInfo = '';
            WeatherData = dataStr[1].substring(14, dataStr[1].length);
            newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);

          }

          /*    console.log(time);
              console.log(latitute);
              console.log(longitude);
              console.log(windInfo);
              console.log(newWeatherData);*/
        } else {
          var rawWeatherData = dataStr[1].substring(1, dataStr[1].length);
        }
        break;

      case '=':
        //   console.log("Type is =");
        var newWeatherData;
        if (dataStr[1].charAt(9) == '/') {
          //Complete Weather data with Lat/Long and NO Time Stamp
          time = '';
          ObjName = '';
          latitute = dataStr[1].substring(1, 9);
          longitude = dataStr[1].substring(10, 19);
          windInfo = dataStr[1].substring(20, 27);
          compressedWindInfo = '';
          WeatherData = dataStr[1].substring(27, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);


        } else {
          //Complete Weather data with Compressed Lat/Long and NO Time Stamp
          time = '';
          ObjName = '';
          latitute = dataStr[1].substring(2, 6);
          longitude = dataStr[1].substring(6, 10);
          compressedWindInfo = dataStr[1].substring(11, 13);
          windInfo = '';
          WeatherData = dataStr[1].substring(14, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);
        }

        /*   console.log(time);
           console.log(latitute);
           console.log(longitude);
           console.log(windInfo);
           console.log(newWeatherData);*/

        break;

      case ';':

        var newWeatherData;
        ObjName = dataStr[1].substring(1, 10);
        if (dataStr[1].charAt(17) == 'z') {
          time = dataStr[1].substring(11, 18);
          latitute = dataStr[1].substring(18, 26);
          longitude = dataStr[1].substring(27, 36);
          windInfo = dataStr[1].substring(37, 44);
          compressedWindInfo = '';
          WeatherData = dataStr[1].substring(44, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);
        } else {
          time = '';
          latitute = dataStr[1].substring(11, 19);
          longitude = dataStr[1].substring(20, 29);
          windInfo = dataStr[1].substring(30, 37);
          compressedWindInfo = '';
          WeatherData = dataStr[1].substring(37, dataStr[1].length);
          newWeatherData = WeatherData.split(/[a-z]\d{4,5}\D+/);
        }
        /*
                        console.log("Type is ;");
                        console.log(ObjName);
                        console.log(time);
                        console.log(latitute);
                        console.log(longitude);
                        console.log(windInfo);
                        console.log(newWeatherData);*/

        break;
      case '#':
        //  console.log("Type is #");
        rawWeatherData = dataStr[1].substring(1, dataStr[1].length);
        var newWeatherData = rawWeatherData.split(/[a-z]\d{4,5}\D+/);
        //     console.log(newWeatherData);
        time = '';
        ObjName = '';
        latitute = '';
        longitude = '';
        compressedWindInfo = '';
        windInfo = '';
        WeatherData = '';
        break;
      case '$':
        //     console.log("Type is $");
        rawWeatherData = dataStr[1].substring(1, dataStr[1].length);
        var newWeatherData = rawWeatherData.split(/[a-z]\d{4,5}\D+/);
        //     console.log(newWeatherData);
        time = '';
        ObjName = '';
        latitute = '';
        longitude = '';
        compressedWindInfo = '';
        windInfo = '';
        WeatherData = '';
        break;
      case '*':
        //     console.log("Type is *");
        rawWeatherData = dataStr[1].substring(1, dataStr[1].length);
        var newWeatherData = rawWeatherData.split(/[a-z]\d{4,5}\D+/);
        //     console.log(newWeatherData);
        time = '';
        ObjName = '';
        latitute = '';
        longitude = '';
        compressedWindInfo = '';
        windInfo = '';
        WeatherData = '';
        break;
      case '_':
        //    console.log("Type is _");
        //console.log(dataStr[1].substring(1, 9));
        var rawWeatherData = dataStr[1].substring(10, dataStr[1].length);
        var newWeatherData = rawWeatherData.split(/[a-z]\d{4,5}\D+/);
        //     console.log(newWeatherData);
        time = '';
        ObjName = '';
        latitute = '';
        longitude = '';
        compressedWindInfo = '';
        windInfo = '';
        WeatherData = '';

        //Deal with raw weather data
        break;
      default: //console.log(weatherType);
        time = '';
        ObjName = '';
        latitute = '';
        longitude = '';
        compressedWindInfo = '';
        windInfo = '';
        WeatherData = '';
        break;
    }



    var i = dataStr[1].length - 1;

    var dataStr1 = dataStr[1].toString();

    if (dataStr1[i] >= '0' && dataStr1[i] <= '9' && dataStr1[i - 1] >= '0' && dataStr1[i] <= '9') {;
    } else if (dataStr1[i - 3] >= '0' && dataStr1[i - 3] <= '9') {
      SoftwareIdentifier = dataStr1[i - 2];
      MachineIdentifier = dataStr1.substring(i - 1, i);
    } else if (dataStr1[i - 4] >= '0' && dataStr1[i - 4] <= '9') {
      SoftwareIdentifier = dataStr1[i - 3];
      MachineIdentifier = dataStr1.substring(i - 2, i);
    } else {
      SoftwareIdentifier = dataStr1[i - 4];
      MachineIdentifier = dataStr1.substring(i - 3, i);
    }
    //  console.log("*****"+SoftwareIdentifier);
    //  console.log("*****"+MachineIdentifier);


    //Start to make up an object

    var weatherDataGroup = {

        objNameConverted: ObjName,
        TimeConverted: time,
        latituteConverted: latitute,
        longitudeConverted: longitude,
        windInfoConverted: windInfo,
        compressedWindInfoConverted: compressedWindInfo,
        WeatherDataConverted: WeatherData,
        SoftwareIdentifierConverted: SoftwareIdentifier,
        MachineIdentifierConverted: MachineIdentifier
      }
      //Object Made

    var receivedObject = dataDecoding(weatherDataGroup);
    //   console.log("!!!!!!!!!!!!!!!");
    //   console.log(receivedObject);

  }

  return receivedObject;
}

function dataDecoding(DataConvertedGroup) {
  var tarData = new Object();
  tarData.Type = 0;
  // 0 - undefine ; 1 - DayHrMin(UTC/GMT) z ; 2 - DayHrMin(Local) / ; 3 HrMinSec(UTC/GMT) h ; 4 MonDayHrMin(UTC/GMT)
  tarData.Month = "";
  tarData.Day = "";
  tarData.Hour = "";
  tarData.Min = "";
  tarData.Sec = "";

  //Split Time
  tStr = DataConvertedGroup.TimeConverted;
  if (tStr.length == 7) {
    tail = tStr.charAt(6);
    var d = new Date();
    //console.log(tail);
    switch (tail) {
      case 'z':
        tarData.Month = d.getUTCMonth() + 1;
        tarData.Day = tStr.slice(0, 2);
        tarData.Hour = tStr.slice(2, 4);
        tarData.Min = tStr.slice(4, 6);
        break;
      case '/':
        tarData.Month = d.getMonth() + 1;
        tarData.Day = tStr.slice(0, 2);
        tarData.Hour = tStr.slice(2, 4);
        tarData.Min = tStr.slice(4, 6);
        break;
      case 'h':
        tarData.Hour = tStr.slice(0, 2);
        tarData.Min = tStr.slice(2, 4);
        tarData.Sec = tStr.slice(4, 6);
        break;
    }
  } else if (tStr.length == 8) {
    tarData.Type = 4;
    tarData.Month = tStr.slice(0, 2);
    tarData.Day = tStr.slice(2, 4);
    tarData.Hour = tStr.slice(4, 6);
    tarData.Min = tStr.slice(6, 8);
  } else {
    //  console.log('Unknown Time Data');
  }

  //Latitude
  tLat = DataConvertedGroup.latituteConverted;
  if (tLat.length == 4) {
    y1 = (tLat.charCodeAt(0) - 33) * (91 * 91 * 91);
    y2 = (tLat.charCodeAt(1) - 33) * (91 * 91);
    y3 = (tLat.charCodeAt(2) - 33) * (91);
    y4 = (tLat.charCodeAt(3) - 33) * (1);
    tarData.Lat = 90 - (y1 + y2 + y3 + y4) / 380926;
  } else {
    tarData.Lat = tLat;
  }

  //Longtitude
  tLong = DataConvertedGroup.longitudeConverted;
  if (tLong.length == 4) {
    x1 = (tLong.charCodeAt(0) - 33) * (91 * 91 * 91);
    x2 = (tLong.charCodeAt(1) - 33) * (91 * 91);
    x3 = (tLong.charCodeAt(2) - 33) * (91);
    x4 = (tLong.charCodeAt(3) - 33) * (1);
    tarData.Long = -180 + (x1 + x2 + x3 + x4) / 190463;
  } else {
    tarData.Long = tLong;
  }

  var res = new Object();
  res.WeatherStr = DataConvertedGroup.WeatherDataConverted; //"c...s   g005t077r000p000P000h50b09900";
  res.WindDir_Speed = DataConvertedGroup.windInfoConverted; //"220/004";
  res.CompWindDir_Speed = DataConvertedGroup.compressedWindInfoConverted; //"7P";

  //Split WeatherStr
  wStr = res.WeatherStr;
  var extraStr = new Object();
  extraStr.WindDir_Speed = "";
  extraStr.CompWindDir_Speed = "";
  if (res.WindDir_Speed == "") extraStr.WindDir_Speed = "";
  else extraStr.WindDir_Speed = res.WindDir_Speed;
  if (res.CompWindDir_Speed == '') extraStr.CompWindDir_Speed = "";
  else extraStr.CompWindDir_Speed = res.CompWindDir_Speed;

  //WindDirection
  tarData.WindDirection = wStr.slice(wStr.indexOf('c') + 1, wStr.indexOf('c') + 4); // degrees
  if (tarData.WindDirection == "..." || tarData.WindDirection == "   ") tarData.WindDirection = 0;
  if (tarData.WindDirection == wStr.slice(0, 3)) tarData.WindDirection = 0;
  if (extraStr.WindDir_Speed != "") tarData.WindDirection = extraStr.WindDir_Speed.slice(0, 3);
  if (extraStr.CompWindDir_Speed != '') {
    if (extraStr.CompWindDir_Speed.charAt(0) >= '!' && extraStr.CompWindDir_Speed.charAt(0) <= 'z') {
      tarData.WindDirection = (extraStr.CompWindDir_Speed.charCodeAt(0) - 33) * 4;
    }
  }

  //WindSpeed
  tarData.WindSpeed = wStr.slice(wStr.indexOf('s') + 1, wStr.indexOf('s') + 4); // mph
  if (tarData.WindSpeed == "..." || tarData.WindSpeed == "   ") tarData.WindSpeed = 0;
  if (tarData.WindSpeed == wStr.slice(0, 3)) tarData.WindSpeed = 0;
  if (extraStr.WindDir_Speed != "") tarData.WindSpeed = extraStr.WindDir_Speed.slice(4, 7);
  if (extraStr.CompWindDir_Speed != "") {
    if (extraStr.CompWindDir_Speed.charAt(0) >= '!' && extraStr.CompWindDir_Speed.charAt(0) <= 'z') {
      pow = 1.00;
      eFlag = extraStr.CompWindDir_Speed.charCodeAt(1) - 33;
      for (i = 1; i <= eFlag; i++) pow = pow * 1.08;
      tarData.WindSpeed = pow - 1;
    }
  }

  //AprsSoftware & WeatherUnit
  res.AprsSoft = DataConvertedGroup.SoftwareIdentifierConverted;
  aStr = res.AprsSoft;
  res.WeatherUnit = DataConvertedGroup.MachineIdentifierConverted;
  uStr = res.WeatherUnit;
  switch (aStr) {
    case "d":
      tarData.AprsSoft = "APRSdos";
      break;
    case "M":
      tarData.AprsSoft = "MacAPRS";
      break;
    case "P":
      tarData.AprsSoft = "pocketAPRS";
      break;
    case "S":
      tarData.AprsSoft = "APRS+SA";
      break;
    case "W":
      tarData.AprsSoft = "WinAPRS";
      break;
    case "X":
      tarData.AprsSoft = "X-APRS (Linux)";
      break;
    default:
      tarData.AprsSoft = res.AprsSoft;
  }

  switch (uStr) {
    case "Dvs":
      tarData.WeatherUnit = "Davis";
      break;
    case "HKT":
      tarData.WeatherUnit = "Heathkit";
      break;
    case "PIC":
      tarData.WeatherUnit = "PIC device";
      break;
    case "RSW":
      tarData.WeatherUnit = "Radio Shack";
      break;
    case "￼U-II":
      tarData.WeatherUnit = "Original Ultimeter U-II (auto mode)";
      break;
    case "￼￼￼U2R":
      tarData.WeatherUnit = "Original Ultimeter U-II (remote mode)";
      break;
    case "￼U2k￼￼￼":
      tarData.WeatherUnit = "Ultimeter 500/2000";
      break;
    case "U2kr":
      tarData.WeatherUnit = "Remote Ultimeter logger";
      break;
    case "￼U5￼￼￼":
      tarData.WeatherUnit = "Ultimeter 500";
      break;
    case "Upkm":
      tarData.WeatherUnit = "Remote Ultimeter packet mode";
      break;
    default:
      tarData.WeatherUnit = res.WeatherUnit;
  }


  //Gust
  tarData.Gust = wStr.slice(wStr.indexOf('g') + 1, wStr.indexOf('g') + 4); // mph (peak speed in the last 5min)
  if (tarData.Gust == "..." || tarData.Gust == "   ") tarData.Gust = 0;
  if (tarData.Gust == wStr.slice(0, 3)) tarData.Gust = 0;
  //Temp
  tarData.Temp = wStr.slice(wStr.indexOf('t') + 1, wStr.indexOf('t') + 4); // degrees Fahrenheit
  if (tarData.Temp == "..." || tarData.Temp == "   ") tarData.Temp = 0;
  if (tarData.Temp == wStr.slice(0, 3)) tarData.Temp = 0;
  //RainLastHr
  tarData.RainLastHr = wStr.slice(wStr.indexOf('r') + 1, wStr.indexOf('r') + 4); // hundredths of an inch
  if (tarData.RainLastHr == wStr.slice(0, 3)) tarData.RainLastHr = 0;
  if (tarData.RainLastHr == wStr.slice(0, 3)) tarData.RainLastHr = 0;
  //RainLast24Hr
  tarData.RainLast24Hr = wStr.slice(wStr.indexOf('p') + 1, wStr.indexOf('p') + 4);
  if (tarData.RainLast24Hr == wStr.slice(0, 3)) tarData.RainLast24Hr = 0;
  if (tarData.RainLast24Hr == wStr.slice(0, 3)) tarData.RainLast24Hr = 0;
  //RainSinceMid
  tarData.RainSinceMid = wStr.slice(wStr.indexOf('P') + 1, wStr.indexOf('P') + 4);
  if (tarData.RainSinceMid == wStr.slice(0, 3)) tarData.RainSinceMid = 0;
  if (tarData.RainSinceMid == wStr.slice(0, 3)) tarData.RainSinceMid = 0;
  //Humidity
  tarData.Humidity = wStr.slice(wStr.indexOf('h') + 1, wStr.indexOf('h') + 3); // in %.00 = 100%
  if (tarData.Humidity == wStr.slice(0, 2)) tarData.Humidity = 0;
  if (tarData.Humidity == wStr.slice(0, 3)) tarData.Humidity = 0;
  //Barometric
  tarData.Barometric = wStr.slice(wStr.indexOf('b') + 1, wStr.indexOf('b') + 5);
  if (tarData.Barometric == wStr.slice(0, 4)) tarData.Barometric = 0;
  if (tarData.Barometric == wStr.slice(0, 3)) tarData.Barometric = 0;
  //wea.Luminosity = wStr.slice(wStr.indexOf('L')+1, wStr.indexOf('L')+4);          // in watts per meter^2 <= 999
  //wea.Luminosity2 = wStr.slice(wStr.indexOf('l')+1, wStr.indexOf('l')+4);
  //wea.SnowfallLast24Hr = wStr.slice(wStr.indexOf('s')+1, wStr.indexOf('s')+4);  //in inches
  //wea.RawRainCounter = wStr.slice(wStr.indexOf('#')+1, wStr.indexOf('#')+4);
  //console.log(tarData);

  return tarData;
}
