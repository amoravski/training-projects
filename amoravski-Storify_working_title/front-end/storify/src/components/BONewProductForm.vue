<template>
  <div id="newProduct">
    <form ref="form">
      <input name="name" v-model="product.name">
      <input name="price" v-model="product.price">
      <input name="quantity" v-model="product.quantity">
      <input name="tag" v-model="product.tag">
      <a href="#" v-on:click="submit">SUBMIT</a>
    </form>
  </div>
</template>

<script>

export default {
  name: 'newProduct',
  data: () => { return {product: {name: '',price: 0, quantity:0, tag: ''}} },
  methods: {
    submit () {
      this.$emit('created', this.product);
    }
  }
}

</script>
