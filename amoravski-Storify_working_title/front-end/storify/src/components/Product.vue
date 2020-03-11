<template>
  <div class="product">
    <h3>{{ product.name }}</h3>
    <p>
      <b>Tags:</b> {{ tagsList() }}
      <b>Quantity:</b> {{ product.quantity }}
      <b>Price:</b> {{ product.price }} лв.
    </p>
    <button v-on:click="buyToggle">
      Buy
    </button>
    <BuyProductForm @bought="bought" v-if="buyForm" :product="product" @close="formActive = false" />
  </div>
</template>

<script>

import BuyProductForm from './BuyProductForm.vue';

export default {
  name: 'Product',
  props: [ 'product' ],
  components: { BuyProductForm },
  data () {
    return { buyForm: false };
  },
  methods :
  {
    bought (event) {
      this.$emit('bought', event);
      this.buyForm = false;
    },
    buyToggle () {
      this.buyForm = !this.buyForm;
    },
    tagsList () {
      var tags = '';
      for(var i=0; i<this.product.tags.length; i++) {
        tags += this.product.tags[i];
        tags += ','
      }
      tags = tags.substring(0, tags.length -1);
      return tags;
    }
  }
}

</script>
