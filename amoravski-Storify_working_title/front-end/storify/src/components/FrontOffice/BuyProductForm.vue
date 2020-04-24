<template>
  <div id="newProduct">
    <form @submit.prevent="submit" ref="form">
        <label for="quantity">Quantity:</label>
        <input name="quantity" type="number" v-model="product_buy.quantity" id="quantity" min=1>
        <input type="submit" value="Add to cart">
    </form>
  </div>
</template>

<script>
export default {
  name: 'BuyProductForm',
  props: [ 'product' ],
  data () { 
    return {
      product_buy: {
        id: this.product.id,
        quantity: 1,
        name: this.product.name,
        price: this.product.price
      },
      errors: [],
    }
  },
  methods: {
    // Raise 'bought' event for Product to handle
    submit () {
      this.$emit('bought', this.product_buy);
    },
    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (!this.errors.length) {
        this.submit();
        return true;
      }
      return false;
    }
  }
}
</script>
