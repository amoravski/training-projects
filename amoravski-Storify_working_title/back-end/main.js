const Koa = require('koa');
const router = require('koa-router');
const bodyParser = require('koa-body');
const product = require('./products.js');

const app = new Koa();

//app.use(bodyParser({
//    formidable:{uploadDir: './uploads'},
//    multipart: true,
//    urlencoded: true
//}));


app.use(product.routes());
app.use(product.allowedMethods());

app.listen(3000);
