"use strict";
const router = require('koa-router');
const jwt = require('jsonwebtoken');
const pg = require('./postgre.js');
const orderRouter = router({
    prefix: '/order'
});

orderRouter.get('/', getOrders);
orderRouter.put('/', updateOrder);
orderRouter.delete('/', deleteOrder);

async function getOrders(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        if(decoded.roles.includes('accountant')) {
            const orderListResult = await pg.getOrders(
                filter.id,
                filter.orderId,
                filter.name,
                filter.userName,
                filter.tag,
                filter.lowerPrice,
                filter.upperPrice,
                filter.lowerQuantity,
                filter.upperQuantity,
                filter.lowerDate,
                filter.upperDate,
                filter.sort,
                filter.ord,
                filter.limit,
                filter.offset,
                filter.userId,
                filter.status
            );
            ctx.response.status = 200;
            ctx.body = orderListResult;
            return;
        }
        else if(decoded.type == 'user') {
            const orderListResult = await pg.getOrders(
                filter.id,
                filter.orderId,
                filter.name,
                decoded.userName,
                filter.tag,
                filter.lowerPrice,
                filter.upperPrice,
                filter.lowerQuantity,
                filter.upperQuantity,
                filter.lowerDate,
                filter.upperDate,
                filter.sort,
                filter.ord,
                filter.limit,
                filter.offset,
                filter.userId,
                filter.status
            );
            ctx.response.status = 200;
            ctx.body = orderListResult;
            return;
        }
        else {
            ctx.response.status = 401;
            ctx.body = {status:"userError"};
            return;
        }
    } catch(err) {
        if ( err.message == "jwt must be provided") {
            ctx.response.status = 400;
            ctx.body = {status:"userError", message: err.message};
            return;
        }
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function updateOrder(ctx) {
    try {
        var params = ctx.request.body;
        var id = params.id
        var productId = params.productId;
        var value = params.value;
        var userId = params.userId;
        var quantity = params.quantity;
        var status = params.status;
        var startedAt = params.startedAt;
        if(!id) {
            throw 'Missing params';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateOrderResult = await pg.updateOrder(id, value, quantity, startedAt);
        ctx.response.status = 200;
        ctx.body = updateOrderResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function deleteOrder(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    var id = filter.id;
    try {
        const deleteOrderResult = await pg.deleteOrder(id);
        ctx.response.status = 200;
        ctx.body = deleteOrderResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = orderRouter;
