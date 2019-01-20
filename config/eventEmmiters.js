const EventEmitter = require('events');
const async = require('async');
const lodash = require('lodash');
const mongoose = require('mongoose');
const DB = require('../db.js');
const common = require('./common');
const nodemailer = require('nodemailer');
const UserModel = DB.UserModel();
//create custom event class
class appEventEmitter extends EventEmitter {}
const appEmitter = new appEventEmitter();

appEmitter.setMaxListeners(0);

let transporter = nodemailer.createTransport({
    service:'gmail', // true for 465, false for other ports
    auth: {
        user: common.default_set.EMAIL_FROM, // generated ethereal user
        pass: common.default_set.EMAIL_FROM_PASS // generated ethereal password
    }
});

appEmitter.on('send_verification_email', function(params) {
    var param = {
        email: params.email,
        role: params.role
    }
    UserModel.findOne(param, function(err, result) {
        if (err) {
            console.log('dberror', err);
        } else {
            if (result) {
                var terms_link = '#';
                var resetDate = new Date().setHours(new Date().getHours() + 1);
                var hash = DB.generateHash(params.id + "?=" + resetDate);
                var body = common.getEmailHeader() +
                    '<tr>' +
                    '<td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0px; margin: 0px;"><a href="' + common.default_set.HOST + '" style="text-decoration: none;" target="_blank"><img width="600" vspace="0" hspace="0" border="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;          padding-top: 25px;          padding-bottom: 5px;" title="" alt="dealsTick" src="' + common.default_set.HOST + '/assets/images/email_images/default-img.png"></a></td>' +
                    '</tr>' +
                    '<tr>' +
                    ' <td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;' +
                    ' padding-top: 5px;' +
                    'color: #555;' +
                    'font-family: sans-serif;" >You are just one click away...</td>' +
                    '</tr>' +
                    '<tr>' +
                    ' <td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 14px; font-weight: 400; line-height: 150%; letter-spacing: 2px;' +
                    'padding-top: 27px;' +
                    'padding-bottom: 0;' +
                    'color: #555;' +
                    'font-family: sans-serif;"><a href="' + common.default_set.HOST + '">WHAT\'S dealsTick?</a></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;' +
                    'padding-top: 15px;' +
                    'color: #555;' +
                    'font-family: sans-serif;">You\'re almost done — just click the link below to verify your email address and you\'re all set.</td>' +
                    '</tr>' +
                    '                <tr>' +
                    '                  <td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;' +
                    '           padding-top: 25px;' +
                    '           padding-bottom: 5px;"><a href="' + common.default_set.HOST + '" target="_blank" style="text-decoration: underline;">' +
                    '                    <table cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">' +
                    '                      <tbody>' +
                    '                        <tr>' +
                    '                        <td valign="middle" bgcolor="#F2AC00" align="center" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"><a target="_blank" style="text-decoration: underline;' +
                    '                   color: #fff; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="' + common.default_set.HOST + '/#/verifyEmail/' + hash + '">Verify your account</a></td>' +
                    '                        </tr>' +
                    '                       <tr>' +
                    '<td valign="middle" align="center" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"><a target="_blank" style="text-decoration: underline;' +
                    '                   color: #ccc; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="' + common.default_set.HOST + '/#/' + terms_link + '">Terms and Privacy Policy</a></td>' +
                    '                        </tr>' +
                    '                       </tr>' +
                    '                      </tbody>' +
                    '                    </table>' +
                    '                    </a></td>' +
                    '                </tr>' + common.getEmailFooter();
                let mailOptions = {
                    from: common.default_set.EMAIL_FROM, // sender address
                    to: params.email, // list of receivers
                    subject: 'dealsTick - Account Email Verification', // Subject line
                    html: body // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                    	console.log('nodemailer error', error);
                        console.log("emiter error verification email", err);
                    } else {
                    	console.log("success");
                    }
                });
            } else {
                console.log("emiter error verification email");
            }
        }
    })

});

appEmitter.on('order_status', function(params) {
    var tableString = "";
    var items = "";

    lodash.forEach(params.products, function(itemData){
        items += '<tr>' +
            '  <td align="left" style="padding:5px;">' + itemData.name +'</td>' +
            '  <td align="left" style="padding:5px;">₹' + itemData.priceEachItem + '/' + itemData.stockType +'</td>' +
            '  <td align="left" style="padding:5px;">' + itemData.quantity + '</td>' +
            '  <td align="left" style="padding:5px;">₹' + params.orderNetAmount.toFixed(2) + '</td>' +
            '</tr>';
    });

    if (params.status === 'Placed') {
        tableString = '<tr>' +

        '<td valign="top" align="center" class="list-item" style="border-collapse: collapse; border-spacing: 0px; margin: 0px; float: left; width: 100%; padding: 20px 0px 20px 40px;"><table cellspacing="0" cellpadding="0" border="1" style="margin: 0px; padding: 0px; border-collapse: collapse; border-spacing: 0px;" align="center" width="100%">' +
        '<tbody><tr>' +
        '<th align="left" style="padding:5px;">Item</th>' +
        '<th align="left" style="padding:5px;">Price (each)</th>' +
        '<th align="left" style="padding:5px;">Quantity</th>' +
        '<th align="left" style="padding:5px;">Total</th>' +
        '</tr>' +
        items +
        '<tr>' +
        '<td align="left" style="padding:5px;"><strong>GST</strong></td>' +
        '<td align="left" style="padding:5px;"></td>' +
        '<td align="left" style="padding:5px;"></td>'+
        '<td align="left" style="padding:5px;">₹' + params.gst_tax.toFixed(2) + '</td>'+
        '</tr>' +
        '<tr>' +
        '<td align="left" style="padding:5px;"><strong>Delivery Charges</strong></td>' +
        '<td align="left" style="padding:5px;"></td>' +
        '<td align="left" style="padding:5px;"></td>'+
        '<td align="left" style="padding:5px;">₹' + params.delivery_charge.toFixed(2) + '</td>'+
        '</tr>' +
        '<tr>' +
        '<td align="left" style="padding:5px;"><strong>Order Total</strong></td>' +
        '<td align="left" style="padding:5px;"></td>' +
        '<td align="left" style="padding:5px;"></td>' +
        '<td align="left" style="padding:5px;">₹' + params.amountPaid + '</td>'+
        '</tr>' +
        '</tbody></table></td>' +
        '</tr>';
    }
    
    var body = common.getEmailHeader() +
        '<tr>' +
        '   <td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;"' +
        '       padding-top: 25px;' +
        '       color: #000000;' +
        '       font-family: sans-serif;">Track your order at every step of the way</td>' +
        '</tr>' +
        '<tr>' +
        '   <td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0px; margin: 0px; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%; color: rgb(0, 0, 0); font-family: sans-serif; padding: 0px 6.25%;"> Dear ' + params.customerName + ', <br/><br/> Thank you for your order. Please check below link for more details.</td>' +
        '</tr>' +
        '<tr>' +
        '   <td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0px; margin: 0px; width: 87.5%;"><a href="" target="_blank" style="text-decoration: underline;">' +
        '           <table cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tbody><tr><td valign="middle" bgcolor="" align="center" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"><a target="_blank" style="text-decoration: underline;                  color:#F2AC00; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="' + params.orderUrl + '">Track your order</a>' +
        '       </td></tr></tbody></table></a>' +
        '   </td>' +
        '</tr>' +
        '<tr>' +
        '<td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0px; margin: 0px; font-size: 18px;"><strong>Your Order is ' + params.status + '</strong></td>' +
        '</tr>' +
        '<tr>' +
        tableString + common.getEmailFooter();

    let mailOptions = {
        from: common.default_set.EMAIL_FROM, // sender address
        to: params.customerEmail, // list of receivers
        subject: 'dealsTick - Order Status', // Subject line
        html: body // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('nodemailer error', error);
            console.log("emiter error verification email", error);
        } else {
            console.log("success");
        }
    });
            

});

module.exports = appEmitter;