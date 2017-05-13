const kindlegen = require('kindlegen');
const http = require('http');
const fs = require('fs');
//http://bluebirdjs.com/docs/api/promisification.html
const Promise = require("bluebird");
//Promise fs module
Promise.promisifyAll(fs);

let convertEbooktoMobi = function(file, fileName) {
    return new Promise(function(resolve, reject) {

        kindlegen(file, (error, mobi) => {
        	
            // mobi is an instance of Buffer with the compiled mobi file 
            fs.writeFileAsync('./targetBooks/' + fileName, mobi)
                .fail(function(err) {
                    if (err) throw err;
                    reject(err);
                    console.log('target Book had failed');
                })
                .done(function() {
                    console.log('target Book had saved');
                    fs.writeFileAsync('./sourceBooks/' + fileName, file)
                        .fail(function(err) {
                            if (err) throw err;
                             reject(err);
                            console.log('source Book had failed');
                        })
                        .done(function() {
                        	let oFile = {};
                        	oFile.fileName = fileName;
                        	oFile.fileUrl = './sourceBooks/' + fileName;
                        	resolve(oFile);
                            console.log('source Book had saved');
                        });
                });
        });
    });

}

let convertEbooktoMobi1 = function(file, fileName) {
	kindlegen(file, (error, mobi) => {
        	
            // mobi is an instance of Buffer with the compiled mobi file 
          	    fs.writeFileAsync('./targetBooks/' + fileName, mobi)
                .fail(function(err) {
                    if (err) throw err;
                   
                    console.log('target Book had failed');
                })
                .done(function() {
                   console.log('target Book had saved');
                });	
        });

}


module.exports = { convertEbooktoMobi: convertEbooktoMobi,
					convertEbooktoMobi1:convertEbooktoMobi1 }
