const kindlegen = require('kindlegen');
const http = require('http');

//http://bluebirdjs.com/docs/api/promisification.html
const Promise = require("bluebird");
//Promise fs module
const fs = Promise.promisifyAll(require('fs'));

let convertEbooktoMobi = function(ebookfileURL, fileName) {
    return new Promise(function(resolve, reject) {
        //mobi file name 
        var sMobiFileName = fileName.split(".")[0] + ".mobi";
        kindlegen(fs.readFileSync(ebookfileURL), (error, mobi) => {
            // console.log("step1", ebookfile);
            // mobi is an instance of Buffer with the compiled mobi file 
            fs.writeFileAsync('./sourceBooks/' + fileName, fs.readFileSync(ebookfileURL))
                .then(function(contents) {

                    console.log('source Book had saved',mobi);
                    // console.log("step2", ebookfile);
                    //save source files

                    fs.writeFileAsync('./targetBooks/' + sMobiFileName, mobi)
                        .catch(function(e) {
                            if (e) throw err;
                            reject(e);

                            console.log('target Book had failed');
                        })
                        .then(function(contents) {
                            let oFile = {};
                            oFile.fileName = sMobiFileName;
                            oFile.fileUrl = './targetBooks/' + sMobiFileName;
                            // console.log("step3", oFile);
                            resolve(oFile);
                            console.log('target Book had saved:', contents);
                        });
                }).catch(function(e) {
                    if (e) throw err;
                    reject(e);
                    console.log('source Book had failed');
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


module.exports = {
    convertEbooktoMobi: convertEbooktoMobi,
    convertEbooktoMobi1: convertEbooktoMobi1
}
