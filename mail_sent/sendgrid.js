var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	"limit": '50mb',
	"extended": true
}));
app.use(bodyParser.json({
	limit: '50mb'
}));
var config = require('./mongodb');
const mail_model = require('./model/mail_model.js');
const mongoose = require('mongoose');
var PORT = 4000;
app.post('/createmail', (req, res) => {
	if (req.body.to && !!req.body.subject && !!req.body.body && !!req.body.scheduling_date && !!req.body.scheduling_time) {
		arr = [];
		arr.push(req.body)
		mail_model.insertMany(arr)
		res.status(200).json({
			status: 1,
			msg: "Data created Successfully",
			data: arr
		});
	} else {
		res.status(200).json({
			status: 1,
			msg: "Insufficient inputs...."
		})
	}
});
app.post('/readmail', (req, res) => {
	if (!!req.body) {
		mail_model.find(req.body).exec(function(err, docs) {
			res.status(200).json({
				status: 1,
				msg: "Data Fetched Successfully",
				data: docs
			});
		})
	} else {
		mail_model.find({}).exec(function(err, docs) {
			res.status(200).json({
				status: 1,
				msg: "Data Fetched Successfully",
				data: docs
			});
		})
	}
});
app.post('/updatemail', (req, res) => {
	if (!!req.body) {
		const connectDB = async () => {
			await mail_model.updateMany(req.body.fix, {
				$set: req.body.set
			});
		};
		connectDB();
		res.status(200).json({
			status: 1,
			msg: "Data updated sucessfully"
		});
	} else {
		res.status(200).json({
			status: 1,
			msg: "insufficient inputs..."
		});
	}
})
app.post('/deletemail', (req, res) => {
	if (!!req.body) {
		mail_model.deleteMany(req.body).exec(function(err, docs) {
			res.status(200).json({
				status: 1,
				msg: "Data deleted Successfully",
			});
		})
	} else {
		res.status(200).json({
			status: 1,
			msg: "insufficient inputs....",
		});
	}
});
app.listen(PORT, function(err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
mongoose.connect(config.DB).then(function() {
	console.log("Successfully Connect to", config.DB)
}, function(err) {
	console.log('Can not connect to the database' + err)
});