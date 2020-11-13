// ==== Using packages ====
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const upload = require('express-fileupload');

// ==== Getting Document Model(Schema) ====
const Document = require('./models/Document.js');

// ==== Init app ====
const app = express();

// ==== Body Parser Middleware ====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(upload());
// ==== Connection to MongoDB with Mongoose ====
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/appk', {useMongoClient: true})
  .then(function() {
     console.log('Successfully connected to MongoDB!')
  }).catch(function(err) {
     console.error(err)
  });


//Serving template engine
app.use(express.static(__dirname+'/public'));


// ==== ROUTES ====

/* INDEX */
app.get('/', function(req, res, next) {
   // res.send("Welcome to Documents API");
   res.sendFile(__dirname+"/views/index.html");
});

/* GET ALL DOCUMENTS */
app.get('/documents', function(req, res) {
   // Code for handling documents(data) to be returned as JSON
   Document.find(function(err, documents){
    if(err){
      console.log(err);
    }
    res.json(documents);
   });
});

/* CREATE DOCUMENT */
app.post('/documents', function(req, res) {
   // Code for handling create document to DB and return as JSON
   var documenti =  new Document();
   documenti.subject_document = req.body.subject_document;
   documenti.subject_classification = req.body.subject_classification;
   documenti.physical_location = req.body.physical_location;
   documenti.document_number = req.body.document_number;
   documenti.description = req.body.description;
   documenti.author = req.body.author;
   documenti.scanned = req.body.scanned;
   Document.create(documenti,function(err,documenti){
    if(err){
      console.log(err);
    }
    res.json(documenti);
   });
});

app.post('/',function(req,res){
  if(req.files){
    var file = req.files.scanned,
        filename = file.name;
    file.mv("./upload/" + filename, function(err){
      if(err){
        console.log(err);
        res.send("error occured");
      }
    })
  }
});


/* Download document */
app.get('/download/:nameoffile', function(req, res){
  var file = __dirname + '/upload/' + req.params.nameoffile;
  res.download(file); // Set disposition and send it.
});


/* GET DOCUMENT */
app.get('/documents/:id', function(req, res) {
//    // Code for getting one specific document and return as JSON
   Document.findById(req.params.id, function(err,documenti){
    if(err){
      console.log(err);
    }
    res.json(documenti);
   });
});

/* UPDATE DOCUMENT */
app.put('/documents/update/:id', function(req, res) {
   // Code for updating one specific document and return as JSON
   var updatedDocument = {
    subject_document : req.body.subject_document,
    subject_classification : req.body.subject_classification,
    physical_location : req.body.physical_location,
    document_number : req.body.document_number,
    description : req.body.description,
    author : req.body.author,
    scanned : req.body.scanned
   }

   Document.findOneAndUpdate({_id: req.params.id}, updatedDocument, {new: true}, function(err,documenti){
      if(err){
        console.log(err);
      }
      res.json(documenti);
   });
});

/* DELETE DOCUMENT */
app.delete('/documents/delete/:id', function(req, res) {
   // Code to delete one specific document and return message as JSON
   Document.remove({_id: req.params.id},function(err,result){
    if(err){
      console.log(err);
    }
    res.json({message:"Document successfully deleted"});
   });
});

// ==== Run Application ====
app.listen(3000, () => {
  console.log('Express server is running at http://127.0.0.1:3000');
});
