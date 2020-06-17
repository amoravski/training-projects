/**
 * Forgotten password API
 */

const router = require('koa-router');
const pg = require('./postgre.js');
const forgotRouter = router({
    prefix: '/forgot'
});

forgotRouter.get('/', sendResetEmail);
forgotRouter.post('/', resetPassword);

async function resetPassword(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        var params = ctx.request.body;
        var id = params.id;
        var password = params.password;
        if(!(id&&password)) {
            throw 'Missing arguments';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        const resResetPassword = await pg.resetPassword(id,password);
        if(resResetPassword.status != "ok") {
            ctx.response.status = 400;
            ctx.response.body = resResetPassword;
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = resResetPassword;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function sendResetEmail(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        var email = filter.email;
        if(!email) {
            throw 'Missing email';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        const resSendEmail = await pg.sendResetEmail(email);
        ctx.response.status = 200;
        ctx.response.body = resSendEmail;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

module.exports = forgotRouter;
