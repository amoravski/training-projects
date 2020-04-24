const paypal = require('@paypal/checkout-server-sdk');
const router = require('koa-router');

const pg = require('./postgre.js');
const orders_router = router({
    prefix: '/order'
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

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody(buildRequestBody(params.name, params.quantity, params.price));

    try {
        let available = await pg.check_available(params.id, params.quantity);
        if(available.status == "error"){
            ctx.response.status = 400;
            ctx.body = available;
            return;
        }
        let response = await client.execute(request);
        let resp_order = JSON.parse(JSON.stringify(response.result));
        let order_response = await pg.create_order(params.id, params.quantity, params.price, resp_order.id);
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
        order_response = await pg.authorize_order(order_id_paypal);
        ctx.response.status = 200;
        ctx.body = { status: "ok", order: JSON.stringify(response.result) };
    } catch(err) {
        ctx.response.status = 400;
        ctx.body = { status: "userError", response: err.message };
        return;
    }
}

function buildRequestBody(product_name, quantity, price) {
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
                    "currency_code": "USD",
                    "value": `${quantity * (price / 100)}`,
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": `${quantity * (price / 100)}`
                        }
                    },
                    },
                "items": [
                    {
                        "name": `${product_name}`,
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": `${price / 100}`
                        },
                        "quantity": `${quantity}`,
                        "category": "PHYSICAL_GOODS"
                    }],
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
