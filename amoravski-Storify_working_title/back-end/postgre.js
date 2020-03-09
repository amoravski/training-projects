const { Client, Pool } = require('pg')

const config = {
    user: 'amoravski',
    database: 'store',
    max: 10,
    password: 'strongboie',
    idleTimeoutMillis: 30000
};

async function get_products(filter) {
    const pool = new Pool(config);

    var query_string = `SELECT json_build_object('id',products.id, 'name', products.name, 'tag', tags.tag_name, 'price', products.price, 'quantity', products.quantity,'created_at', products.created_at) FROM products LEFT OUTER JOIN tags ON tags.id = products.tag`;
    var appended = false;
    var or_brace_flag = false;
    var arg = 1;
    var args = [];

    if(filter.name){
        if(!appended) {
            query_string += ` WHERE`;
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` products.name ILIKE '%' || $${arg} || '%'`;
            appended = true;
            or_brace_flag = true;
        }
        else {
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` OR products.name ILIKE '%' || $${arg} || '%'`;
            or_brace_flag = true;
        }
        arg++;
        args.push(filter.name);
    }
    if(filter.tag) {
        if(!appended) {
            query_string += ` WHERE`;
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` tags.tag_name ILIKE '%' || $${arg} || '%'`;
            appended = true;
            or_brace_flag = true;
        }
        else {
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` OR tags.tag_name ILIKE '%' || $${arg} || '%'`;
            or_brace_flag = true;
        }
        arg++;
        args.push(filter.tag);
    }
    if(filter.lowerPrice) {
        if(!appended) {
            query_string += ` WHERE products.price > $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND products.price > $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(filter.lowerPrice);
    }

    if(filter.upperPrice) {
        if(!appended) {
            query_string += ` WHERE products.price < $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND products.price < $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(filter.upperPrice);
    }
    query_string += or_brace_flag ? ')' : '';
    query_string += ';';
    console.log(query_string);
    response = await pool.query(query_string, args);
    pool.end();
    output = response.rows.map((x) => { return x.json_build_object });
    return output;
}

async function create_product(params) {
    const pool = new Pool(config);
    await pool.query(`INSERT INTO tags (tag_name) VALUES ('${params.tag}') ON CONFLICT DO NOTHING;`);
    result = await pool.query(`SELECT (id) FROM tags WHERE tag_name=$1;`, [params.tag]);
    tag_id = result.rows[0].id;
    response = await pool.query(`INSERT INTO products (name, price, quantity, tag, added_by, created_at) VALUES ($1, $2, $3, $4, $5,to_timestamp($6));`, [params.name,params.price,params.quantity,tag_id,params.added_by,params.created_at]);
    pool.end()
    return response.rows;
}
    
async function update_product(params) {
    const pool = new Pool(config);
    await pool.query(`INSERT INTO tags (tag_name) VALUES ('${params.tag}') ON CONFLICT DO NOTHING;`);
    result = await pool.query(`SELECT (id) FROM tags WHERE tag_name=$1;`, [params.tag]);
    tag_id = result.rows[0].id;
    response = await pool.query(`UPDATE products SET name=$1,price=$2,quantity=$3,tag=$4 WHERE id=$5;`, [params.name,params.price,params.quantity,tag_id,params.id]);
    pool.end()
    return response.rows;
}

async function remove_product(params) {
    const pool = new Pool(config);
    result = await pool.query(`DELETE FROM products WHERE id='${params.id}';`);
}

module.exports.get_products = get_products;
module.exports.create_product = create_product;
module.exports.update_product = update_product;
module.exports.remove_product = remove_product;
