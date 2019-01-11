var default_set = require('./default.js');
var jwt = require("jsonwebtoken");
const slug = require('slug');
const lodash = require('lodash');
const validImageTypes = ['image/gif', 'image/png', 'image/jpeg'];
var AWS = require('aws-sdk');
var fs = require('fs');
var accessKeyId =  default_set.AWS.ACCESS_KEY_ID;
var secretAccessKey = default_set.AWS.SECRET_ACCESS_KEY;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

var S3 = new AWS.S3();

const isValid = exports.isValid = function(data) {
    if (data !== null && data !== undefined) {
        return true;
    } else {
        return false;
    }
}
const isEmptyString = exports.isEmptyString = function(data) {
    if (data === '') {
        return true;
    } else {
        return false;
    }
}

exports.jwtSign = function(data) {
    try {
        return jwt.sign(data, default_set.PRIVATE_KEY);
    } catch (err) {
        return err;
    }
}

exports.slugify = function(name){
    return slug(name); 
}

exports.isValidImageType = function(type){
    var found = lodash.indexOf(validImageTypes, type);
    if (found === -1) {
        return false;
    } else {
        return true;
    }
}

exports.decodeBase64Image = function(dataString, res) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    //console.log("dataString", dataString)
    var response = {};
    if (matches) {
        if (matches.length !== 3) {
            res.json({
                "code": 401,
                "message": "Invalid input string"
            });
            //return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    } else {
        return "err";
        //return new Error('Invalid base64 input string');
    }

}

exports.capitalizeFirstLetter = function(str) {
    if(lodash.isString(str) && str.length)
        return str.charAt(0).toUpperCase() + str.slice(1);
    else
        return str;
}

exports.getEmailHeader = function() {
    return '<html xmlns="http://www.w3.org/1999/xhtml">' +
        '<head>' +
        '<meta http-equiv="content-type" content="text/html; charset=utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0;">' +
        '<meta content="online market app, online rice agri products" name="online market">' +
        '<style>' +
        'body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}' +
        'body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }' +
        'table, td {  border-collapse: collapse !important; border-spacing: 0; }' +
        'img { border: 0; line-height: 100%; outline: none; text-decoration: none; 600 }' +
        '#onlineagri_order a { padding: 0; }' +
        '.onlineagriMsgBody { width: 100%; } .onlineagri { width: 100%; }' +
        '.onlineagri, .onlineagri p, .onlineagri span, .onlineagri font, .onlineagri td, .onlineagri div { line-height: 100%; }' +
        '@media all and (min-width: 600px) {' +
        '.container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}' +
        '}' +
        'a, a:hover {' +
        'color: #127DB3;' +
        '}' +
        '.footer a, .footer a:hover {' +
        'color: #999999;' +
        '}' +
        '</style>' +
        '<title>F2H</title>' +
        '</head>' +
        '<body text="#555" marginwidth="0" marginheight="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%;  text-size-adjust: 100%;  line-height: 100%;' +
        ' color: #555;" width="100%" leftmargin="0" bottommargin="0" rightmargin="0" topmargin="0">' +
        '<table height="100%" width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td valign="top" align="left" background="' + default_set.HOST + '/images/agriimage.jpg">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;">' +
        '<tbody>' +
        '<tr>' +
        '<td valign="top"  align="center" style="border-collapse: collapse;border-spacing: 0; margin: 0; padding: 0;"><table width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse: collapse; border-spacing: 0px; padding: 0px; width: inherit; max-width: 600px; background: rgb(255, 255, 255) none repeat scroll 0% 0%;">' +
        '<tbody>' +
        '<tr>' +
        '<td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0px; margin: 0px; padding: 20px 6.25%; width: 87.5%; background: rgb(112, 173, 71) none repeat scroll 0% 0%;"><a target="_blank" style="text-decoration: none;" href="' + default_set.HOST + '"><img width="200" vspace="0" hspace="0" height="" border="0" src="' + default_set.HOST + '/images/homelogo.png" alt="f2h" title="f2h Logo" style="' +
        'color: #555;' +
        'font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; border: none; display: block;"></a></td>' +
        '</tr>';
}

/* @function : getEmailFooter
 * @param    : NONE
 * @created  : 20062016
 * @modified :
 * @purpose  : function to get email footer
 * @return   : email header string
 * @private
 */
exports.getEmailFooter = function() {
    return '<tr>' +
        '<td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;' +
        'padding-top: 30px;"><hr width="100%" size="1" noshade="" color="#E0E0E0" align="center" style="margin: 0; padding: 0;"></td>' +
        '</tr>' +
        '       <tr>' +
        '<td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;' +
        'padding-top: 10px;' +
        'padding-bottom: 20px;' +
        'color: #828999;' +
        'font-family: sans-serif;"> Great Products, Good Price, Happy Farmers, Happy Manufacturers <br>' +
        'f2h team. </td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</body>' +
        '</html>';
}

exports.verifyBucket = function(name, callback) {
   S3.createBucket({
       Bucket: name
   }, function(err) {
       if (err) {
           callback(err);
       } else {
           callback(null, true);
       }
   })
}


exports.uploadFile = function(file, BUCKET_NAME, callback) {
    // console.log("uploadFile");
    var fileBuffer = fs.readFileSync(file.path);
    let cacheControlHeader = 'max-age=31536000';
    // Create upload file object
    S3.putObject({
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: fileBuffer,
        ContentType: file.type,
        CacheControl : cacheControlHeader
    }, function(err, data) {
        if (err) {
            console.log('s3',err);
            callback('Unable to save uploaded file');
        } else {
            console.log(data);
            callback(null, data);
        }
    });
}

exports.HOST_EMAIL = '**********';


exports.default_set = default_set;
    