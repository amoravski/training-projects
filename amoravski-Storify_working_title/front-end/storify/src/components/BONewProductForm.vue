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
        <label for="name">Name:</label>
        <input name="name" type="text" v-model="product.name" id="name">
      </p>
      <p>
        <label for="tag">Tag:</label>
        <input name="tag" type="text" v-model="product.tag" id="tag">
      </p>
      <p>
        <label for="price">Price (lv.):</label>
        <input name="price" type="number" v-model="product.price" min="1" id="price">
      </p>
      <p>
        <label for="quantity">Quantity:</label>
        <input name="quantity" type="number" v-model="product.quantity" min="1" id="quantity">
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  </div>
</template>

<script>

export default {
  name: 'newProduct',
  data: () => { return {product: {name: '',price: 1, quantity:1, tag: ''}, errors: []}},
  methods: {
    submit () {
      this.$emit('created', this.product);
    },
    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (this.product.price < 0) {
        this.errors.push('Price must not be under 0');
      }

      if (!this.errors.length) {
        this.submit();
        return true;
      }

    }
  }
}

</script>
