const http = require('http');
const multiparty = require('multiparty');
const fs = require('fs');
//http://bluebirdjs.com/docs/api/promisification.html
const Promise = require("bluebird");
const emailServer = require("./emailServer.js");
const kindlegen = require("./kindlegen.js");
const config = require("./config.js");

console.log(config);

//Promise fs module
Promise.promisifyAll(fs);

const server = new http.Server(); // 创建新的HTTP服务器
const port = 8000;
server.listen(port); // 在端口8000伤运行它
const log = require('util').log;
log('Http Server is listening ' + port + ' port.');
// Node使用'on'方法注册事件处理程序
// 当服务器收到新请求,则运行函数处理它
server.on('request', function(request, response) {
    // response.setEncoding('utf8');
    var filename = null;
    // 解析请求的URL
    var url = require('url').parse(request.url);
    switch (url.pathname) {
        case '/upload':
            var form = new multiparty.Form();
            form.parse(request, function(err, fields, files) {
                console.log(files.file[0]);
                console.log(fields);
                var fileName = files.file[0].originalFilename
                var fileURL = files.file[0].path;
                var fileMail = fields.mail[0];
                var to = fields
                // console.log(tmpfile);
                kindlegen.convertEbooktoMobi(fileURL, fileName)
                    .done(function(oFile) {
                        let message = config.message;
                        message.to = fileMail || config.message.to;
                        message.attachments = [{
                            filename: oFile.fileName,
                            content: fs.readFileSync(oFile.fileUrl)
                        }];
                        console.log(message);
                        emailServer.transporter.sendMail(message, (error, info) => {
                            if (error) {
                                response.writeHead(200, { 'Content-Type': 'application/json' });
                         
                                response.end('{ "code": 400, "msg": "error!" }', 'utf8');
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                        
                            response.end('{ "code": 200, "msg": "success!" }', 'utf8');
                        });
                    });
                // kindlegen.convertEbooktoMobi1(file, fileName);
            });

            break;
        case '/sendMailNormal':
            var form = new multiparty.Form();
            form.parse(request, function(err, fields, files) {
                console.log(files.file[0]);
                console.log(fields);
                var fileName = files.file[0].originalFilename
                var fileURL = files.file[0].path;
                var fileMail = fields.mail[0];
                console.log(fileName, fileURL, fileMail);

                let message = config.message;
                message.to = fileMail || config.message.to;
                message.attachments = [{
                    filename: fileName,
                    content: fs.readFileSync(fileURL)
                }];
                console.log(message);
                emailServer.transporter.sendMail(message, (error, info) => {
                    if (error) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                    
                        response.end('{ "code": 400, "msg": "error!" }', 'utf8');
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end('{ "code": 200, "msg": "success!" }', 'utf8');
                });


                // kindlegen.convertEbooktoMobi1(file, fileName);
            });

            break;
        case '/' || '/index.html':
            filename = 'index.html';

        default:
            filename = filename || url.pathname.substring(1); // 去掉前导'/'
            // 基于其扩展名推测内容类型
            var type = (function(_type) {
                switch (_type) { // 扩展名
                    case 'html':
                    case 'htm':
                        return 'text/html; charset=UTF-8';
                    case 'js':
                        return 'application/javascript; charset=UTF-8';
                    case 'css':
                        return 'text/css; charset=UTF-8';
                    case 'txt':
                        return 'text/plain; charset=UTF-8';
                    case 'manifest':
                        return 'text/cache-manifest; charset=UTF-8';
                    default:
                        return 'application/octet-stream';
                }
            }(filename.substring(filename.lastIndexOf('.') + 1)));
            // 异步读取文件,并将内容作为单独的数据块传回给回调函数
            // 对于确实很大的文件,使用API fs.createReadStream()更好
            fs.readFile(filename, function(err, content) {
                if (err) { // 如果由于某些原因无法读取文件
                    response.writeHead(404, { 'Content-type': 'text/plain; charset=UTF-8' });
                    response.write(err.message);
                } else { // 否则读取文件成功
                    response.writeHead(200, { 'Content-type': type });
                    response.write(content); // 把文件内容作为响应主体
                }
                response.end();
            });

    }
});