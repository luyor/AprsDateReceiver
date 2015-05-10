var http = require('http')
var cnt = 0
var sent_interval = 9

function call(){
	cnt++;
	var dataString = JSON.stringify({
    	Source: '',
        Latitude: 0,
        Longtitude: 0,
        Name: 'name',
        Speed: 0,
        Course: 0,
        Altitude: 0,
        Comment: 0
  	});
	var opts = {
	    host: "localhost",
	    port: 3000,
	    path: '/moving_object',
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	      'Content-Length': dataString.length
	    }//，
	    //keepAlive: true
  	};
	var req = http.request(opts, function(res) {
    	res.setEncoding('utf8')
  	})
  	req.write(dataString, function(feedback) {
    	console.log('sent:'+cnt);
	});
	req.on('error', function(error) {
		console.log('error:' + error);
	});
	req.end();
}

setInterval(call,sent_interval)