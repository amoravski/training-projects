"use strict";
const router = require('koa-router');
const jwt = require('jsonwebtoken');
const pg = require('./postgre.js');
const rolesRouter = router({
    prefix: '/roles'
});

rolesRouter.get('/', getRoles);
rolesRouter.post('/', addRole);
rolesRouter.delete('/', removeRole);

rolesRouter.get('/user', getRolesUser);
rolesRouter.put('/user', addRoleUser);
rolesRouter.delete('/user', removeRoleUser);

rolesRouter.get('/interfaces', allowedInterfacesUser);

async function getRoles(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        /*
        const filter = ctx.request.query ? ctx.request.query : {};
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_r');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
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
        var params = ctx.request.body;
        console.log(params);
        if(!params.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(params.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_c');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        var roleName = params.roleName;
        if(!(roleName)) {
            throw { message: 'Missing params'};
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: err.message};
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
    try {
        var filter = ctx.request.query ? ctx.request.query : {};
        var roleId = filter.roleId;
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_d');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        const removeRoleResult = await pg.removeRole(roleId);
        ctx.response.status = 200;
        ctx.body = removeRoleResult;
        return;
    } catch(err) {
        ctx.response.status = 400;
        // Return error message only in debug!
        ctx.body = {status:"userError", message: err.message};
        return;
    }
}
async function getRolesUser(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_r');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
        id = filter.id;
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
        if(!params.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(params.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_c');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
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
    try {
        var filter = ctx.request.query ? ctx.request.query : {};
        var userId = filter.userId;
        var roleId = filter.roleId;
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        const permissions = await pg.verifyPermissions(decoded.roles, 'roles_d');
        if(permissions.status != 'ok') { 
            throw { message: "Unauthorized"};
        }
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

async function allowedInterfacesUser(ctx) { 
    try {
        var filter = ctx.request.query ? ctx.request.query : {};
        if(!filter.token) {
            throw { message: "Unauthorized"};
        }
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(filter.token, secret);
        /*
        var interfaces = [];
        var permissions = await pg.verifyPermissions(decoded.roles, 'products_r');
        if(permissions.status == 'ok') { 
            interfaces.push('products');
        }
        permissions = await pg.verifyPermissions(decoded.roles, 'orders_r');
        if(permissions.status == 'ok') { 
            interfaces.push('orders');
        }
        permissions = await pg.verifyPermissions(decoded.roles, 'users_r');
        if(permissions.status == 'ok') { 
            interfaces.push('users');
        }
        permissions = await pg.verifyPermissions(decoded.roles, 'roles_r');
        if(permissions.status == 'ok') { 
            interfaces.push('roles');
        }
        */
        const interfacesResult = await pg.allowedInterfacesUser(decoded.id);
        ctx.response.status = 200;
        ctx.body = {status: 'ok', interfaces: interfacesResult.interfaces};
        return;
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: err.message};
        return;
    }
}
module.exports = rolesRouter;
