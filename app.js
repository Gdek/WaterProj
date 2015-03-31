var express    = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/water');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schoolSchema = new Schema({
  school: String,
  latitude: Number,
  longitude: Number
});

var pledgeSchema = new Schema({
  name: String,
  initial: String,
  pledge: String,
  date: { type: Date, default: Date.now }
});

var School = mongoose.model('School', schoolSchema);
var Pledge = mongoose.model('Pledge', pledgeSchema);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongo connected');
  parseSchools();
  //var pledgeexample = new Pledge({ name: 'Alex', initial: 'J', pledge: 'gardener' });
  //pledgeexample.save();
  //console.log(pledgeexample._id);
  //var result = Pledge.find( function(err, pledges) {
  //  if (err) return console.error(err);
  //  console.log(pledges);
  //});
});

var app = express();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next()
});

app.listen(8080);

app.post('/', function(req, res){
  console.log(req.body);      // your JSON
  addPledge(req.body);
  res.send(req.body);    // echo the result back
});

function addPledge(pledge) {
  //Seperate pledge parameters
  //Add pledge to database
  var pledgeObj = JSON.parse(pledge);
  var wstream = fs.createWriteStream('pledges.txt');
  wstream.write(pledge);
  wstream.end();
}

function parseSchools() {
  fs.readFile("schools.json", 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var schools = JSON.parse(data);
    for (var i=0;i<schools.SchoolList.length;i++) {
      var schoolObj = schools.SchoolList[i];
      var school = new School({ school: schoolObj.Name, latitude: schoolObj.Lat, longitude: schoolObj.Long });
      console.log(school._id);
      school.save();
      var result = School.find( function(err, schoolses) {
         if (err) return console.error(err);
          console.log(schoolses);
        });
    }
  });
}

//construct school list
//

function addSchool(school) {

}

//New function create pledgemap
//Get pledge data