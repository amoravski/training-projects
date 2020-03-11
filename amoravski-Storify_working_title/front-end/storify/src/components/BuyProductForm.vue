<template>
  <div id="newProduct" class="bordered">
    <form @submit.prevent="submit" ref="form">
      <p v-if="errors.length">
        <b>Errors:</b>
        <ul>
          <li v-for="error in errors" :key=error>{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="quantity">Quantity:</label>
        <input name="quantity" type="number" v-model="product_buy.quantity" id="quantity" min=1>
      </p>
      <p>
        <input type="submit" value="Add to cart">
      </p>
    </form>
  </div>
</template>

<script>

export default {
  name: 'BuyProductForm',
  props: [ 'product' ],
  data () { return {product_buy: {id: this.product.id, quantity:1}, errors: []}},
  methods: {
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

    }
  }
}

</script>
