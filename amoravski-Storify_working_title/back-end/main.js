const Koa = require('koa');
const koaBody = require('koa-body');
const koaCors = require('@koa/cors');
const router = require('koa-router');
const product = require('./products.js');

const app = new Koa();

app.use(koaBody());
app.use(koaCors());
app.use(product.routes());
app.use(product.allowedMethods());

app.listen(3000);
