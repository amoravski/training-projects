<template>
  <div id="products">
      <h2>Product List, Back Office</h2>
      <div class="bordered">

      <label for="lower-price">Lower bound price:</label>
      <input style="width: 10rem;" v-model="lowerPrice" type="number" id="lower-price" min=0/>
      <label for="upper-price">Upper bound price:</label>
      <input style="width: 10rem;" v-model="upperPrice" type="number" id="upper-price" min=0/>
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
                <th>ID</th>
                <th v-on:click="sortProductsNameAlternating">Name</th>
                <th v-on:click="sortProductsPriceAlternating">Price</th>
                <th>Quantity</th>
                <th>Tags</th>
                <th></th>
                <th></th>
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
import BOProduct from './BOProduct.vue';
import BONewProductForm from './BONewProductForm.vue';

export default {
  name: 'BOProducts',
  components: {BOProduct, BONewProductForm},
  data () {
    return { products : [], filter : "", empty: false, newForm: false, lowerPrice: 0, upperPrice: 0, filters: false, nameSort: true, priceSort: true, page: 0, count:0}
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
      var appended = true
      if (name) {
        url += appended ? `&name=${name}` : `?name=${name}`
        appended = true
      }
      if (tag) {
        url += appended ? `&tag=${tag}` : `?tag=${tag}`
        appended = true
      }
      if (upperPrice > 0){
        url += appended ? `&lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}` : `?lowerPrice=${lowerPrice * 100}&upperPrice=${upperPrice * 100}`
        appended = true
      }
      axios({ method:"GET", "url": url}).then(result => {
        var parsed = JSON.parse(JSON.stringify(result.data));
        this.products = parsed.products; 
        this.count = parsed.count; 
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
    sortProductsNameAlternating: function () {
      if(this.nameSort) {
        this.nameSort = false;
        this.sortProductsNameAscending();
        return
      }
      this.nameSort = true;
      this.sortProductsNameDescending();
      return
    },
    sortProductsNameAscending: function () {
     function compareNameAscending(a, b) {
        return (a.name).localeCompare(b.name);
     }
     this.products = this.products.sort(compareNameAscending);
    },
    sortProductsNameDescending: function () {
     function compareNameDescending(a, b) {
        return (b.name).localeCompare(a.name);
     }
     this.products = this.products.sort(compareNameDescending);
    },
    sortProductsPriceAlternating: function () {
      if(this.priceSort) {
        this.priceSort = false;
        this.sortProductsPriceAscending();
        return
      }
      this.priceSort = true;
      this.sortProductsPriceDescending();
      return
    },
    sortProductsPriceAscending: function () {
     function comparePriceAscending(a, b) {
        if ( a.price < b.price ){
         return -1;
        }
        if ( a.price > b.price ){
         return 1;
        }
       return 0;
     }
     this.products = this.products.sort(comparePriceAscending);
    },
    sortProductsPriceDescending: function () {
     function comparePriceDescending(a, b) {
        if ( a.price < b.price ){
         return 1;
        }
        if ( a.price > b.price ){
         return -1;
        }
       return 0;
     }
     this.products = this.products.sort(comparePriceDescending);
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
