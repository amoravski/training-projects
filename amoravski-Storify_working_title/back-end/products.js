/**
 * @fileoverview API endpoints for product resource
 */
"use strict";

const router = require('koa-router');
const pg = require('./postgre.js');
const jwt = require('jsonwebtoken');
const products_router = router({
    prefix: '/product'
});


// Add routes
products_router.get('/', get_products);
products_router.post('/', create_product);
products_router.put('/', update_product);
products_router.delete('/', remove_product);


/**
 * GET method for products
 * @params {Context} ctx : Request context
 * @returns {Null} : Function sets response context
 */
async function get_products(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};

    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const product_list_result = await pg.get_products(
            filter.id,
            filter.name,
            filter.tag,
            filter.lowerPrice,
            filter.upperPrice,
            filter.lowerQuantity,
            filter.upperQuantity,
            filter.sort,
            filter.ord,
            filter.limit,
            filter.offset,
            filter.returnCount
        );
        ctx.response.status = 200;
        ctx.body = product_list_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}


/**
 * POST method for products, checks for required params
 * @params {Context} ctx : Request context
 * @returns {Null} : Function sets response context
 */
async function create_product(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    // Throws error if request isn't multipart

    try {
        var params = ctx.request.body;
        var token = params.token;
        if(!token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'products_c');
        console.log(permissions);
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        var file = ctx.request.files.file;
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: err.message};
        return;
    }

    // Check if required params are defined
    if(!(params.name && params.price && params.quantity && file)) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing parameter"};
        return;
    }
    try {
        const product_create_result = await pg.create_product(params.name, params.price, params.quantity, file.path, params.tags);
        ctx.response.status = 200;
        ctx.body = product_create_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}


/**
 * PUT method for products, checks for required params
 * @params {Context} ctx : Request context
 * @returns {Null} : Function sets response context
 */
async function update_product(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    // Throws error if request isn't multipart
    try {
        var params = ctx.request.body;
        var token = params.token
        if(!token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'products_u');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        var file = ctx.request.files.file;
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Incorrect type request"};
        return;
    }

    // Check if required params are defined
    if(!(params.id &&params.name && params.price && params.quantity && file)) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing parameter"};
        return;
    }

    try {
        const product_update_result = await pg.update_product(params.id, params.name, params.price, params.quantity, file.path, params.tags);
        ctx.response.status = 200;
        ctx.body = product_update_result;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}


/**
 * DELETE method for products
 * @params {Context} ctx : Request context
 * @returns {Null} : Function sets response context
 */
async function remove_product(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");

    try {
        var params = ctx.request.query;
        var token = params.token
        if(!token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'products_d');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        if(!(params.id)) {
            ctx.response.status = 400;
            ctx.body = {status:"userError", message: "Missing parameter"};
            return;
        }
    } catch(err) {
        ctx.response.status = 400;
        // Return error message only in debug!
        ctx.body = {status:"userError", message: err.message};
        return;
    }

    try {
        const product_remove_result = await pg.remove_product(params.id);
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


module.exports = products_router;
