<template>
  <div id="orders">
      <Header />
      <h2>Orders</h2>
      <div class="bordered">
        Price filter: from
        <input style="width: 10rem;" v-model="lowerPrice" type="number" id="lower-price" min=0/>
        to
        <input style="width: 10rem;" v-model="upperPrice" type="number" id="upper-price" min=0/>
        €
      </div>
      <label for="searchTerm"><b>Search: </b></label>
      <input v-model="searchTerm" type="text" id="searchTerm"/>
      <button v-on:click="search">Search</button>
    <table>
        <thead>
          <tr>
            <th v-on:click="sortProductsDateAlternating">Started at</th>
            <th v-on:click="sortProductsIdAlternating">ID</th>
            <th v-on:click="sortProductsNameAlternating">Name</th>
            <th v-on:click="sortProductsPriceAlternating" style="text-align:right">Value</th>
            <th>Quantity</th>
            <th style="text-align:right">Value(total)</th>
            <th>Status</th>
            <th></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <BOOrder @updated="updateOrder" @removed="removeOrder"  v-for="order in orders" v-bind:key="order.id" v-bind:order=order />
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
import axios from 'axios';
import BOOrder from './BOOrder.vue';
import Header from './BOHeader.vue';

export default {
  name: 'BOOrders',
  components: { Header, BOOrder },

  data () {
    return {
      orders : [], 
      searchTerm : "",
      empty: false,
      lowerPrice: 0,
      upperPrice: 0,
      page: 0,
      ordersCount: 0,
      asc: false,
      nameSort: false,
      priceSort: false,
      sort: ''
    };
  },

  mounted () {
    this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
  },
  methods: {
    search: function () {
      this.page = 0;
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    getOrders: function (name, tag, lowerPrice, upperPrice) {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `order?offset=${this.page*10}&limit=10`;
      url += name ? `&name=${name}` : '';
      url += tag ? `&tag=${tag}` : '';
      url += this.sort ? `&sort=${this.sort}` : '';
      //url += this.nameSort ? `&sort=name` : '';
      //url += this.priceSort ? `&sort=value` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += upperPrice > 0 ? `&lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}` : '';
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
          }
        );
    },

    removeOrder: function (event) {
      var url = `http://localhost:3000/order?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { 
          this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
        }
      , error => {
        console.log(error);
      });
    },

    updateOrder: function(event) {
      this.newForm = false;
      var url = `http://localhost:3000/order`
      axios({ method:"PUT", "url": url, data: event}).then(() => {
          this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
        }
      , error => {
        console.log(error);
      });
    },

    sortProductsNameAlternating: function () {
      this.page = 0;
      this.sort = 'name'
      this.asc = !this.asc
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      return
    },

    sortProductsPriceAlternating: function () {
      this.page = 0;
      this.sort = 'value'
      this.asc = !this.asc
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      return
    },

    sortProductsIdAlternating: function () {
      this.page = 0;
      this.sort = 'id'
      this.asc = !this.asc
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      return
    },

    sortProductsDateAlternating: function () {
      this.page = 0;
      this.sort = 'timestamp'
      this.asc = !this.asc
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      return
    },
    goForwardsPage: function() {
      this.page++;
      this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getOrders(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      }
    },
  }
}
</script>
