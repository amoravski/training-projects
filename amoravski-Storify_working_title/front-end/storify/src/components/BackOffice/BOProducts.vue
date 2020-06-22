<template>
  <div id="products">
    <Header />
    <h2>Products</h2>

    <div>
      <label for="idFilter"><b>Id search: </b></label>
      <input style="width: 40rem;" v-model="idFilter" type="text" id="idFilter"/>
      <label for="nameFilter"><b>Name search: </b></label>
      <input style="width: 40rem;" v-model="nameFilter" type="text" id="nameFilter"/>
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
      <label for="tagsFilter"><b>Tags search: </b></label>
      <input style="width: 40rem;" v-model="tagsFilter" type="text" id="tagsFilter"/>
    </div>

    <button v-on:click="search">Search</button>
    <button v-if="!newForm" v-on:click="newFormButton">New Product</button>
    <button v-if="newForm" v-on:click="newFormButton">Close Form</button>

    <BONewProductForm v-if="newForm" @created="createProduct" />

    <table>
        <thead>
          <tr>
            <th v-on:click="sortProductsIdAlternating">ID</th>
            <th v-on:click="sortProductsNameAlternating">Name</th>
            <th v-on:click="sortProductsPriceAlternating">Price</th>
            <th v-on:click="sortProductsQuantityAlternating">Quantity</th>
            <th>Tags</th>
            <th></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <BOProduct @updated="updateProduct" @removed="removeProduct" v-for="product in products" v-bind:key="product.id" v-bind:product=product v-bind:roles=roles />
        </tbody>
    </table>

    <button v-if="page" v-on:click="goBackwardsPage">&lt;</button>
    <button>{{ page+1 }}</button>
    <button v-if="(page+1)*10 < count" v-on:click="goForwardsPage">&gt;</button>
    <h3 v-if="empty">None found! :(</h3>
  </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import Header from './BOHeader.vue';
import BOProduct from './BOProduct.vue';
import BONewProductForm from './BONewProductForm.vue';

export default {
  name: 'BOProducts',
  components: {Header, BOProduct, BONewProductForm},

  data () {
    return {
      products : [],
      nameFilter : "",
      idFilter : "",
      tagsFilter : "",
      empty: false,
      newForm: false,
      priceFilter: {
        lower: 0,
        upper: 0,
      },
      quantityFilter : {
        lower: 0,
        upper: 0,
      },
      asc: true,
      sort: '',
      page: 0,
      count:0,
      returnCount: true,
      roles: [],
    }
  },

  mounted () {
    if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
      let jwt = localStorage.getItem('JWT_admin_account_storify');
      this.roles = jwt_decode(jwt).roles;
    }
    this.getProducts();
  },

  methods: {
    search: function () {
      this.page = 0;
      this.returnCount = true;
      this.getProducts();
    },

    getProducts: function () {
      var url = `http://localhost:3000/product?offset=${this.page*10}&limit=10`

      url += this.nameFilter ? `&name=${this.nameFilter}` : '';
      url += this.idFilter ? `&id=${this.idFilter}` : '';
      url += this.tagsFilter ? `&tag=${this.tagsFilter}` : '';
      url += this.statusFilter ? `&status=${this.statusFilter}` : '';
      //url += tag ? `&tag=${tag}` : '';
      url += this.sort ? `&sort=${this.sort}` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += this.priceFilter.upper > 0 ? `&lowerPrice=${this.priceFilter.lower * 100}&upperPrice=${this.priceFilter.upper * 100}` : '';
      url += this.quantityFilter.upper > 0 ? `&lowerQuantity=${this.quantityFilter.lower}&upperQuantity=${this.quantityFilter.upper}` : '';
      url += this.returnCount ? '&returnCount=true' : '&returnCount=false';

      axios({ method:"GET", "url": url}).then(result => {
        var parsed = JSON.parse(JSON.stringify(result.data));
        this.products = parsed.products;
        if(typeof parsed.count != 'undefined' && parsed.count != null) {
          this.count = parsed.count;
        }
        if(this.products.length == 0) {
          this.empty= true;
        }
        else {
          this.empty = false;
        }
      }, error => {
        console.log(error);
      });
    },

    sortProductsPriceAlternating: function () {
      this.page = 0;
      this.sort = 'price'
      this.asc = !this.asc
      this.getProducts();
      return
    },

    sortProductsIdAlternating: function () {
      this.page = 0;
      this.sort = 'id'
      this.asc = !this.asc
      this.getProducts();
      return
    },

    sortProductsNameAlternating: function () {
      this.page = 0;
      this.sort = 'name'
      this.asc = !this.asc
      this.getProducts();
      return
    },

    sortProductsQuantityAlternating: function () {
      this.page = 0;
      this.sort = 'quantity'
      this.asc = !this.asc
      this.getProducts();
      return
    },

    removeProduct: function (event) {
      var url = `http://localhost:3000/product?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { this.getProducts();
        }
      , error => {
        console.log(error);
      });
    },

    createProduct: function(event) {
      this.newForm = false;
      var url = `http://localhost:3000/product`
      axios({ method:"POST", "url": url, data: event}).then(() => { this.getProducts();
        }
      , error => {
        console.log(error);
      });
    },
    newFormButton: function() {
      this.newForm = !this.newForm;
    },
    updateProduct: function(event) {
      var url = `http://localhost:3000/product`
      axios({ method:"PUT", "url": url, data: event}).then(() => { this.getProducts();
        }
      , error => {
        console.log(error);
      });
    },
    goForwardsPage: function() {
      this.page++;
      this.getProducts();
    },
    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getProducts();
      }
    }
  }
}

</script>
