<template>
  <tr>
      <!-- Properties -->
      <td>{{ cartItem.name }}</td>
      <td style="text-align:right">{{ formatMoney() }}</td>
      <td>{{ cartItem.quantity }}</td>

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

    formatMoney () {
      const lv = Math.floor(this.cartItem.quantity * this.cartItem.price/100).toString();
      const st = Math.floor(this.cartItem.price % 100).toString().padStart(2, '0');
      const final_str = lv + ',' + st + ' лв.';
      return final_str;
    },

  }
};
</script>
