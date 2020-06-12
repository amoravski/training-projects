const jwt = require('jsonwebtoken');
const router = require('koa-router');

const pg = require('./postgre.js');
const authenticationRouter = router({
    prefix: '/authentication'
});

authenticationRouter.post('/user', login);
authenticationRouter.post('/admin', loginAdmin);

async function login(ctx) {
    try {
        params = ctx.request.body;
        email = params.email;
        password = params.password;
        if(!(email && password)) {
            throw 'Missing parameter';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Improper request parameters"};
        return;
    }
    const loginResult = await pg.login(params.email, params.password);
    if(loginResult.status == 'ok') {
        const user = loginResult.account
        const payload = { email: user.email, userName: user.user_name, id: user.id, type: 'user' };
        const secret = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 4});
        ctx.body = {status:"ok", token: token};
    }
    else {
        ctx.response.status = 400;
        ctx.body = loginResult;
    }
}

async function loginAdmin(ctx) {
    try {
        params = ctx.request.body;
        email = params.email;
        password = params.password;
        if(!(email && password)) {
            throw 'Missing parameter';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Improper request parameters"};
        return;
    }
    const loginResult = await pg.loginAdmin(params.email, params.password);
    if(loginResult.status == 'ok') {
        const user = loginResult.account
        const payload = { email: user.email, userName: user.user_name, id: user.id, type: 'admin' };
        const secret = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 4});
        ctx.body = {status:"ok", token: token};
    }
    else {
        ctx.response.status = 400;
        ctx.body = loginResult;
    }
}

module.exports = authenticationRouter;
