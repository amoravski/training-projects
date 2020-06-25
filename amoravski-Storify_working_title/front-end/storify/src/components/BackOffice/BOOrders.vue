<template>
  <div id="orders">
    <Header />
    <h2>Orders</h2>

    <div>
      Date filter: from
      <input v-model="date.lower" type="date" id="lower-date" />
      <input v-model="time.lower" type="time" id="lower-time" />
      to
      <input v-model="date.upper" type="date" id="upper-date" />
      <input v-model="time.upper" type="time" id="upper-time" />
    </div>


    <div>
      <label for="idFilter"><b>Id search: </b></label>
      <input style="width: 40rem;" v-model="idFilter" type="text" id="idFilter"/>
      <label for="orderIdFilter"><b>Order id search: </b></label>
      <input style="width: 40rem;" v-model="orderIdFilter" type="text" id="orderIdFilter"/>
      <label for="nameFilter"><b>Product name search: </b></label>
      <input style="width: 40rem;" v-model="nameFilter" type="text" id="nameFilter"/>
      <label for="userNameFilter"><b>User name search: </b></label>
      <input style="width: 40rem;" v-model="userNameFilter" type="text" id="userNameFilter"/>
    </div>

    <div>
      Price filter: from
      <input style="width: 10rem;" v-model="priceFilter.lower" type="number" id="lower-price" min=0/>
      to
      <input style="width: 10rem;" v-model="priceFilter.upper" type="number" id="upper-price" min=0/>
      €
    </div>

    <div>
      Quantity filter: from
      <input style="width: 10rem;" v-model="quantityFilter.lower" type="number" id="lower-quantity" min=0 step=1/>
      to
      <input style="width: 10rem;" v-model="quantityFilter.upper" type="number" id="upper-quantity" min=0 step=1/>
    </div>

    <div>
      <label for="statusFilter"><b>Status: </b></label>
      <select style="width: 40rem;" id="statusFilter" v-model="statusFilter">
        <option value="not_paid">Not paid</option>
        <option value="paid">Paid</option>
        <option value="payment_rejected">Payment Rejected</option>
        <option value="dispatched">Dispatched</option>
        <option value=""></option>
      </select >
    </div>

    <button v-on:click="search">Search</button>

    <table>
      <thead>
        <tr>
          <th v-on:click="sortProductsDateAlternating">Started at</th>
          <th v-on:click="sortProductsIdAlternating">ID</th>
          <th>Order ID</th>
          <th v-on:click="sortProductsNameAlternating">Product Name</th>
          <th v-on:click="sortProductsUserNameAlternating">User Name</th>
          <th v-on:click="sortProductsPriceAlternating" style="text-align:right">Value</th>
          <th>Quantity</th>
          <th style="text-align:right">Value(total)</th>
          <th>Status</th>
          <th></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <BOOrder @dispatched="dispatchOrder" @updated="updateOrder" @removed="removeOrder"  v-for="order in orders" v-bind:key="order.id" v-bind:order=order />
      </tbody>
    </table>

    <!--Pages-->
    <button v-if="page" v-on:click="goBackwardsPage">&lt;</button>
    <button>{{ page+1 }}</button>
    <button v-if="(page+1)*10 < ordersCount" v-on:click="goForwardsPage">&gt;</button>

    <!--Empty page-->
    <h3 v-if="empty">None found! :(</h3>
  </div>
</template>

<script>
//import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { format } from 'date-fns';
  
import BOOrder from './BOOrder.vue';
import Header from './BOHeader.vue';

export default {
  name: 'BOOrders',
  components: { Header, BOOrder },

  data () {
    return {
      orders : [], 
      nameFilter : "",
      userNameFilter : "",
      idFilter : "",
      orderIdFilter : "",
      statusFilter : "",
      empty: false,
      priceFilter: {
        lower: 0,
        upper: 0,
      },
      quantityFilter : {
        lower: 0,
        upper: 0,
      },
      date: {
        lower: format(new Date(), 'yyyy-MM-dd'),
        upper: format(new Date(), 'yyyy-MM-dd'),
      },
      time: {
        lower: '00:00',
        upper: '23:59',
      },
      page: 0,
      ordersCount: 0,
      asc: false,
      sort: '',
      token: ''
    };
  },

  mounted () {
    if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
      let jwt = localStorage.getItem('JWT_admin_account_storify');
      this.token = jwt;
    }
    this.getOrders();
  },
  methods: {
    search: function () {
      this.page = 0;
      this.getOrders();
    },

    getOrders: function () {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `order?offset=${this.page*10}&limit=10`;

      url += this.idFilter ? `&id=${this.idFilter}` : '';
      url += this.orderIdFilter ? `&orderId=${this.orderIdFilter}` : '';
      url += this.name ? `&name=${this.name}` : '';
      url += this.nameFilter ? `&name=${this.nameFilter}` : '';
      url += this.userNameFilter ? `&userName=${this.userNameFilter}` : '';
      url += this.statusFilter ? `&status=${this.statusFilter}` : '';

      url += this.token ? `&token=${this.token}` : '';
      url += this.sort ? `&sort=${this.sort}` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += this.priceFilter.upper > 0 ? `&lowerPrice=${this.priceFilter.lower * 100}&upperPrice=${this.priceFilter.upper * 100}` : '';
      url += this.quantityFilter.upper > 0 ? `&lowerQuantity=${this.quantityFilter.lower}&upperQuantity=${this.quantityFilter.upper}` : '';
      url += this.date.upper && this.time.upper ? `&lowerDate=${this.date.lower + 'T' +this.time.lower}&upperDate=${this.date.upper + 'T' +this.time.upper}` : '';
      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.orders = parsed.orders; 
            this.ordersCount = parsed.count; 
            if(this.orders.length == 0) {
              this.empty= true;
            }
            else {
              this.empty = false;
            }
          },
          error => {
            console.log(error);
            alert(error.response.data.message);
          }
        );
    },

    removeOrder: function (event) {
      var url = `http://localhost:3000/order?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { 
          alert("Removed Order");
          this.getOrders();
        }
      , error => {
        console.log(error);
            alert(error.response.data.message);
      });
    },

    updateOrder: function(event) {
      var url = `http://localhost:3000/order`
      console.log(event);
      axios({ method:"PUT", "url": url, data: event}).then(() => {
          alert("Updated Order");
          this.getOrders();
        }
      , error => {
        console.log(error);
            alert(error.response.data.message);
      });
    },

    dispatchOrder: function (event) {
      var url = `http://localhost:3000/dispatch`
      axios({ method:"POST", "url": url, data: {id: event}}).then(() => { 
          alert("Dispatched Order");
          this.getOrders();
        }
      , error => {
        console.log(error);
            alert(error.response.data.message);
      });
    },

    sortProductsNameAlternating: function () {
      this.page = 0;
      this.sort = 'name'
      this.asc = !this.asc
      this.getOrders();
      return
    },

    sortProductsUserNameAlternating: function () {
      this.page = 0;
      this.sort = 'userName'
      this.asc = !this.asc
      this.getOrders();
      return
    },

    sortProductsPriceAlternating: function () {
      this.page = 0;
      this.sort = 'value'
      this.asc = !this.asc
      this.getOrders();
      return
    },

    sortProductsIdAlternating: function () {
      this.page = 0;
      this.sort = 'id'
      this.asc = !this.asc
      this.getOrders();
      return
    },

    sortProductsDateAlternating: function () {
      this.page = 0;
      this.sort = 'timestamp'
      this.asc = !this.asc
      this.getOrders();
      return
    },
    goForwardsPage: function() {
      this.page++;
      this.getOrders();
    },

    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getOrders();
      }
    },
  }
}
</script>
