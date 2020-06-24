"use strict";
const router = require('koa-router');
const jwt = require('jsonwebtoken');
const pg = require('./postgre.js');
const rolesRouter = router({
    prefix: '/roles'
});

rolesRouter.get('/', getRoles);
rolesRouter.get('/', addRole);
rolesRouter.get('/', removeRole);

rolesRouter.get('/user', getRolesUser);
rolesRouter.put('/user', addRoleUser);
rolesRouter.delete('/user', removeRoleUser);

async function getRoles(ctx) {
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
        const resGetRoles = await pg.getRoles();
        ctx.response.body = resGetRoles;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function addRole(ctx) {
    try {
        params = ctx.request.body;
        roleName = params.roleName;
        if(!(roleName)) {
            throw 'Missing params';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateAccountResult = await pg.addRole(roleName);
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

async function removeRole(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    const roleId = filter.roleId;
    try {
        const removeRoleResult = await pg.removeRole(roleId);
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
async function getRolesUser(ctx) {
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
        const resGetRoles = await pg.getRolesUser(id);
        ctx.response.body = resGetRoles;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function addRoleUser(ctx) {
    try {
        params = ctx.request.body;
        userId = params.id
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
        const updateAccountResult = await pg.addRoleUser(userId, roleId);
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

async function removeRoleUser(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    const userId = filter.userId;
    const roleId = filter.roleId;
    try {
        const removeRoleResult = await pg.removeRoleUser(userId, roleId);
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
module.exports = rolesRouter;
