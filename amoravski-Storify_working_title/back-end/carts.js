const router = require('koa-router');
const pg = require('./postgre.js');
const cart_router = router({
    prefix: '/cart'
});

cart_router.get('/', get_cart);
cart_router.put('/', add_item_cart);

async function get_cart(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};

    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const cart_result = await pg.get_cart(filter.user_id);
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

async function make_cart(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const cart_result = await pg.make_cart();
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
        console.log(params);
        const cart_result = await pg.add_item_cart(params.user_id, params.product_id, params.quantity);
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

module.exports = cart_router;
