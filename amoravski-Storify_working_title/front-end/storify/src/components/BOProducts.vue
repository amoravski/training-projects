<template>
  <div id="products">
      <h1>Product List, Back Office</h1>
      <label for="filter">Filter: <br/></label>
      <input v-model="filter" type="text" id="filter"/>
      <button v-on:click="search">Search</button>
      <BOProduct @updated="updateProduct" @removed="removeProduct" v-for="product in products" v-bind:key="product.id" v-bind:product=product />
      <h3 v-if="empty">None found! :(</h3>
      <BONewProductForm @created="createProduct" />
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
    return { products : [], filter : "", empty: false}
  },
  mounted () {
    this.getProducts('','');
  },
  methods: {
    search: function () {
      this.getProducts(this.filter,this.filter);
    },
    getProducts: function (name, tag) {
      var url = "http://localhost:3000/product"
      if (name && tag) {
        url = `http://localhost:3000/product?name=${name}&tag=${tag}`
      }
      axios({ method:"GET", "url": url}).then(result => {
        this.products = JSON.parse(JSON.stringify(result.data.json)).products;
        console.log(this.products);
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
    removeProduct: function (event) {
      var url = `http://localhost:3000/product?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { this.getProducts(this.filter, this.filter);
        }
      , error => {
        console.log(error);
      });
    },
    createProduct: function(event) {
      var url = `http://localhost:3000/product`
      axios({ method:"POST", "url": url, data: event}).then(() => { this.getProducts(this.filter, this.filter);
        }
      , error => {
        console.log(error);
      });
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
