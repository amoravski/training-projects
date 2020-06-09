<template>
  <div id="newProduct">
    <form @submit.prevent="submit" ref="form" enctype="multipart/form-data">
      <label for="name">Name:</label>
      <input name="name" type="text" v-model="product.name" id="name">

      <label for="tag">Tags:</label>
      <input name="tags" type="text" v-model="product.tags" id="tag">

      <label for="price">Price (lv.):</label>
      <input name="price" step="0.01" type="number" v-model="product.price" min="1" id="price">

      <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="product.quantity" min="1" id="quantity">

      <input ref="file" @change="fileChange" type="file" multiple name="file" accept="image/*" id="file"/>

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>

export default {
  name: 'newProduct',

  data () { 
    return {
      product: {
        name: '',
        price: 1,
        quantity:1,
        tags: '',
        file: ''
      }, 
      errors: []
    }
  },

  methods: {

    // Raise 'created' event for BOProducts to handle
    submit () {
      let formData = new FormData();
      let tags = this.product.tags.split(',');
      tags = tags.map((str) => { return str.trim();});
      formData.append("name", this.product.name);
      formData.append("price", Math.floor(this.product.price * 100));
      formData.append("quantity", this.product.quantity);
      formData.append("tags", JSON.stringify(tags));
      formData.append("file", this.product.file);
      this.$emit('created', formData);
    },

    fileChange () {
      const file = this.$refs.file.files[0];
      this.product.file = file;
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

    },

  }
};
</script>
