/**
 * @fileoverview Controls all postgre specific code
 */
"use strict";

const { Client, Pool } = require('pg');
const fs = require('fs');
const ini = require('ini');
const bcrypt = require('bcrypt');
const mail = require('./mail.js');

const config_ini = ini.parse(fs.readFileSync('./config.ini', 'utf8'));
const config = {
    user: config_ini.database.user,
    database: config_ini.database.database,
    max: config_ini.database.max,
    password: config_ini.database.password
};

/**
 * Retrieves an ordered and filtered list of products
 * @param {String} id : If present, filters by id
 * @param {String} name : If present, filters by name
 * @param {String} tag : If present, filters by tags
 * @param {String} lowerPrice : If present, sets a lower price bound
 * @param {String} upperPrice : If present, sets a upper price bound
 * @param {String} sort : If present, selects by which field to sort (name, price, etc.)
 * @param {String} ord : If present, returns records ascended/descended
 * @param {Integer} limit : If present, only returns that many rows
 * @param {Integer} offset : If present, offsets returned rows
 * @return {Object} : Object with field products (restricted by LIMIT) and field count(all products matching the query)
 */
async function get_products(id,name,tag,lowerPrice,upperPrice,lowerQuantity,upperQuantity,sort,ord,limit,offset,returnCount) {
    // Connect to DB
    const pool = new Pool(config);

    // Build up the formatted query
    let query_string = 'SELECT products.id,products.name,products.price,products.quantity,json_agg(tag_names.tag_name),products.created_at,products.picture_path FROM products INNER JOIN tags ON products.id = tags.product LEFT OUTER JOIN tag_names ON tags.tag_name = tag_names.id WHERE products.quantity > 0 AND products.status <> \'removed\'';

    //We need the whole brace and OR business because otherwise we could bypass the hard limits like
    //not returning removed products
    //Flag to control if AND was appended already
    let appended = false;
    //Flag to control if and when braces are appended
    let or_brace_flag = false;

    // List of args to be passed to formatted query
    let args = [];
    // Number of current arg
    let arg = 1;

    // ID filtering, no or braces to make it specific
    if(id){
        query_string += ` AND`;
        query_string += ` products.id = $${arg}`;
        arg++;
        args.push(id);
    }

    // Name filtering
    if(name){
        if(!appended) {
            query_string += ` AND`;
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
        args.push(name);
    }

    // Tag filtering
    if(tag) {
        if(!appended) {
            query_string += ` AND`;
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
        args.push(tag);
    }

    // Price Upper and Lower Bound filtering
    if(lowerPrice) {
        if(!appended) {
            query_string += ` AND products.price >= $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND products.price >= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(lowerPrice);
    }
    if(upperPrice) {
        if(!appended) {
            query_string += ` AND products.price <= $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND products.price <= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(upperPrice);
    }

    // Quantity Upper and Lower Bound filtering
    if(lowerQuantity) {
        if(!appended) {
            query_string += ` AND products.quantity >= $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND products.quantity >= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(lowerQuantity);
    }
    if(upperQuantity) {
        if(!appended) {
            query_string += ` AND products.quantity <= $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND products.quantity <= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(upperQuantity);
    }
    // Closes brackets if they were still open
    query_string += or_brace_flag ? ')' : '';

    // For grouping tags
    query_string += ` GROUP BY products.id`;

    // Ordering
    query_string += ` ORDER BY `;
    switch(sort) {
        case 'id':
            query_string+=('products.id');
            break;
        case 'name':
            query_string+=('products.name');
            break;
        case 'price':
            query_string+=('products.price');
            break;
        case 'quantity':
            query_string+=('products.quantity');
            break;
        case 'timestamp':
            query_string+=('products.created_at');
            break;
        default:
            query_string+=('products.id');
    }

    if(ord=="desc") {
        query_string += ' DESC';
    }
    else{
        query_string += ' ASC';
    }

    let count_string = query_string;
    let args_count = args.slice();
    
    // Limit number of records
    if(limit) {
        args.push(limit);
        query_string += ` LIMIT $${arg}`;
        arg++;
    }

    // Offset records
    if(offset) {
        args.push(offset);
        query_string += ` OFFSET $${arg}`;
        arg++;
    }
    query_string += ';';

    // Make queries
    var users;
    pool.connect(function(err, client, done) {
        users = client.query('SELECT * FROM users;');
        done();
    });
    const response = await pool.query(query_string, args);
    let output = response.rows;

    if(returnCount == "true") {
        const response_count = await pool.query(count_string, args_count);
        var count = response_count.rows.length;
    }

    //Close connection
    pool.end();

    // Build up response object
    let products = [];
    for(let i=0; i < output.length; i++) {
        products.push({id: output[i].id, name: output[i].name, price: output[i].price, quantity: output[i].quantity, created_at: output[i].created_at, tags: output[i].json_agg, picture_path: 'http://localhost:3000/' + output[i].picture_path.split('/')[1]});
    }

    if(returnCount == "true"){
        return {status: "ok", products: products, count: count};
    }
    return {status: "ok", products: products};
}


/**
 * Creates a new product
 * @param {String} name : Name of product, required
 * @param {String} price : Price of product, required
 * @param {String} quantity : Quantity of product, required
 * @param {String} file_path : Path to picture of product, required
 * @param {JSON} tags : List of tags
 * @return {Object} : Result object
 */
async function create_product(name,price,quantity,file_path,tags) {
    //Open connection
    const pool = new Pool(config);

    //TO-DO: Replace placeholder ID when accounts are added
    let added_by = 2;

    //Get current moment in epoch
    let created_at = Math.floor(new Date() / 1000);

    let response = await pool.query(`INSERT INTO products (name, price, quantity, added_by, created_at, picture_path) VALUES ($1, $2, $3, $4,to_timestamp($5), $6) RETURNING id;`, [name,price,quantity,added_by,created_at,file_path]);
    let product_id = response.rows[0].id;

    await add_tags(JSON.parse(tags), pool, product_id);

    //Close connection
    pool.end();
    return {status:"ok", id:product_id};
}


/**
 * Updates a product
 * @param {Integer} id : Product to be changed, required
 * @param {String} name : Name to be changed to, required
 * @param {Integer} price : Price to be changed to, required
 * @param {Integer} quantity : Quantity to be changed to, required
 * @param {JSON} tags : Tags to be changed to, required
 * @param {String} file_path : Path to picture to be changed to, required
 * @return {Object} : Result object
 */
async function update_product(id,name,price,quantity,file_path,tags) {
    // Connect to DB
    const pool = new Pool(config);

    const response = await pool.query(`UPDATE products SET name=$1,price=$2,quantity=$3,picture_path=$4 WHERE id=$5;`, [name,price,quantity,file_path,id]);
    const tag_response = await pool.query('DELETE FROM tags WHERE product=$1',[id])

    await add_tags(JSON.parse(tags), pool, id);

    // Close connection
    pool.end()
    return {status: 'ok'};
}


/**
 * Adds tags, if they don't exist in table makes entries for them
 * @param {List} values_tags : tag names to be added
 * @param {Connection} pool : connection to postgre db
 * @param {Integer} product_id : Id to associate tags with
 * @return {Object} : Result message
 */
async function add_tags(values_tags, pool, product_id) {
    let values_tag_names = [];

    let tags_query = '';
    let tags_query_select = '';
    for(let i=0; i < values_tags.length; i++) {
        tags_query += `($${i+1}),`
        tags_query_select += `$${i+1},`;
    }
    tags_query = tags_query.substring(0, tags_query.length - 1);
    tags_query_select = tags_query_select.substring(0, tags_query_select.length - 1);
    await pool.query(`INSERT INTO tag_names (tag_name) VALUES ${tags_query} ON CONFLICT DO NOTHING;`, values_tags);
    let tag_resp = await pool.query(`SELECT id,tag_name FROM tag_names WHERE tag_name IN (${tags_query});`, values_tags);
    tag_resp = tag_resp.rows;

    let product_insert = []
    for(let i=0; i < tag_resp.length; i++) {
        product_insert.push(tag_resp[i].id);
        product_insert.push(product_id);
    }

    let tags_insert = '';
    for(let i=0; i < product_insert.length; i+=2) {
        tags_insert += `($${i+1},$${i+2}),`
    }
    tags_insert = tags_insert.substring(0, tags_insert.length - 1);
    await pool.query(`INSERT INTO tags (tag_name, product) VALUES ${tags_insert};`, product_insert);
}


/**
 * Changes the status of a product to "removed"
 * @param {Integer} id: ID of product
 * @return {Object} : Result
 */
async function remove_product(id) {
    //Open connection
    const pool = new Pool(config);
    const result = await pool.query(`UPDATE products SET status='removed' WHERE id=$1;`, [id]);

    // Close connection
    pool.end()
    return {status: 'ok'};
}


async function getOrders(id,orderId,name,userName,tag,lowerPrice,upperPrice,lowerQuantity,upperQuantity, lowerDate, upperDate, sort,ord,limit,offset, userId, status) {
    //Open connection
    const pool = new Pool(config);

    // Build up the formatted query
    let query_string = "SELECT orders.id, orders.paypal_id, products.name, users.user_name, orders.value, orders.quantity, orders.started_at, order_statuses.status_name FROM orders INNER JOIN products ON orders.product_id = products.id INNER JOIN order_statuses ON orders.status = order_statuses.id INNER JOIN users ON users.id = orders.user_id WHERE order_statuses.status_name <> 'deleted'";

    //Flag to control if AND was appended already
    let appended = false;
    //Flag to control if and when braces are appended
    let or_brace_flag = false;

    // List of args to be passed to formatted query
    let args = [];
    // Number of current arg
    let arg = 1;

    // ID filtering
    if(id){
        query_string += ` AND orders.id = $${arg}`;
        arg++;
        args.push(id);
    }

    // ID filtering
    if(orderId){
        query_string += ` AND orders.paypal_id = $${arg}`;
        arg++;
        args.push(orderId);
    }

    if(status) {
        query_string += ` AND order_statuses.status_name = $${arg}`;
        arg++;
        args.push(status);
    }

    // Name filtering
    if(name){
        if(!appended) {
            query_string += ` AND`;
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
        args.push(name);
    }

    // User name filtering
    if(userName){
        if(!appended) {
            query_string += ` AND`;
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` users.user_name ILIKE '%' || $${arg} || '%'`;
            appended = true;
            or_brace_flag = true;
        }
        else {
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` OR users.user_name ILIKE '%' || $${arg} || '%'`;
            or_brace_flag = true;
        }
        arg++;
        args.push(userName);
    }

    // user id filtering
    if(userId){
        if(!appended) {
            query_string += ` AND`;
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` orders.user_id = $${arg}`;
            appended = true;
            or_brace_flag = true;
        }
        else {
            query_string += or_brace_flag ? '' : ' (';
            query_string += ` OR orders.user_id = $${arg}`;
            or_brace_flag = true;
        }
        arg++;
        args.push(userId);
    }


    // Price Upper and Lower Bound filtering
    if(lowerPrice) {
        if(!appended) {
            query_string += ` AND orders.value >= $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND orders.value >= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(lowerPrice);
    }
    if(upperPrice) {
        if(!appended) {
            query_string += ` AND orders.value <= $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND orders.value <= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(upperPrice);
    }

    // Quantity Upper and Lower Bound filtering
    if(lowerQuantity) {
        if(!appended) {
            query_string += ` AND orders.quantity >= $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND orders.quantity >= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(lowerQuantity);
    }
    if(upperQuantity) {
        if(!appended) {
            query_string += ` AND orders.quantity <= $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND orders.quantity <= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(upperQuantity);
    }

    // Date Upper and Lower Bound filtering
    if(lowerDate) {
        if(!appended) {
            query_string += ` AND orders.started_at >= $${arg}`;
            appended = true;
        }
        else {
            query_string += or_brace_flag ? ')' : '';
            query_string += ` AND orders.started_at >= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(lowerDate);
    }
    if(upperDate) {
        if(!appended) {
            query_string += ` AND orders.started_at <= $${arg}`;
            appended = true;
        }
        else {
            or_brace_flag += or_brace_flag ? ')' : '';
            query_string += ` AND orders.started_at <= $${arg}`;
            or_brace_flag = false;
        }
        arg++;
        args.push(upperDate);
    }
    // Closes brackets if they were still open
    query_string += or_brace_flag ? ')' : '';

    // Ordering
    query_string += ` ORDER BY `;
    switch(sort) {
        case 'id':
            query_string+=('orders.id');
            break;
        case 'name':
            query_string+=('products.name');
            break;
        case 'userName':
            query_string+=('users.user_name');
            break;
        case 'value':
            query_string+=('orders.value');
            break;
        case 'quantity':
            query_string+=('orders.quantity');
            break;
        case 'timestamp':
            query_string+=('orders.started_at');
            break;
        default:
            query_string+=('orders.started_at');
    }
    if(ord=="desc") {
        query_string += ' DESC';
    }
    else if(ord=="asc") {
        query_string += ' ASC';
    }

    // Duplicates current args and string before appending limit
    // So as to 0allow returing count of records in seperate request
    let count_string = query_string;
    let args_count = args.slice();
    
    // Limit number of records
    if(limit) {
        args.push(limit);
        query_string += ` LIMIT $${arg}`;
        arg++;
    }

    // Offset records
    if(offset) {
        args.push(offset);
        query_string += ` OFFSET $${arg}`;
        arg++;
    }
    query_string += ';';

    // Make queries
    let response = await pool.query(query_string, args);
    let response_count = await pool.query(count_string, args_count);
    let output = response.rows;
    let count = response_count.rows.length;

    //Close connection
    pool.end();

    return {status: "ok", orders: output, count: count};
}

async function create_order(product_id, quantity, value, paypal_id, userId) {
    const pool = new Pool(config);

    //Get current moment in epoch
    let created_at = new Date();

    const result = await pool.query(`INSERT INTO orders (user_id, product_id, status, quantity, value, started_at, paypal_id) VALUES ($1,$2,$3,$4,$5, $6,$7) RETURNING id;`, [ userId ,product_id, 1 ,quantity,value,created_at,paypal_id]);
    const result_update = await pool.query('UPDATE products SET quantity = quantity - $1 WHERE id=$2', [quantity,product_id]);

    // Close connection
    pool.end()
    return {status: 'ok', id: result.rows[0].id};
}

async function updateOrder(id, value, quantity, startedAt) {
    const pool = new Pool(config);

    const result = await pool.query('UPDATE orders SET value=$1, quantity=$2, started_at=$3 WHERE id=$4 AND status <> 2', [value, quantity, startedAt, id]);

    pool.end()

    return {status: 'ok'};
}

async function deleteOrder(id) {
    const pool = new Pool(config);

    const result = await pool.query('UPDATE orders SET status=4 WHERE id=$1 AND status <> 2', [id]);

    pool.end()

    return {status: 'ok'};
}

async function check_available(product_id, quantity) {
    const pool = new Pool(config);
    const query = await pool.query('SELECT quantity FROM Products where id=$1', [product_id]);
    const quantity_available = query.rows[0].quantity;
    if (quantity_available < quantity) {
        return {status: 'error', message: 'Not enough products'};
    }
    return {status: 'ok'};
}

async function authorize_order(order_id, user_id) {
    const pool = new Pool(config);

    const result = await pool.query(`UPDATE orders SET status=$1 WHERE paypal_id=$2;`, [2, order_id]);

    const delete_result = await pool.query('DELETE FROM carts WHERE user_id=$1;', [user_id]);

    // Close connection
    pool.end()
    return {status: 'ok'};
}

async function get_cart(user_id) {
    const pool = new Pool(config);

    const result = await pool.query('SELECT carts.id, carts.user_id, carts.product_id, carts.quantity, carts.created_at, products.name, products.price FROM carts INNER JOIN products ON carts.product_id = products.id WHERE user_id=$1 ORDER BY products.name;', [user_id]);

    pool.end()
    return {status: 'ok', cart: result.rows};
}

async function add_item_cart(user_id, product_id, quantity) {
    const pool = new Pool(config);

    //Get current moment in epoch
    let created_at = Math.floor(new Date() / 1000);

    const result = await pool.query('INSERT INTO carts (user_id, product_id, quantity, created_at) VALUES ($1,$2,$3,to_timestamp($4)) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity;', [user_id, product_id, quantity, created_at]);

    pool.end()
    return {status: 'ok'};
}

async function remove_from_cart(id) {
    const pool = new Pool(config);
    const result = await pool.query(`DELETE FROM carts WHERE id=$1;`, [id]);
    pool.end()
    return {status: 'ok'};
}

async function getAccounts(id, userName, email, status, lowerDate, upperDate) {
    const pool = new Pool(config);

    let arg = 1;
    let args = [];
    let queryCondition = '';

    if(id) {
        queryCondition += ` AND users.id=$${arg}`;
        arg++;
        args.push(id);
    }

    if(status) {
        queryCondition += ` AND user_statuses.status_name = $${arg}`;
        arg++;
        args.push(status);
    }

    if(userName) {
        if(queryCondition == '') {
            queryCondition += ` AND users.user_name ILIKE '%' || $${arg} || '%'`;
            arg++;
            args.push(userName);
        }
        else {
            queryCondition += ` OR users.user_name ILIKE '%' || $${arg} || '%'`;
            arg++;
            args.push(userName);
        }
    }
    if(email) {
        if(queryCondition == '') {
            queryCondition += ` AND email  ILIKE '%' || $${arg} || '%'`;
            arg++;
            args.push(email);
        }
        else {
            queryCondition += ` OR email  ILIKE '%' || $${arg} || '%'`;
            arg++;
            args.push(email);
        }
    }

    // Date Upper and Lower Bound filtering
    if(lowerDate) {
        queryCondition += ` AND users.created_at >= $${arg}`;
        arg++;
        args.push(lowerDate);
    }
    if(upperDate) {
        queryCondition += ` AND users.created_at <= $${arg}`;
        arg++;
        args.push(upperDate);
    }

    let query = 'SELECT users.id,users.user_name,users.email,user_statuses.status_name, users.created_at FROM users INNER JOIN user_statuses ON users.status = user_statuses.id WHERE status <> 0;';
    if(queryCondition != '') {
        query = 'SELECT users.id,users.user_name,users.email,user_statuses.status_name, users.created_at FROM users INNER JOIN user_statuses ON users.status = user_statuses.id WHERE status <> 0' + queryCondition + ';';
    }
    const result = await pool.query(query, args);
    pool.end();

    return {status: 'ok', accounts: result.rows, count: result.rowCount};
}

async function newAccount(userName, email, password, address, phone) {
    const pool = new Pool(config);

    //Get current moment in epoch
    let createdAt = Math.floor(new Date() / 1000);

    let hash = bcrypt.hashSync(password, 10);
    console.log(address)
    const result = await pool.query('INSERT INTO users (user_name, email, password, created_at, status, address, phone) VALUES ($1,$2,$3,to_timestamp($4), $5, $6, $7) RETURNING id', [userName, email, hash, createdAt, 1, address, phone]);

    const userId = result.rows[0].id;
    const randomId = Math.floor((Math.random() * 100) + 54);
    const verificationInsert = await pool.query('INSERT INTO verification (user_id, verification_id) VALUES ($1,$2);', [userId, randomId]);
    mail.sendVerificationEmail(randomId, email);
    
    pool.end()

    return {status: 'ok'};
}

async function checkAvailability(userName, email) {
    const pool = new Pool(config);

    const userNameResult = await pool.query('SELECT * FROM users WHERE user_name=$1;', [userName]);
    if(userNameResult.rows.length) {
        return {status: 'error', message: 'Unavailable username'};
    }

    const emailResult = await pool.query('SELECT * FROM users WHERE email=$1;', [email]);
    if(emailResult.rows.length) {
        return {status: 'error', message: 'Unavailable email'};
    }

    pool.end()

    return {status: 'ok'};
}

async function updateAccount(id, userName, email, password, createdAt) {
    const pool = new Pool(config);

    if(password) {
        let hash = bcrypt.hashSync(password, 10);
        const result = await pool.query('UPDATE users SET user_name=$1, email=$2, password=$3, created_at=$4 WHERE id=$5',[userName,email,hash,createdAt, id]);
        pool.end();
        return {status: 'ok'};
    }
    const result = await pool.query('UPDATE users SET user_name=$1, email=$2, created_at=$3 WHERE id=$4',[userName,email,createdAt,id]);

    pool.end()

    return {status: 'ok'};
}

async function deleteAccount(id) {
    const pool = new Pool(config);

    const result = await pool.query('UPDATE users SET status=0 WHERE id=$1',[id]);

    pool.end()

    return {status: 'ok'};
}

async function getAdmin(id, userName, email) {
    const pool = new Pool(config);

    let arg = 1;
    let args = [];
    let queryCondition = '';
    if(id) {
        if(queryCondition == '') {
            queryCondition += ` AND id=$${arg}`;
            arg++;
            args.push(id);
        }
        else {
            queryCondition += ` OR id=$${arg}`;
            arg++;
            args.push(id);
        }
    }
    if(userName) {
        if(queryCondition == '') {
            queryCondition += ` AND user_name=$${arg}`;
            arg++;
            args.push(userName);
        }
        else {
            queryCondition += ` OR user_name=$${arg}`;
            arg++;
            args.push(userName);
        }
    }
    if(email) {
        if(queryCondition == '') {
            queryCondition += ` AND email=$${arg}`;
            arg++;
            args.push(email);
        }
        else {
            queryCondition += ` OR email=$${arg}`;
            arg++;
            args.push(email);
        }
    }
    let query = 'SELECT * FROM insiders WHERE status <> 0;';
    if(queryCondition != '') {
        query = 'SELECT * FROM insiders WHERE status <> 0' + queryCondition + ';';
    }
    const result = await pool.query(query, args);
    pool.end();

    return {status: 'ok', accounts: result.rows, count: result.rowCount};
}

async function newAdmin(userName, email, password) {
    const pool = new Pool(config);

    //Get current moment in epoch
    let createdAt = Math.floor(new Date() / 1000);

    let hash = bcrypt.hashSync(password, 10);

    const result = await pool.query('INSERT INTO insiders (user_name, email, password, created_at, status) VALUES ($1,$2,$3,to_timestamp($4), $5)', [userName, email, hash, createdAt, 1]);

    pool.end()

    return {status: 'ok'};
}

async function updateAdmin(id, userName, email, password) {
    const pool = new Pool(config);

    if(password) {
        let hash = bcrypt.hashSync(password, 10);
        const result = await pool.query('UPDATE insiders SET user_name=$1, email=$2, password=$3 WHERE id=$4',[userName,email,hash,id]);
        pool.end();
        return {status: 'ok'};
    }
    const result = await pool.query('UPDATE insiders SET user_name=$1, email=$2 WHERE id=$3',[userName,email,id]);

    pool.end();

    return {status: 'ok'};
}

async function deleteAdmin(id) {
    const pool = new Pool(config);

    const result = await pool.query('UPDATE insiders SET status=0 WHERE id=$1',[id]);

    pool.end();

    return {status: 'ok'};
}

async function login(email, password) {
    const pool = new Pool(config);
    const userQueryResult = await pool.query('SELECT * FROM users WHERE status <> 3 AND email=$1;',[email]);
    pool.end();
    try {
        const user = userQueryResult.rows[0];
        if(bcrypt.compareSync(password, user.password)) {
            return {status: 'ok', account: user};
        }
        return {status: 'userError', message: 'Incorrect password'};
    } catch (err) {
        return {status: 'userError', message: "Account doesn't exist"};
    }
}

async function loginAdmin(email, password) {
    const pool = new Pool(config);
    const userQueryResult = await pool.query('SELECT * FROM insiders WHERE email=$1;',[email]);
    pool.end();
    try {
        const user = userQueryResult.rows[0];
        if(bcrypt.compareSync(password, user.password)) {
            return {status: 'ok', account: user};
        }
        return {status: 'userError', message: "Incorrect password"};
    } catch (err) {
        return {status: 'userError', message: "Account doesn't exist"};
    }
}

async function verifyAccount(id) {
    const pool = new Pool(config);

    const verificationQueryResult = await pool.query('SELECT user_id FROM verification WHERE verification_id=$1;',[id]);

    try {
        var userId = verificationQueryResult.rows[0].user_id;
    } catch (err) {
        return {status: 'userError', message: "Verification ID invalid"};
    }

    const deleteOldVerification = await pool.query('DELETE FROM verification WHERE verification_id=$1;',[id]);
    const verifyUserResult = await pool.query('UPDATE users SET status=2 WHERE id=$1', [userId]);

    pool.end();
    return {status: 'ok'};

}

async function sendVerificationEmail(email) {
    const pool = new Pool(config);

    const result = await pool.query('SELECT id FROM users WHERE email=$1',[email]);

    const userId = result.rows[0].id;
    const randomId = Math.floor((Math.random() * 100) + 54);
    const verificationInsert = await pool.query('INSERT INTO verification (user_id, verification_id) VALUES ($1,$2);', [userId, randomId]);
    mail.sendVerificationEmail(randomId, email);
    
    pool.end();
    return {status: 'ok'};
}

async function resetPassword(id, password) {
    const pool = new Pool(config);

    const verificationQueryResult = await pool.query('SELECT user_id FROM verification WHERE verification_id=$1;',[id]);

    console.log(id);
    try {
        var userId = verificationQueryResult.rows[0].user_id;
        console.log(userId);
    } catch (err) {
        return {status: 'userError', message: "Verification ID invalid"};
    }

    const deleteOldVerification = await pool.query('DELETE FROM verification WHERE verification_id=$1;',[id]);
    let hash = bcrypt.hashSync(password, 10);
    const verifyUserResult = await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hash, userId]);

    pool.end();
    return {status: 'ok'};

}

async function sendResetEmail(email) {
    const pool = new Pool(config);

    const result = await pool.query('SELECT id FROM users WHERE email=$1',[email]);

    const userId = result.rows[0].id;
    const randomId = Math.floor((Math.random() * 100) + 54);
    const verificationInsert = await pool.query('INSERT INTO verification (user_id, verification_id) VALUES ($1,$2);', [userId, randomId]);
    mail.sendResetEmail(randomId, email);
    
    pool.end();
    return {status: 'ok'};
}

async function getCategories() {
    const pool = new Pool(config);
    const result = await pool.query('SELECT * FROM tag_names');
    pool.end();
    return {status: 'ok', categories: result.rows};
}

async function dispatchOrder(order_id) {
    const pool = new Pool(config);
    const result = await pool.query(`UPDATE orders SET status=$1 WHERE id=$2;`, [5, order_id]);
    pool.end();
    return {status: 'ok'};
}

module.exports.get_products = get_products;
module.exports.create_product = create_product;
module.exports.update_product = update_product;
module.exports.remove_product = remove_product;

module.exports.getOrders = getOrders;
module.exports.updateOrder = updateOrder;
module.exports.deleteOrder = deleteOrder;
module.exports.create_order = create_order;
module.exports.check_available = check_available;
module.exports.authorize_order = authorize_order;

module.exports.get_cart = get_cart;
module.exports.add_item_cart = add_item_cart;
module.exports.remove_from_cart = remove_from_cart;

module.exports.getAccounts = getAccounts;
module.exports.newAccount = newAccount;
module.exports.checkAvailability = checkAvailability;
module.exports.updateAccount = updateAccount;
module.exports.deleteAccount = deleteAccount;

module.exports.getAdmin = getAdmin;
module.exports.newAdmin = newAdmin;
module.exports.updateAdmin = updateAdmin;
module.exports.deleteAdmin = deleteAdmin;

module.exports.login = login;
module.exports.loginAdmin = loginAdmin;

module.exports.verifyAccount = verifyAccount;
module.exports.sendVerificationEmail = sendVerificationEmail;

module.exports.resetPassword = resetPassword;
module.exports.sendResetEmail = sendResetEmail;

module.exports.getCategories = getCategories;

module.exports.dispatchOrder = dispatchOrder;
