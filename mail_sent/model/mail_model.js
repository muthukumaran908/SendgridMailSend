var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient;
mail_model = new Schema({
	to: Array,
	subject: String,
	body: String,
	scheduling_date: String,
	scheduling_time: String
}, {
	collection: "mail_model"
});
module.exports = mongoose.model("mail_model", mail_model)