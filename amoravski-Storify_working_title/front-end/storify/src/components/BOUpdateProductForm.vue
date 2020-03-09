<template>
  <div>
    <form ref="form">
      <input name="name" v-model="product_up.name">
      <input name="price" v-model="product_up.price">
      <input name="quantity" v-model="product_up.quantity">
      <input name="tag" v-model="product_up.tag">
      <a href="#" v-on:click="submit">SUBMIT</a>
    </form>
  </div>
</template>

<script>

export default {
  name: 'BOUpdateProductForm',
  props: [ 'product' ],
  data: function () { return {product_up: { id: this.product.id, name: this.product.name,price: this.product.price, quantity:this.product.quantity, tag: this.product.tag}} },
  methods: {
    submit () {
      this.$emit('update', this.product_up);
    }
  }
}

</script>
