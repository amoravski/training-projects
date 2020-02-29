const { Client } = require('pg')

async function pg_get_products() {
    const str = "postgres://amoravski@localhost:5432/store"
    const { Client } = require('pg')
    const client = new Client(str);
    await client.connect()
    const res = await client.query('SELECT NOW()')
    await client.end()
    return res;
}

module.exports.pg_get_products = pg_get_products;
