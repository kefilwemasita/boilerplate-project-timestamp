'use strict';

// init project
var express = require('express');
var app = express();

// enable CORS
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// static files
app.use(express.static('public'));

// homepage
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// ==============================
// FIXED TIMESTAMP MICROSERVICE
// ==============================

// helper function (avoids duplication)
function handleDate(req, res) {
  let dateParam = req.params.date;

  let dateObj;

  // empty date → current time
  if (!dateParam) {
    dateObj = new Date();
  }
  // unix timestamp
  else if (/^\d+$/.test(dateParam)) {
    dateObj = new Date(parseInt(dateParam));
  }
  // date string
  else {
    dateObj = new Date(dateParam);
  }

  // invalid date check
  if (isNaN(dateObj.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: dateObj.getTime(),
    utc: dateObj.toUTCString()
  });
}


// IMPORTANT: Express 5 safe routes (NO "?")
app.get("/api", handleDate);
app.get("/api/", handleDate);
app.get("/api/:date", handleDate);


// start server
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});