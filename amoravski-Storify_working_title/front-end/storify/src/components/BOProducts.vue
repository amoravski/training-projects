<template>
  <div id="products">
      <h2>Product List, Back Office</h2>
      <p>
      <button v-on:click="triggerFilters">Filters</button>
      </p>
      <div v-if="filters" class="bordered">

      <p>
      <label for="lower-price">Lower bound price:</label>
      <input v-model="lowerPrice" type="number" id="lower-price" min=0/>
    </p>
      <p>
      <label for="upper-price">Upper bound price:</label>
      <input v-model="upperPrice" type="number" id="upper-price" min=0/>
    </p>
      <p>
      <button v-on:click="sortProductsNameAscending">Ascending name</button>
      <button v-on:click="sortProductsNameDescending">Descending name</button>
    </p>
      <p>
      <button v-on:click="sortProductsPriceAscending">Ascending price</button>
      <button v-on:click="sortProductsPriceDescending">Descending price</button>
    </p>
      </div>
      <p>
        <label for="filter"><b>Search: </b></label>
        <input v-model="filter" type="text" id="filter"/>
      </p>
      <p>
      <button v-on:click="search">Search</button>
      </p>

      <p>
      <button v-if="!newForm" v-on:click="newFormButton">New Product</button>
      </p>
      <p>
      <button v-if="newForm" v-on:click="newFormButton">Close Form</button>
      </p>
      <BONewProductForm v-if="newForm" @created="createProduct" />
      <div class="products">
      <BOProduct @updated="updateProduct" @removed="removeProduct" v-for="product in products" v-bind:key="product.id" v-bind:product=product />
      </div>
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
    return { products : [], filter : "", empty: false, newForm: false, lowerPrice: 0, upperPrice: 0, filters: false}
  },
  mounted () {
    this.getProducts('','');
  },
  methods: {
    search: function () {
      this.getProducts(this.filter,this.filter, this.lowerPrice, this.upperPrice);
    },
    triggerFilters: function () {
      this.filters = !this.filters;
    },
    getProducts: function (name, tag, lowerPrice, upperPrice) {
      var url = "http://localhost:3000/product"
      var appended = false
      if (name) {
        url += appended ? `&name=${name}` : `?name=${name}`
        appended = true
      }
      if (tag) {
        url += appended ? `&tag=${tag}` : `?tag=${tag}`
        appended = true
      }
      if (upperPrice > 0 && this.filters){
        url += appended ? `&lowerPrice=${lowerPrice}&upperPrice=${upperPrice}` : `?lowerPrice=${lowerPrice}&upperPrice=${upperPrice}`
        appended = true
      }
      axios({ method:"GET", "url": url}).then(result => {
        this.products = JSON.parse(JSON.stringify(result.data.json)).products;
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
    }
  }
}

</script>
