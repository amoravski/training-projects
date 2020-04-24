<template>
  <div id="products">
      <!--Filters and search-->
      <h2>Product List</h2>
      <label for="lower-price">Lower bound price:</label>
      <input style="width: 10rem;" v-model="lowerPrice" type="number" id="lower-price"/>
      <label for="upper-price">Upper bound price:</label>
      <input style="width: 10rem;" v-model="upperPrice" type="number" id="upper-price"/>
      <label for="searchTerm"><b>Search: </b></label>
      <input style="width: 50rem;" v-model="searchTerm" type="text" id="searchTerm"/>
      <button v-on:click="search">Search</button>

      <!--List of products-->
      <table>
          <thead>
            <tr>
              <th></th>
              <th v-on:click="sortProductsNameAlternating">Name</th>
              <th style="text-align:right" v-on:click="sortProductsPriceAlternating">Price</th>
              <th>Quantity</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Product @bought="buyProduct" v-for="product in products" v-bind:key="product.id" v-bind:product=product />
          </tbody>
      </table>

      <!--Pages-->
      <button v-if="page" v-on:click="goBackwardsPage">&lt;</button>
      <button>{{ page+1 }}</button>
      <button v-if="(page+1)*5 < productsCount" v-on:click="goForwardsPage">&gt;</button>

      <!--Empty page-->
      <h3 v-if="empty">None found! :(</h3>
  </div>
</template>

<script>
import axios from 'axios';

import Product from './Product.vue';

export default {
  name: 'Products',
  components: { Product },

  data () {
    return {
      products : [], 
      searchTerm : "",
      empty: false,
      lowerPrice: 0,
      upperPrice: 0,
      page: 0,
      productsCount: 0,
      asc: true,
      nameSort: true,
      priceSort: false,
      orderID: this.$route.query.token,
    };
  },

  mounted () {
    if(this.orderID) {
      this.authenticateOrder();
    }
    this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
  },

  methods: {
    search: function () {
      this.page = 0;
      this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    getProducts: function (name, tag, lowerPrice, upperPrice) {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `product?offset=${this.page*5}&limit=5`;
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
            this.products = parsed.products; 
            this.productsCount = parsed.count; 
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

    sortProductsNameAlternating: function () {
      this.page = 0;
      this.nameSort = true;
      this.priceSort = false;
      if(this.asc) {
        this.asc = false;
        this.searchTerm();
        return
      }
      this.asc = true;
      this.searchTerm();
      return
    },

    sortProductsPriceAlternating: function () {
      this.page = 0;
      this.nameSort = false;
      this.priceSort = true;
      if(this.asc) {
        this.asc = false;
        this.searchTerm();
        return
      }
      this.asc = true;
      this.searchTerm();
      return
    },

    buyProduct: function (event) {
      console.log(event);
      let url = `http://localhost:3000/order`
      axios({ method:"POST", "url": url, data: event}).then(result => {
        let parsed = JSON.parse(JSON.stringify(result.data));
        this.order_id = parsed.order_id; 
        let parsed_order = JSON.parse(parsed.order);
        alert("Opening PayPal to confirm order...");
        window.open(parsed_order.links[1].href);
        window.close();
      }, error => {
        console.log(error.response.data);
        //console.log(error);
        alert(error.response.data.message);
      });
    },

    authenticateOrder: function () {
      let url = `http://localhost:3000/order`
      axios({ method:"PUT", "url": url, data: {orderId: this.orderID}}).then(result => {
        let parsed = JSON.parse(JSON.stringify(result.data));
        alert("Order confirmed!");
        console.log(parsed);
      }, error => {
        console.log(error);
      });
    },

    goForwardsPage: function() {
      this.page++;
      this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
      }
    },
  },
}

</script>
