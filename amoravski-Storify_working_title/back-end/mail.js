"use strict";
const nodemailer = require('nodemailer');
const router = require('koa-router');

const mailRouter = router({
    prefix: '/mail'
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: '767615363283-d9mkkt02c737gclfb2t1vuk0927eph5l.apps.googleusercontent.com',
        clientSecret: 'htmqFhXyVl-weZPnH4LdBbUy'
    }
});

mailRouter.get('/', test);

async function test(ctx) {
    transporter.sendMail({
        from: 
}
