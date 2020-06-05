/**
 * Admin account CRUD
 */

const router = require('koa-router');
const pg = require('./postgre.js');
const adminRouter = router({
    prefix: '/admin'
});

adminRouter.get('/', getAdmins);
adminRouter.post('/', newAdmin);
adminRouter.put('/', updateAdmin);
adminRouter.delete('/', deleteAdmin);

async function getAdmins(ctx) {
    ctx.set("Access-Control-Allow-Origin", "*");
    const filter = ctx.request.query ? ctx.request.query : {};
    id = filter.id;
    userName = filter.userName;
    email = filter.email;

    try {
        ctx.response.status = 200;
        const resGetAdmins = await pg.getAdmins(id, userName, email);
        ctx.response.body = resGetAdmins;
        return;
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {status: 'internalError', error: err.message};
        return;
    }
}

async function newAdmin(ctx) {
    const params = ctx.request.body;
    try {
        const userName = params.userName;
        const email = params.email;
        const password = params.password;
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

    try {
        const newAdminResult = await pg.newAdmin(params.userName, params.email, params.password);
        ctx.response.status = 200;
        ctx.body = newAdminResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function updateAdmin(ctx) {
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
        const updateAdminResult = await pg.updateAdmin(id, userName, email, password);
        ctx.response.status = 200;
        ctx.body = updateAdminResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

async function deleteAdmin(ctx) {
    const filter = ctx.request.query ? ctx.request.query : {};
    const id = filter.id;
    try {
        const deleteAdminResult = await pg.deleteAdmin(id);
        ctx.response.status = 200;
        ctx.body = deleteAdminResult;
        return;
    } catch(err) {
        ctx.response.status = 500;
        // Return error message only in debug!
        ctx.body = {status:"internalError", message: err.message};
        return;
    }
}

module.exports = adminRouter;
