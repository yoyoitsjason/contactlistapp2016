var express = require("express");
var app = express();
var http = require("http"); //new
var server = http.createServer(app); //new
var mongojs = require("mongojs");
var db = mongojs("contactlist",["contactlist"]); /*All DB data is stored in c://data/db*/

var bodyParser = require("body-parser");

app.use(express.static(__dirname + "/client"))//open index.html in client folder
app.use(bodyParser.json()); 

app.get("/contactlist", function (req, res) {
	console.log("I received a GET request to pull from /contactlist")

	db.contactlist.find(function(err,docs) {
		console.log("docs : " + docs);
		res.json(docs); /* I believe this sends out the full JSON object that has been translated to a JS object as the response*/
		console.log("error message:" + err);
	})
});

app.post("/contactlist", function (req, res) {
	console.log("req.body : " + req.body);
	db.contactlist.insert(req.body, function(err, doc) {
		console.log("res.json(doc): " + doc)
		res.json(doc);  /* I believe this sends out the added JSON object that has been translated to a JS object as the response in /contactlist and is required to let the controller know that the request was processed successfully */
		console.log("error message:" + err);
	});
});

app.delete("/contactlist/:id", function (req, res) {
	var id = req.params.id; /* get the value of the id from the URL */
	console.log("id : " + id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
		console.log("DELETE doc: " + doc);
		console.log("error message:" + err);
	});
});

app.get("/contactlist/:id", function (req, res) { //editing function
	var id = req.params.id;
	console.log("id: " + id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)},function (err, doc) {
		res.json(doc);
		console.log("EDIT doc: " + doc);
		console.log("error message:" + err);
	});
});

app.put("/contactlist/:id", function (req, res) { //update function
	var id = req.params.id;
	console.log(req.body.name);
	db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
								  update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
								  new: true}, function(err,doc) {
								  	res.json(doc);
								  	console.log("error message:" + err);
	});
});

//app.listen(3000);
//console.log("Server running on port 3000");

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});