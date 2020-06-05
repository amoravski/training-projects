<template>
  <div id="register">
      <Header />
      <h2>Admin register</h2>
      <label for="username">Username:</label>
      <input v-model="form.username" name="username" type="text">

      <label for="email">Email:</label>
      <input v-model="form.email" name="email" type="email">

      <label for="password">Password:</label>
      <input v-model="form.password" name="password" type="password">

      <input v-on:click="submit" type="submit" value="Submit">
  </div>
</template>

<script>
import axios from 'axios';
import Header from './BOHeader.vue';

export default {
  name: 'Register',

  components: { Header },

  data () {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
    }
  },

  methods: {

    submit () {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + 'admin';
      axios({ method:"POST", "url": url, "data": {userName: this.form.username, email: this.form.email, password: this.form.password}})
        .then(
          () => {
            alert("Account made");
          },
          error => {
            const resp = error.response.data.message;
            alert(resp);
          }
        );
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
