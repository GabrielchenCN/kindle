const nodemailer = require('nodemailer');
const config = require("./config.js");

let transporter = nodemailer.createTransport(config.nodemailerConfig);


// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

module.exports = { transporter: transporter }
