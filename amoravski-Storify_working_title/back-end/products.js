const router = require('koa-router');
const pg = require('./postgre.js');
const products_router = router({
    prefix: '/product'
});

products_router.get('/', get_products);

async function get_products(ctx) {
    products_list = pg.pg_get_products();
    ctx.body = {
        satus: 'success',
        json: {
            id: '1',
            dog: products_list
        }
    };
}

module.exports = products_router;
