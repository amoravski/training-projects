"use strict";
const Koa = require('koa');
const koaBody = require('koa-body');
const serve = require('koa-static');
const koaCors = require('@koa/cors');
const formidable = require('koa2-formidable');
const router = require('koa-router');

const product = require('./products.js');
const account = require('./accounts.js');
const paypal = require('./paypal.js');
const order = require('./orders.js');
const cart = require('./carts.js');
const authentication = require('./authentication.js');

const app = new Koa();

app.use(koaBody({
    multipart: true,
    formidable: { uploadDir: './upload', keepExtensions: true}
}));

// Enables CORS
app.use(koaCors());

// Routes
app.use(product.routes());
app.use(paypal.routes());
app.use(order.routes());
app.use(cart.routes());
app.use(account.routes());
app.use(authentication.routes());

// OPTIONS requests
app.use(product.allowedMethods());
app.use(paypal.allowedMethods());
app.use(order.allowedMethods());
app.use(cart.allowedMethods());
app.use(account.allowedMethods());
app.use(authentication.routes());

// Static files 
app.use(serve('./upload'));

app.listen(3000);
