<template>
  <div id="products">
      <Header />
      <h2>Products</h2>
      <div class="bordered">
        Price filter: from
        <input style="width: 10rem;" v-model="lowerPrice" type="number" id="lower-price" min=0/>
        to
        <input style="width: 10rem;" v-model="upperPrice" type="number" id="upper-price" min=0/>
        €
      </div>
        <label for="filter"><b>Search: </b></label>
        <input v-model="filter" type="text" id="filter"/>
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
                <th>Quantity</th>
                <th>Tags</th>
                <th></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <BOProduct @updated="updateProduct" @removed="removeProduct" v-for="product in products" v-bind:key="product.id" v-bind:product=product />
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
import Header from './BOHeader.vue';
import BOProduct from './BOProduct.vue';
import BONewProductForm from './BONewProductForm.vue';

export default {
  name: 'BOProducts',
  components: {Header, BOProduct, BONewProductForm},
  data () {
    return { products : [], filter : "", empty: false, newForm: false, lowerPrice: 0, upperPrice: 0, filters: false, sort: '', page: 0, count:0}
  },
  mounted () {
    this.getProducts('','');
  },
  methods: {
    search: function () {
      this.page = 0
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
    },
    triggerFilters: function () {
      this.filters = !this.filters;
    },
    getProducts: function (name, tag, lowerPrice, upperPrice) {
      var url = `http://localhost:3000/product?offset=${this.page*10}&limit=10`
      url += name ? `&name=${name}` : '';
      url += tag ? `&tag=${tag}` : '';
      url += this.sort ? `&sort=${this.sort}` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      url += upperPrice > 0 ? `&lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}` : '';
      url += this.count ? '&returnCount=false' : '&returnCount=true';
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
      this.sort = 'value'
      this.asc = !this.asc
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
      return
    },

    sortProductsIdAlternating: function () {
      this.page = 0;
      this.sort = 'id'
      this.asc = !this.asc
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
      return
    },

    sortProductsNameAlternating: function () {
      this.page = 0;
      this.sort = 'name'
      this.asc = !this.asc
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
      return
    },

    removeProduct: function (event) {
      var url = `http://localhost:3000/product?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { this.getProducts(this.filter, this.filter);
        }
      , error => {
        console.log(error);
      });
    },
    createProduct: function(event) {
      this.newForm = false;
      var url = `http://localhost:3000/product`
      axios({ method:"POST", "url": url, data: event}).then(() => { this.getProducts(this.filter, this.filter);
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
      axios({ method:"PUT", "url": url, data: event}).then(() => { this.getProducts(this.filter, this.filter);
        }
      , error => {
        console.log(error);
      });
    },
    goForwardsPage: function() {
      this.page++;
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
    },
    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
      }
    }
  }
}

</script>
