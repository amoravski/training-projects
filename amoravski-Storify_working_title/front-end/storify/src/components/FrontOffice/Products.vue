<template>
  <div id="products">
      <Header />
      <!--Filters and search-->
      <div style="float: left;">
        <h2>Products</h2>
        Price filter: from
        <input style="width: 8rem;" v-model="lowerPrice" type="number" id="lower-price"/>
        to
        <input style="width: 8rem;" v-model="upperPrice" type="number" id="upper-price"/>
        €
        <label for="searchTerm"><b>Search: </b></label>
        <input style="width: 30rem;" v-model="searchTerm" type="text" id="searchTerm"/>

        <div>
          <label for="tagsFilter"><b>Category: </b></label>
          <select style="width: 30rem;" id="statusFilter" v-model="tagsFilter">
            <option v-for="tag in tags" v-bind:value="tag.tag_name" v-bind:key="tag.id">{{tag.tag_name}}</option>
            <option value=""></option>
          </select >
        </div>
        <button v-on:click="search">Search</button>
      </div>

      <!--Cart and checkout-->
      <div style="float: right;" v-if="cart.length">
        <h2>Cart</h2>
       <table style="width: 40rem;">
          <thead>
            <tr>
              <th>Name</th>
              <th style="text-align:right">Price</th>
              <th></th>
              <th>Quantity</th>
              <th style="text-align:right">Price(total)</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <CartItem @quantityChanged="addToCart" @removed="removeCart" v-for="cartItem in cart" v-bind:key="cartItem.id" v-bind:cartItem=cartItem />
            <tr>
              <th>Total Price</th>
              <td style="text-align:right">{{ formatMoney(totalCartPrice()) }}</td>
              <td>лв.</td>
              <th></th>
              <th></th>
            </tr>
          </tbody>
      </table> 
        <button v-on:click="buyCart">Checkout</button>
      </div>
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
            <Product @bought="addToCart" v-for="product in products" v-bind:key="product.id" v-bind:product=product />
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
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import Header from './Header.vue';
import Product from './Product.vue';
import CartItem from './CartItem.vue';

export default {
  name: 'Products',
  components: { Header, Product, CartItem },

  data () {
    return {
      products : [], 
      tags : [], 
      cart: [],
      searchTerm : "",
      tagsFilter : "",
      empty: false,
      lowerPrice: 0,
      upperPrice: 0,
      page: 0,
      productsCount: 0,
      asc: true,
      nameSort: true,
      priceSort: false,
      orderID: this.$route.query.token,
      jwt: '',
      userName: '',
      user_id: '',
    };
  },

  mounted () {
    
    if(typeof localStorage.getItem('JWT_account_storify') != undefined && localStorage.getItem('JWT_account_storify') != null) {
      this.jwt = localStorage.getItem('JWT_account_storify');
      this.userName = jwt_decode(this.jwt).userName;
      this.user_id = jwt_decode(this.jwt).id;
      this.getCart();
    }
    else {
      this.jwt = '';
      this.user_id = 1;
    }
    if(this.orderID) {
      this.authenticateOrder();
    }
    this.getTags();
    this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
  },

  methods: {
    search: function () {
      this.page = 0;
      this.getProducts(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    getTags: function () {
      const backendurl = 'http://localhost:3000/';
      const url = backendurl + 'category';
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.tags = parsed.categories; 
          },
          error => {
            console.log(error);
          }
        );
    },

    getProducts: function (name, tag, lowerPrice, upperPrice) {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `product?offset=${this.page*5}&limit=5`;
      url += name ? `&name=${name}` : '';
      url += this.tagsFilter ? `&tag=${this.tagsFilter}` : '';
      url += this.nameSort ? `&sort=name` : '';
      url += this.priceSort ? `&sort=price` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += upperPrice > 0 ? `&lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}` : '';
      url += this.productsCount ? '&returnCount=false' : '&returnCount=true';
      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.products = parsed.products; 
            if(typeof parsed.count != 'undefined' && parsed.count != null) {
              this.productsCount = parsed.count; 
            }
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
        this.search();
        return
      }
      this.asc = true;
      this.search();
      return
    },

    sortProductsPriceAlternating: function () {
      this.page = 0;
      this.nameSort = false;
      this.priceSort = true;
      if(this.asc) {
        this.asc = false;
        this.search();
        return
      }
      this.asc = true;
      this.search();
      return
    },

    getCart: function () {
      let url = `http://localhost:3000/cart?user_id=${this.user_id}&jwt=${this.jwt}`
      axios({ method:"GET", "url": url}).then(result => {
        let parsed = JSON.parse(JSON.stringify(result.data));
        this.cart = parsed.cart;
      }, error => {
        console.log(error.response.data);
        alert(error.response.data.message);
      });
    },

    addToCart: function (event) {
      let url = `http://localhost:3000/cart`
      event.user_id = this.user_id;
      event.jwt = this.jwt;
      axios({ method:"PUT", "url": url, data: event}).then(() => {
        this.getCart();
      }, error => {
        console.log(error.response.data);
        //console.log(error);
        alert(error.response.data.message);
      });
    },

    buyCart: function () {
      let url = `http://localhost:3000/paypal`
      axios({ method:"POST", "url": url, data: {userId: this.user_id, cart: this.cart}}).then(result => {
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
      let url = `http://localhost:3000/paypal`
      axios({ method:"PUT", "url": url, data: {orderId: this.orderID, user_id: this.user_id}}).then(result => {
        let parsed = JSON.parse(JSON.stringify(result.data));
        alert("Order confirmed!");
        this.getCart();
        console.log(parsed);
      }, error => {
        console.log(error);
      });
    },


    removeCart: function (event) {
      let url = `http://localhost:3000/cart?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { 
        this.getCart();
        alert("Removed Item");
      }  
      , error => {
        console.log(error);
      });
    },

    totalCartPrice: function () {
      if(this.cart.length == 0) {
        return 0;
      }
      let acc = 0;
      for(let i=0; i<this.cart.length; i++) {
        acc += this.cart[i].price * this.cart[i].quantity;
        console.log(this.cart[i]);
      }
      console.log(acc);
      return acc;
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

    formatMoney (price) {
      const lv = Math.floor(price/100).toString();
      const st = Math.floor(price % 100).toString().padStart(2, '0');
      const final_str = '€' + lv + ',' + st;
      return final_str;
    },

  },
}

</script>
