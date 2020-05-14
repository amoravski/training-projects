/**
 * Account CRUD
 */

const router = require('koa-router');
const pg = require('./postgre.js');
const accountRouter = router({
    prefix: '/account'
});

accountRouter.get('/', getAccounts);
accountRouter.post('/', newAccount);
accountRouter.put('/', updateAccount);
accountRouter.delete('/', deleteAccount);

async function getAccounts(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    const filter = ctx.request.query ? ctx.request.query : {};
    id = filter.id;
    userName = filter.userName;
    email = filter.email;

    try {
        ctx.response.status = 200;
        const resGetAccounts = await pg.getAccounts(id, userName, email);
        ctx.response.body = resGetAccounts;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function newAccount(ctx) {
    try {
        params = ctx.request.body;
        userName = params.userName;
        email = params.email;
        password = params.password;
        if(!(userName && email && password)) {
            throw 'Missing params';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const newAccountResult = await pg.newAccount(userName, email, password);
        ctx.response.status = 200;
        ctx.body = newAccountResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function updateAccount(ctx) {
    try {
        params = ctx.request.body;
        id = params.id
        userName = params.userName;
        email = params.email;
        password = params.password;
        if(!(userName && email && password)) {
            throw 'Missing params';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateAccountResult = await pg.updateAccount(id, userName, email, password);
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

async function deleteAccount(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    id = filter.id;
    try {
        const deleteAccountResult = await pg.deleteAccount(id);
        ctx.response.status = 200;
        ctx.body = deleteAccountResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
    return;
}

module.exports = accountRouter;
