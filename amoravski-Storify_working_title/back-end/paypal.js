const paypal = require('@paypal/checkout-server-sdk');
const router = require('koa-router');

const pg = require('./postgre.js');
const orders_router = router({
    prefix: '/paypal'
});

// Creating an environment
let clientId = "ATrYlt26Yq4_aHByinYyb08MrH-b72oS5HA3w8YKPv3G0wg2c41oOxvDJnr3oTb4DlhB9NZgjMq3rqcH";
let clientSecret = "EBTmwr0r28Zy1zQMSSE-2AlUkL02m9S1TR_qufZehJdDdjhKrPpRBUFOXJxxEnVnpdF5NBEPZPRXuQpj";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders

orders_router.post('/', create_order);
orders_router.put('/', authorize_order);

async function create_order(ctx) {
    params = ctx.request.body;

    //const cart_query = await pg.get_cart(params.user_id);
    //const cart = cart_query.cart;
    const cart = params.cart;

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody(buildRequestBody(cart));

    try {
        for(let i=0; i<cart.length; i++) {
            let available = await pg.check_available(cart[i].product_id, cart[i].quantity);
            if(available.status == "error"){
                ctx.response.status = 400;
                ctx.body = available;
                return;
            }
        }
        let response = await client.execute(request);
        let resp_order = JSON.parse(JSON.stringify(response.result));
        for(let i=0; i<cart.length; i++) {
            let order_response = await pg.create_order(cart[i].product_id, cart[i].quantity, cart[i].price, resp_order.id, params.userId);
        }
        ctx.response.status = 200;
        ctx.body = { status: "ok", order: JSON.stringify(response.result)};
        return;
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = { status: "userError", response: err.message };
        return;
    }
}

async function authorize_order(ctx) {
    params = ctx.request.body;
    order_id_paypal = params.orderId ;
    request = new paypal.orders.OrdersCaptureRequest(order_id_paypal);
    request.requestBody({});
    try {
        let response = await client.execute(request);
        order_response = await pg.authorize_order(order_id_paypal, params.user_id);
        ctx.response.status = 200;
        ctx.body = { status: "ok", order: JSON.stringify(response.result) };
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = { status: "userError", response: err.message };
        return;
    }
}

function buildRequestBody(cart) {
    let items = [];
    let total_value = 0;
    for(let i=0; i<cart.length; i++) {
        items.push({
                        "name": `${cart[i].name}`,
                        "unit_amount": {
                            "currency_code": "EUR",
                            "value": `${Math.floor(cart[i].price / 100)}`
                        },
                        "quantity": `${cart[i].quantity}`,
                        "category": "PHYSICAL_GOODS"
                    });
        total_value += cart[i].quantity * (Math.floor(cart[i].price / 100) );
    }
    return {
        "intent": "CAPTURE",
        "application_context": {
            "return_url": "http://localhost:8080/products",
            "cancel_url": "http://localhost:8080/products",
            "brand_name": "STORIFY INC",
            "locale": "en-US",
            "user_action": "CONTINUE"
        },
        "purchase_units": [
            {
                "reference_id": "PUHF",
                "amount": {
                    "currency_code": "EUR",
                    "value": `${total_value}`,
                    "breakdown": {
                        "item_total": {
                            "currency_code": "EUR",
                            "value": `${total_value}`
                        }
                    },
                    },
                "items": items,
                "shipping": {
                    "method": "United States Postal Service",
                    "name": {
                        "full_name":"John Doe"
                    },
                    "address": {
                        "address_line_1": "123 Townsend St",
                        "address_line_2": "Floor 6",
                        "admin_area_2": "San Francisco",
                        "admin_area_1": "CA",
                        "postal_code": "94107",
                        "country_code": "US"
                    }
                }
            }
        ]
    };
}

module.exports = orders_router;
