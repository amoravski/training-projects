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

    var query_string = 'SELECT products.id,products.name,products.price,products.quantity,tag_names.tag_name,products.created_at FROM products INNER JOIN tags ON products.id = tags.product LEFT OUTER JOIN tag_names ON tags.tag_name = tag_names.id';

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
            query_string += ` tag_names.tag_name ILIKE '%' || $${arg} || '%'`;
            appended = true;
            or_brace_flag = true;
        }
        else {
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` OR tag_names.tag_name ILIKE '%' || $${arg} || '%'`;
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
    response = await pool.query(query_string, args);
    pool.end();
    output = response.rows;
    
    ids_added = []
    products_added = []
    for(var i=0; i < output.length; i++) {
        if(ids_added.includes(output[i].id)) {
            products_added[ids_added.indexOf(output[i].id)].tags.push(output[i].tag_name);
        }
        else {
            ids_added.push(output[i].id)
            products_added.push({id: output[i].id, name: output[i].name, price: output[i].price, quantity: output[i].quantity, created_at: output[i].created_at, tags: [output[i].tag_name]})
        }
    }
    return products_added;
}

async function create_product(params) {
    const pool = new Pool(config);

    response = await pool.query(`INSERT INTO products (name, price, quantity, added_by, created_at) VALUES ($1, $2, $3, $4,to_timestamp($5)) RETURNING id;`, [params.name,params.price,params.quantity,params.added_by,params.created_at]);
    product_id = response.rows[0].id;
    await add_tags(params.tags, pool, product_id);
    pool.end()
    return response.rows;
}
    
async function update_product(params) {
    const pool = new Pool(config);
    response = await pool.query(`UPDATE products SET name=$1,price=$2,quantity=$3 WHERE id=$4;`, [params.name,params.price,params.quantity,params.id]);
    await pool.query('DELETE FROM tags WHERE id=$1',[params.id])
    await add_tags(params.tags, pool, params.id);
    pool.end()
    return response.rows;
}

async function add_tags(values_tags, pool, product_id) {
    values_tag_names = [];

    tags_query = '';
    tags_query_select = '';
    for(var i=0; i < values_tags.length; i++) {
        tags_query += `($${i+1}),`
        tags_query_select += `$${i+1},`;
    }
    tags_query = tags_query.substring(0, tags_query.length - 1);
    tags_query_select = tags_query_select.substring(0, tags_query_select.length - 1);
    await pool.query(`INSERT INTO tag_names (tag_name) VALUES ${tags_query} ON CONFLICT DO NOTHING;`, values_tags);
    tag_resp = await pool.query(`SELECT id,tag_name FROM tag_names WHERE tag_name IN (${tags_query});`, values_tags);
    tag_resp = tag_resp.rows;

    product_insert = []
    for(var i=0; i < tag_resp.length; i++) {
        product_insert.push(tag_resp[i].id);
        product_insert.push(product_id);
    }

    tags_insert = '';
    for(var i=0; i < product_insert.length; i+=2) {
        tags_insert += `($${i+1},$${i+2}),`
    }
    tags_insert = tags_insert.substring(0, tags_insert.length - 1);
    await pool.query(`INSERT INTO tags (tag_name, product) VALUES ${tags_insert};`, product_insert);
}

async function remove_product(params) {
    const pool = new Pool(config);
    await pool.query('DELETE FROM tags WHERE product=$1;',[params.id])
    result = await pool.query(`DELETE FROM products WHERE id='${params.id}';`);
}

module.exports.get_products = get_products;
module.exports.create_product = create_product;
module.exports.update_product = update_product;
module.exports.remove_product = remove_product;
