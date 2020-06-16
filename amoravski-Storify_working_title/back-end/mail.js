"use strict";
const nodemailer = require('nodemailer');
const router = require('koa-router');

var transporter = nodemailer.createTransport('smtps://storifytest1%40gmail.com:storify12@smtp.gmail.com');

async function sendVerificationEmail(randomId, email) {
    var mailOptions = {
        from: '"Storify" <storifytest1@gmail.com>',
        to: email,
        subject: 'Storify Account Activation',
        text: 'Please click this link to activate your account: ' + 'http://localhost:8080/verify?verificationId=' + randomId,
        html: 'Please click this link to activate your account: ' + 'http://localhost:8080/verify?verificationId=' + randomId
    };
    sendMail(mailOptions);
}

async function sendResetEmail(randomId, email) {
    var mailOptions = {
        from: '"Storify" <storifytest1@gmail.com>',
        to: email,
        subject: 'Storify Password Reset',
        text: 'Please click this link to reset your password: ' + 'http://localhost:8080/forgot?resetId=' + randomId,
        html: 'Please click this link to reset your password: ' + 'http://localhost:8080/forgot?resetId=' + randomId
    };
    sendMail(mailOptions);
}
async function sendMail(mailOptions) {
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.sendResetEmail = sendResetEmail;
