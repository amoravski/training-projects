"use strict";
const router = require('koa-router');
const jwt = require('jsonwebtoken');
const pg = require('./postgre.js');
const permissionsRouter = router({
    prefix: '/permissions'
});

permissionsRouter.get('/all', getPermissions);
permissionsRouter.get('/', getRolePermissions);
permissionsRouter.put('/', addPermission);
permissionsRouter.delete('/', removePermission);

async function getPermissions(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        if(pg.verifyPermissions(decoded.roles, 'roles_r').status != 'ok') { 
            throw { message: "Unauthorized"};
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', message: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resPermissions = await pg.getPermissions();
        ctx.response.body = resPermissions;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', message: err.message};
        return;
    }
}

async function getRolePermissions(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        var id = filter.id;
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_r');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', message: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resGetRolePermissions = await pg.getRolePermissions(id);
        ctx.response.body = resGetRolePermissions;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', message: err.message};
        return;
    }
}

async function addPermission(ctx) {
    try {
        var params = ctx.request.body;
        if(!params.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(params.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_c');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        var permissionId = params.permissionId
        var roleId = params.roleId;
        if(!(roleId && permissionId)) {
            throw { message: "Unauthorized"};
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateAccountResult = await pg.addPermission(permissionId, roleId);
        ctx.response.status = 200;
        ctx.body = updateAccountResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function removePermission(ctx) {
    try {
        var filter = ctx.request.query ? ctx.request.query : {};
        var permissionId = filter.permissionId;
        var roleId = filter.roleId;
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(params.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_d');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        const removeRoleResult = await pg.removePermission(permissionId, roleId);
        ctx.response.status = 200;
        ctx.body = removeRoleResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = permissionsRouter;
