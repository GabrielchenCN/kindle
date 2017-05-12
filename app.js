const kindlegen = require('kindlegen');
const fs = require('fs');
//http://bluebirdjs.com/docs/api/promisification.html
const Promise = require("bluebird");
const eamilServer = require("./emailServer.js");

// kindlegen(fs.readFileSync('./sourceBooks/1.epub'), (error, mobi) => {
//     // mobi is an instance of Buffer with the compiled mobi file 
//     fs.writeFile('./targetBooks/1.mobi', mobi, function(err) {
//         if (err) throw err;
//         console.log('It\'s saved!');
//     });
// });

let message = {
    from: '',
    to: '',
    subject: 'mobi title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>',
    attachments :[
        {   // utf-8 string as an attachment
            filename: 'book.epub',
            content: fs.readFileSync('./sourceBooks/1.epub')
        }]
};
// send mail with defined transport object
eamilServer.transporter.sendMail(message, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
eamilServer.transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});