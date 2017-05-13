const kindlegen = require('kindlegen');
const fs = require('fs');

	kindlegen(fs.readFileSync('./sourceBooks/27057.epub'), (error, mobi) => {
        	
            // mobi is an instance of Buffer with the compiled mobi file 
             fs.writeFile('./targetBooks/3.mobi', mobi,function(err){
             		if (err) {
             			throw err;
             		}
             		console.log('ok');
             })
          
        });

    var Buf = new Buffer(fs.readFileSync('./sourceBooks/27057.epub'));
    console.log(Buf.length);