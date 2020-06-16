/**
 * Email Verification API
 */

const router = require('koa-router');
const pg = require('./postgre.js');
const verificationRouter = router({
    prefix: '/verification'
});

verificationRouter.get('/', verifyAccount);
verificationRouter.post('/', sendVerificationEmail);

async function verifyAccount(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        id = filter.id;
        if(!id) {
            throw 'Missing id';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resVerifyAccount = await pg.verifyAccount(id);
        ctx.response.body = resVerifyAccount;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function sendVerificationEmail(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    try {
        var params = ctx.request.body;
        var email = params.email;
        if(!email) {
            throw 'Missing email';
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        const resVerifyAccount = await pg.sendVerificationEmail(email);
        ctx.response.status = 200;
        ctx.response.body = resVerifyAccount;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

module.exports = verificationRouter;
