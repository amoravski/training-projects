const router = require('koa-router');
const jwt = require('jsonwebtoken');

const pg = require('./postgre.js');
const cart_router = router({
    prefix: '/cart'
});

cart_router.get('/', get_cart);
cart_router.put('/', add_item_cart);
cart_router.delete('/', remove_from_cart);

async function get_cart(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    try {
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.jwt, secret);
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = {status:"incorrect params", message: err.message};
        return;
    }

    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const cart_result = await pg.get_cart(decoded.id);
        ctx.response.status = 200;
        ctx.body = cart_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function add_item_cart(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    const params = ctx.request.body;
    try {
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(params.jwt, secret);
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = {status:"incorrect params", message: err.message};
        return;
    }
    try {
        const cart_result = await pg.add_item_cart(decoded.id, params.product_id, params.quantity);
        ctx.response.status = 200;
        ctx.body = cart_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function remove_from_cart(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");

    params = ctx.request.query;
    if(!(params.id)) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing parameter"};
        return;
    }

    try {
        const product_remove_result = await pg.remove_from_cart(params.id);
        ctx.response.status = 200;
        ctx.body = product_remove_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = cart_router;
