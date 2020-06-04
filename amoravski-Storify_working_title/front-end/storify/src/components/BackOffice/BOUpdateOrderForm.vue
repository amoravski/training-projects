<template>
  <div>
    <form @submit.prevent="submit" ref="form">
      <label for="name">Name:</label>
      <input name="name" type="text" v-model="order_up.name" id="name">

      <label for="price">Price (lv.):</label>
      <input name="price" step="0.01" type="number" v-model="order_up.price" min="1" id="price">

      <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="order_up.quantity" min="1" id="quantity">

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>

export default {
  name: 'BOUpdateProductForm',
  props: [ 'order' ],

  data () { 
    return {
      order_up: {
        id: this.order.id,
        name: this.order.name,
        price: this.order.price,
        quantity:this.order.quantity,
      },
      errors: []}
  },
  methods: {

    submit () {
      let formData = new FormData();
      formData.append("id", this.order_up.id);
      formData.append("name", this.order_up.name);
      formData.append("price", this.order_up.price);
      formData.append("quantity", this.order_up.quantity);
      this.$emit('update', formData);
    },

    fileChange () {
      const file = this.$refs.file.files[0];
      this.order_up.file = file;
    },

    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (this.order.price < 0) {
        this.errors.push('Price must be under 0');
      }

      if (!this.errors.length) {
        this.submit();
        return true;
      }

    },

  }
};
</script>
