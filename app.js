var express    = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/KeikiCornerPledge');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var cors = require('cors');
var url = require('url');

var Pledges = new Schema({
  name: String,
  initial: String,
  pledgeType: String,
  date: { type: Date, default: Date.now }
});

var schoolSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  pledges: [Pledges]
});

var School = mongoose.model('School', schoolSchema);
var Pledge = mongoose.model('Pledge', Pledges);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongo connected');
  /*
  var result = School.find( function(err, schools) {
    if (err) return console.error(err);
    console.log(schools);
  });
  */


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
  var schoolList = new Array();
  //var result = School.find( {sort: {Name: 1}}, function(err, schools) {
  var result = School.find({}, null, {sort: {name: 1}}, function(err, schools) {
    if (err) return console.error(err);
    for (var i=0;i<schools.length;i++) {
      var school = schools[i];
       schoolList.push(schools[i]._doc.name)
    }
    res.send(JSON.stringify(schoolList));
  });
});

app.post('/Test', function(req, res) {
  res.send(req.body);
});

app.get('/PledgeMax', function(req, res) {
  getPledgeMax(res);
});

app.get('/AllPledges', function(req, res) {
    Pledge.find( function(err, pledges) {
        if (err) return console.error(err);
        console.log(pledges);
        res.send(pledges);
      });
});

app.get('/LatestPledges', function(req, res) {
  getLatestPledges(res);
});

app.post('/Pledge', function(req, res){
  //console.log('Post:' + req.body);      // your JSON
  addPledge(req.body, res);
  //res.send(req.body);
});

app.get('/mapData', function(req, res){
  getMapData(res);
});


function addPledge(pledge, res) {
  School.findOne({'name': pledge.school}, function(err, SchoolObj) {
    if (err) return console.error(err);
    //var School = SchoolObj.toObject();
    if(SchoolObj) {
      SchoolObj._doc.pledges.push({ name: pledge.firstName, initial: pledge.lastInitial, pledgeType: pledge.PledgeType});
      SchoolObj.save();
      res.redirect('http://54.187.197.244/keiki_corner/map.html');
    }
  });
}

function parseSchools() {
  fs.readFile("schools.json", 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var schools = JSON.parse(data);
    for (var i=0;i<schools.SchoolList.length;i++) {
     var schoolObj = schools.SchoolList[i];
     var school = new School({ name: schoolObj.Name, latitude: schoolObj.Lat, longitude: schoolObj.Long });
     console.log(school._id);
     school.save();
    }
    var result = School.find( function(err, schoolsies) {
      if (err) return console.error(err);
      console.log(schoolsies);
    });
  });
}

var getPledgeMax = function(res) {
  School.aggregate([
    { $group: { _id:null,
      max: {$max: { $size: "$pledges"}}
    }}
  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.send((result));
  })
};

var getLatestPledges = function(res) {
  School.aggregate({$unwind:'$pledges'}, {$sort:{'pledges.date':-1}}, {$limit: 10}, function(err, pledges) {
    res.send(pledges);
  });
};

function getPledges() {
  var schoolList;
  var result = School.find( function(err, schools) {
    if (err) return console.error(err);
    for (var school in schools) {
      var schoolName = school.name;
    }
  });
  //Get array of schools
  //avoid schools with no pledges
  //reformat list to send to browser
  //return school json
}

var getMapData = function(res) {
  var schoolList = new Array();
  var result = School.find( function(err, schools) {
    if (err) return console.error(err);
    for (var i=0;i<schools.length;i++) {
      if(schools[i]._doc.pledges.length > 0) {
        schoolList.push(schools[i]._doc)
      }
    }
    res.send(JSON.stringify(schoolList));
  });
  //Get array of schools
  //avoid schools with no pledges
  //reformat list to send to browser
  //return school json
};



function addSchool(school) {

}

//New function create pledgemap
//Get pledge data
