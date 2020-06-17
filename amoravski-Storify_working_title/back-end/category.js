"use strict";

const router = require('koa-router');
const pg = require('./postgre.js');
const categoryRouter = router({
    prefix: '/category'
});
categoryRouter.get('/', getCategories);

async function getCategories(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const categoryListResult = await pg.getCategories();
        ctx.response.status = 200;
        ctx.body = categoryListResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = categoryRouter;
