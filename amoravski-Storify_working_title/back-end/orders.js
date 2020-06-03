const router = require('koa-router');
const pg = require('./postgre.js');
const orders_router = router({
    prefix: '/orderTEMP'
});

orders_router.get('/', get_orders);

async function get_orders(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const order_list_result = await pg.get_orders(filter.id,filter.name,filter.tag,filter.lowerPrice,filter.upperPrice,filter.sort,filter.ord,filter.limit,filter.offset);
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
