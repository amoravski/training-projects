/**
 * Account CRUD
 */

const router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken');
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
    try {
        const filter = ctx.request.query ? ctx.request.query : {};
        id = filter.id;
        userName = filter.userName;
        email = filter.email;
        status = filter.status;
        lowerDate = filter.lowerDate;
        upperDate = filter.upperDate;
        token = filter.token;
        const secret = process.env.JWT_SECRET || 'secret';
        var decoded = jwt.verify(token, secret);
        if(!decoded.roles.includes('user_admin')) {
            throw "Unauthorized";
        }
    } catch(err) {
        ctx.response.status = 400;
        ctx.response.body = {status: 'userError', error: err.message};
        return;
    }

    try {
        ctx.response.status = 200;
        const resGetAccounts = await pg.getAccounts(id, userName, email, status, lowerDate, upperDate);
        ctx.response.body = resGetAccounts;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function newAccount(ctx) {
    const params = ctx.request.body;
    try {
        const userName = params.userName;
        const email = params.email;
        const password = params.password;
        const address = params.address;
        const phone = params.phone;
        const recaptchaToken = params.recaptchaToken;
        if(!(userName && email && password)) {
            throw 'Missing params';
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            throw 'Invalid Email';
        }
        if(!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password))) {
            throw 'Invalid Password';
        }
        const availability = await pg.checkAvailability(userName, email);
        if(availability.status != 'ok') {
            throw availability.message;
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: err};
        return;
    }

    const verifyCaptchaOptions = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        json: true,
        form: {
            secret: '6LfC1KYZAAAAAIJE7gA5St_20ZsXuy5wYNRxWXsv',
            response: params.recaptchaToken
        }
    };

    request.post(verifyCaptchaOptions, function (err, response, body) {
            if (err) {
                ctx.response.status = 500;
                // Return error message only in debug!
                ctx.body = {status:"internalError", message: err.message};
                return;
            }

            if (!body.success) {
                ctx.response.status = 500;
                // Return error message only in debug!
                ctx.body = {status:"internalError", message: err.message};
                return;
            }
        }
    );

    try {
        const newAccountResult = await pg.newAccount(params.userName, params.email, params.password, params.address, params.phone);
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
        user_name = params.user_name;
        email = params.email;
        password = params.password;
        created_at = params.created_at;
        if(!(user_name && email)) {
            throw 'Missing params';
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.body = {status:"userError", message: "Missing params"};
        return;
    }

    try {
        const updateAccountResult = await pg.updateAccount(id, user_name, email, password, created_at);
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
    const id = filter.id;
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
}

module.exports = accountRouter;
