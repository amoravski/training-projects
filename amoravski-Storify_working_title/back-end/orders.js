const router = require('koa-router');
const pg = require('./postgre.js');
const orders_router = router({
    prefix: '/orderTEMP'
});

orders_router.get('/', get_orders);

async function get_orders(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const order_list_result = await pg.get_orders();
        ctx.response.status = 200;
        ctx.body = order_list_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = orders_router;
