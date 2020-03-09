const router = require('koa-router');
const pg = require('./postgre.js');
const products_router = router({
    prefix: '/product'
});

products_router.get('/', get_products);
products_router.post('/', create_product);
products_router.put('/', update_product);
products_router.delete('/', remove_product);

async function get_products(ctx) {
    filter = ctx.request.query ? ctx.request.query : {};
    products_list = await pg.get_products(filter);
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.body = {
        status: 'success',
        json: {
            products: products_list
        }
    };
}

async function create_product(ctx) {
    product_res = await pg.create_product(ctx.request.body);
    ctx.body = {
        status: 'success',
        json: {
            product: product_res
        }
    }
}

async function update_product(ctx) {
    product_res = await pg.update_product(ctx.request.body);
    ctx.body = {
        status: 'success',
        json: {
            product: product_res
        }
    }
}


async function remove_product(ctx) {
    product_res = await pg.remove_product(ctx.request.query);
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.body = {
        status: 'success',
        json: {
            product: product_res
        }
    }
}
module.exports = products_router;
