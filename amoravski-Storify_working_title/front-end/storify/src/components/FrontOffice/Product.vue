<template>
  <tr>
      <!-- Properties -->
      <td><img width="150" :src=product.picture_path ></td>
      <td>{{ product.name }}</td>
      <td style="text-align:right">{{ formatMoney() }}</td>
      <td>{{ product.quantity ? "В наличност" : "Out of stock" }}</td>
      <td>{{ formatTags() }}</td>

      <!-- Buttons -->
      <td>
        <button style="background-color: green" v-on:click="buyToggle">
          Buy
        </button>
      </td>

      <!-- Forms -->
      <td>
        <BuyProductForm @bought="bought" v-if="buyForm" :product="product" @close="formActive = false" />
      </td>
    </tr>
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

    // Catch bought event from BuyProductForm
    bought (event) {
      this.$emit('bought', event);
      this.buyForm = false;
    },

    // Toggle BuyProductForm
    buyToggle () {
      this.buyForm = !this.buyForm;
    },

    formatTags () {
      let tags = '';
      for(let i=0; i<this.product.tags.length; i++) {
        tags += this.product.tags[i];
        tags += ','
      }
      tags = tags.substring(0, tags.length -1);
      return tags;
    },

    formatMoney () {
      const lv = Math.floor(this.product.price/100).toString();
      const st = Math.floor(this.product.price % 100).toString().padStart(2, '0');
      const final_str = lv + ',' + st + ' лв.';
      return final_str;
    },

  }
};
</script>
