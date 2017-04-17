var uuid = require('node-uuid');

// manageSession and parseCookies

var sessionStore = {};

function parseCookies(req, res, next) {

    //this returns the cookie headers
    var cookieHeader = req.get("Cookie");

    //create hwCookies property and add to req
    req.hwCookies = {};


    if (cookieHeader === undefined ) {
    	//console.log(cookieHeader);
    	//console.log(typeof (cookieHeader));

    }
    else {

    	// string that has headers --> split by ;
    	var headers = cookieHeader.split("; ");

    	for (var i = 0; i < headers.length; i++) {
	        var miniArray = headers[i].split("=");
	        var headerName = miniArray[0];
	        var headerValue = miniArray[1];
	        req.hwCookies[headerName] = headerValue;        
    	}

    }


    next();

}

function manageSession(req, res, next) {

	//console.log("req.hwCookies:", req.hwCookies);
	//Check if sessionId is in req.hwCookies has sessionId
	if (req.hwCookies.hasOwnProperty("sessionId")) {

		//check if that session id is in sessionStore
		var thisSession = req.hwCookies["sessionId"];
		if (sessionStore.hasOwnProperty(thisSession)) {

			//set req.hwSession to the data thats in our session store 
			//for that sesion id
			req.hwSession = sessionStore[thisSession];

			console.log("session already exists:", thisSession);
		}
		else {

			//generate a new session id and create empty object for that ids data
			//in session store
			var newSessionId = uuid.v4();
			var sessionData = {};

			console.log("session generated:", newSessionId);

			// set req.hwSession to the data associated with the id 
			req.hwSession = sessionData;

			res.append('Set-Cookie', 'sessionId=' + newSessionId + "; HttpOnly");

			//add property sessionId to req.hwSession with the sesion Id
			req.hwSession["sessionId"] = newSessionId;

			//store this seession in sesstion store 
			sessionStore[newSessionId] = sessionData;


		}
	}
	else {

		//generate a new session id and create empty object for that ids data
		//in session store
		var newSessionId = uuid.v4();
		var sessionData = {};

		console.log("session generated:", newSessionId);

		// set req.hwSession to the data associated with the id 
		req.hwSession = sessionData;

		
		res.append('Set-Cookie', 'sessionId=' + newSessionId + "; HttpOnly");

		//add property sessionId to req.hwSession with the sesion Id
		req.hwSession["sessionId"] = newSessionId;

		//store this seession in sesstion store 
		sessionStore[newSessionId] = sessionData;

	}

	next();
}

module.exports = {

	parseCookies: parseCookies,
	manageSession: manageSession,
}