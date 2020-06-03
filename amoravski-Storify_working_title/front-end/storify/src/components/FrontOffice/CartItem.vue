<template>
  <tr>
      <!-- Properties -->
      <td>{{ cartItem.name }}</td>
      <td style="text-align:right">{{ formatMoney(cartItem.price, 1) }}</td>
      <td>лв.</td>
      <td>{{ cartItem.quantity }}</td>
      <td style="text-align:right">{{ formatMoney(cartItem.price, cartItem.quantity) }}</td>
      <td>лв.</td>
      <!-- Buttons -->
      <td>
        <button style="background-color: red" v-on:click="removeCart">
          Remove
        </button>
      </td>
    </tr>
</template>

<script>
export default {
  name: 'Product',
  props: [ 'cartItem' ],

  data () {
    return { buyForm: false };
  },

  methods :
  {

    // Catch bought event from BuyProductForm
    removeCart () {
      this.$emit('removed', this.cartItem.id);
      this.buyForm = false;
    },

    formatMoney (price, quantity) {
      const lv = Math.floor(quantity * this.cartItem.price/100).toString();
      const st = Math.floor(this.cartItem.price % 100).toString().padStart(2, '0');
      const final_str = lv + ',' + st;
      return final_str;
    },

  }
};
</script>
