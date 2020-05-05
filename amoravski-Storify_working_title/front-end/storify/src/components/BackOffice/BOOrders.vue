<template>
  <div id="orders">
      <h2>Orders list, Back Office</h2>
      <div class="bordered">
        <label for="lower-price">Lower bound price:</label>
        <input style="width: 10rem;" v-model="lowerPrice" type="number" id="lower-price" min=0/>
        <label for="upper-price">Upper bound price:</label>
        <input style="width: 10rem;" v-model="upperPrice" type="number" id="upper-price" min=0/>
      </div>
      <label for="searchTerm"><b>Search: </b></label>
      <input v-model="searchTerm" type="text" id="searchTerm"/>
      <button v-on:click="search">Search</button>
    <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th style="text-align:right">Value(total)</th>
            <th>Quantity</th>
            <th>Started at</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <BOOrder  v-for="order in orders" v-bind:key="order.id" v-bind:order=order />
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

export default {
  name: 'BOOrders',
  components: { BOOrder },

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
      let url = backendurl + `orderTEMP?offset=${this.page*10}&limit=10`;
      url += name ? `&name=${name}` : '';
      url += tag ? `&tag=${tag}` : '';
      url += this.nameSort ? `&sort=name` : '';
      url += this.priceSort ? `&sort=price` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += upperPrice > 0 ? `&lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}` : '';
      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.orders = parsed.orders; 
            this.ordersCount = parsed.count; 
            if(this.products.length == 0) {
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
