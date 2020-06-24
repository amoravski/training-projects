"use strict";
const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');
const koaCors = require('@koa/cors');
const formidable = require('koa2-formidable');
const router = require('koa-router');

const product = require('./products.js');
const category = require('./category.js');
const account = require('./accounts.js');
const admin = require('./admin.js');
const paypal = require('./paypal.js');
const order = require('./orders.js');
const cart = require('./carts.js');
const authentication = require('./authentication.js');
const verification = require('./verification.js');
const forgot = require('./forgot.js');
const dispatch = require('./dispatch.js');
const roles = require('./roles.js');
const permissions = require('./permissions.js');

const app = new Koa();

app.use(koaBody({
    multipart: true,
    formidable: { uploadDir: './upload', keepExtensions: true}
}));

// Enables CORS
app.use(koaCors());

// Routes
app.use(product.routes());
app.use(category.routes());
app.use(paypal.routes());
app.use(order.routes());
app.use(cart.routes());
app.use(account.routes());
app.use(admin.routes());
app.use(authentication.routes());
app.use(verification.routes());
app.use(forgot.routes());
app.use(dispatch.routes());
app.use(roles.routes());
app.use(permissions.routes());

// OPTIONS requests
app.use(product.allowedMethods());
app.use(category.allowedMethods());
app.use(paypal.allowedMethods());
app.use(order.allowedMethods());
app.use(cart.allowedMethods());
app.use(account.allowedMethods());
app.use(admin.allowedMethods());
app.use(authentication.allowedMethods());
app.use(verification.allowedMethods());
app.use(forgot.allowedMethods());
app.use(dispatch.allowedMethods());
app.use(roles.allowedMethods());
app.use(permissions.allowedMethods());

// Static files 
app.use(serve('./upload'));

app.listen(3000);
