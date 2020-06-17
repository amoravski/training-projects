/**
 * Dispatch Orders API
 */

const router = require('koa-router');
const pg = require('./postgre.js');
const dispatchRouter = router({
    prefix: '/dispatch'
});

dispatchRouter.post('/', dispatchOrder);

async function dispatchOrder(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        var params = ctx.request.body;
        var id = params.id
        if(!id) {
            throw 'Missing id';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        const resDispatchOrder = await pg.dispatchOrder(id);
        ctx.response.status = 200;
        ctx.response.body = resDispatchOrder;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

module.exports = dispatchRouter;
