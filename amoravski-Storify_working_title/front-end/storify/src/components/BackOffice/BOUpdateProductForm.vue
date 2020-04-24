<template>
  <div>
    <form @submit.prevent="submit" ref="form" enctype="multipart/form-data">
      <label for="name">Name:</label>
      <input name="name" type="text" v-model="product_up.name" id="name">

      <label for="tag">Tags:</label>
      <input name="tags" type="text" v-model="product_up.tags" id="tag">

      <label for="price">Price (lv.):</label>
      <input name="price" step="0.01" type="number" v-model="product_up.price" min="1" id="price">

      <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="product_up.quantity" min="1" id="quantity">

      <input ref="file" @change="fileChange" type="file" multiple name="file" accept="image/*" id="file"/>

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>

export default {
  name: 'BOUpdateProductForm',
  props: [ 'product' ],

  data () { 
    return {
      product_up: {
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity:this.product.quantity,
        tags: this.product.tags.toString(),
        file: ''
      },
      errors: []}
  },
  methods: {

    submit () {
      let formData = new FormData();
      let tags = this.product_up.tags.split(',');
      tags = tags.map((str) => { return str.trim();});
      formData.append("id", this.product_up.id);
      formData.append("name", this.product_up.name);
      formData.append("price", this.product_up.price);
      formData.append("quantity", this.product_up.quantity);
      formData.append("tags", JSON.stringify(tags));
      formData.append("file", this.product_up.file);
      this.$emit('update', formData);
    },

    fileChange () {
      const file = this.$refs.file.files[0];
      this.product_up.file = file;
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

    },

  }
};
</script>
