const kindlegen = require('kindlegen');
const fs = require('fs');

	kindlegen(fs.readFileSync('./sourceBooks/1.epub'), (error, mobi) => {
        	
            // mobi is an instance of Buffer with the compiled mobi file 
             fs.writeFile('./targetBooks/2.mobi', mobi,function(err){
             		if (err) {
             			throw err;
             		}
             		console.log('ok');
             })
          
        });