<template>
  <div align="left">
    <form @submit.prevent="submit" ref="form">
      <p v-if="errors.length">
        <b>Errors:</b>
        <ul>
          <li v-for="error in errors" :key=error>{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
      <input name="name" type="text" v-model="product_up.name" id="name">
      </p>
      <p>
        <label for="tag">Tag:</label>
      <input name="tag" type="text" v-model="product_up.tag" id="tag">
      </p>
      <p>
        <label for="price">Price (lv.):</label>
      <input name="price" type="number" v-model="product_up.price" min="0" id="price">
      </p>
      <p>
        <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="product_up.quantity" min="0" id="quantity">
      </p>
      <p>
      <input type="submit" value="Submit">
      </p>
    </form>
  </div>
</template>

<script>

export default {
  name: 'BOUpdateProductForm',
  props: [ 'product' ],
  data: function () { return {product_up: { id: this.product.id, name: this.product.name,price: this.product.price, quantity:this.product.quantity, tag: this.product.tag}, errors: []} },
  methods: {
    submit () {
      this.$emit('update', this.product_up);
    },
    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (this.product.price < 0) {
        this.errors.push('Price must be under 0');
      }

      if (!this.errors.length) {
        this.submit();
        return true;
      }

    }
  }
}

</script>
