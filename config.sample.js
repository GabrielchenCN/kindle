let config;
let message;
let nodemailer;
let bookDir;

//邮件模板
message = {
    from: 'kindle helper',
    to: '',
    subject: 'mobi title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>',
    attachments: [{ // utf-8 string as an attachment
        filename: 'book.epub',
        content: ''
    }]
};
//邮件服务器配置
nodemailer = {};
nodemailer.service = 'QQ';
nodemailer.auth = {
    user: '@qq.com',
    pass: ''
}

//文件导入导出目录
booksDir = {
    sourceBooks: './sourceBooks',
    targetBooks: './targetBooks'
}



module.exports ={
    message: message,
    nodemailerConfig: nodemailer,
    booksDir:booksDir
}
