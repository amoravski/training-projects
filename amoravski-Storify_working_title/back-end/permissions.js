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
        /*
        var decoded = jwt.verify(token, secret);
        if(!decoded.roles.includes('user_admin')) {
            throw "Unauthorized";
        }
        */
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resPermissions = await pg.getPermissions();
        ctx.response.body = resPermissions;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function getRolePermissions(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        id = filter.id;
        /*
        var decoded = jwt.verify(token, secret);
        if(!decoded.roles.includes('user_admin')) {
            throw "Unauthorized";
        }
        */
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resGetRolePermissions = await pg.getRolePermissions(id);
        ctx.response.body = resGetRolePermissions;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function addPermission(ctx) {
    try {
        params = ctx.request.body;
        permissionId = params.permissionId
        roleId = params.roleId;
        if(!(user_name && email)) {
            throw 'Missing params';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateAccountResult = await pg.addRole(permissionId, roleId);
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
    const filter = ctx.request.query ? ctx.request.query : {};
    const permissionId = filter.permissionId;
    const roleId = filter.roleId;
    try {
        const removeRoleResult = await pg.removePermission(userId, roleId);
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
