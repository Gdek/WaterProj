var express    = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Keiki_Corner');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var cors = require('cors');
var url = require('url');

var schoolSchema = new Schema({
  school: String,
  latitude: Number,
  longitude: Number,
  pledges: [{ type: Schema.Types.ObjectId, ref: 'Pledge'}]
});

var pledgeSchema = new Schema({
  _school : {type: Number, ref: 'School'},
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

  var result = School.find( function(err, schools) {
    if (err) return console.error(err);
    console.log(schools);
  });

  //parseSchools();
  //var pledgeexample = new Pledge({ name: 'Alex', initial: 'J', pledge: 'gardener' });
  //pledgeexample.save();
  //console.log(pledgeexample._id);
});

var app = express();

// parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(function (req, res, next) {
  console.log(req.body); // populated!
  next()
});


app.listen(8080);
app.get('/Schools', function(req, res){
  console.log(req.body);
  getPledges();
  fs.readFile("schools.json", 'utf8', function(err, data){
    if (err) {
      return console.log(err);
    }
    res.json(data);
  })
});

app.get('/AllPledges', function(req, res) {
    Pledge.find( function(err, pledges) {
        if (err) return console.error(err);
        console.log(pledges);
        res.send(pledges);
      });
});

app.post('/Pledge', function(req, res){
  //console.log('Post:' + req.body);      // your JSON
  addPledge(req.body);
  res.send(req.body);    // echo the result back
});

app.get('/RecentPledges', function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if (query.school) {
    Pledge.find({'school': query.school})
      .populate('pledges', 'name')
      .exec(function(err, school) {
      if (err) return console.error(err);
      console.log(school.pledges);
      res.send(school.pledges);
    });
  }
});


function addPledge(pledge) {
  School.findOne({'school': pledge.school}, function(err, SchoolId) {
    if (err) return console.error(err);
    var newPledge = new Pledge({ _school: SchoolId._id, name: pledge.firstName, initial: pledge.lastInitial, pledge: pledge.PledgeType});
    //console.log(newPledge.name);
    newPledge.save();
  });
  console.log(result);

  var result = Pledge.find({"school": pledge.school}, function(err, pledges) {
    if (err) return console.error(err);
    console.log(pledges);
  });
  //var wstream = fs.createWriteStream('pledges.txt');
  //wstream.write(pledge);
  //wstream.end();
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
    }
    var result = School.find( function(err, schoolsies) {
      if (err) return console.error(err);
      console.log(schoolsies);
    });
  });
}

function getPledges() {
  var schoolList;
  var result = School.find( function(err, schoolses) {
    if (err) return console.error(err);
    for (var school in schoolses) {
      var schoolName = school.name;
    }
  });
  //construct json schoolList
  //Find all schools
  //iterate through schools
  //Find all pledges with school name
  //add pledges to json object

  //return json object
}

//construct school list
//

function addSchool(school) {

}

//New function create pledgemap
//Get pledge data