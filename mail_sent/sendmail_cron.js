var sendGridMail = require('@sendgrid/mail');
const mail_model = require('./model/mail_model.js');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const bodyParser = require('body-parser');
var config = require('./mongodb');
const mongoose = require('mongoose');
let moment = require('moment');
var async = require('async');
var express = require('express');
var app = express();
var PORT = 3000;
mail_model.find({}).exec(function(err, docs) {
	async.forEach(docs, (item, callnew) => {
		if (item.scheduling_date == moment().format('YYYYMMDD')) {
			var date_correct = moment(item.scheduling_date).format('DD/MM/YYYY');
			var dt = moment(item.scheduling_time, ["h:mm A"]).format("HH:mm");
			var dateTime = moment(date_correct + ' ' + dt, 'DD/MM/YYYY HH:mm').unix();

			function getMessage() {
				const body = item.body;
				return {
					to: item.to,
					from: 'kumaran3853@gmail.com',
					subject: item.subject,
					text: "body",
					html: `<strong>${body}</strong>`,
					"send_at": dateTime
				};
			}
			async function sendEmail() {
					try {
						await sendGridMail.send(getMessage());
						console.log('Test email sent successfully');
					} catch (error) {
						console.error('Error sending test email');
						console.error(error);
						if (error.response) {
							console.error(error.response.body)
						}
					}
				}
				(async () => {
					console.log('Sending test email');
					await sendEmail();
					setTimeout(function() {
						callnew()
					})
				})();
		} else {
			setTimeout(function() {
				callnew()
			})
		}
	}, function() {
		console.log("completed successfully.........")
	});
})
mongoose.connect(config.DB).then(function() {
	console.log("Successfully Connect to", config.DB)
}, function(err) {});
app.listen(PORT, function(err) {
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});