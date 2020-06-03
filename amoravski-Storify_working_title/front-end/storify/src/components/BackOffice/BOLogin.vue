<template>
  <div id="login">
      <Header />
      <label for="email">Email:</label>
      <input v-model="form.email" name="email" type="text">

      <label for="password">Password:</label>
      <input v-model="form.password" name="password" type="password">

      <input v-on:click="submit" type="submit" value="Submit">
  </div>
</template>

<script>
import axios from 'axios';
import Header from './BOHeader.vue';

export default {
  name: 'Login',

  components: { Header },

  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      token: ''
    }
  },

  methods: {

    submit () {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + 'authentication';
      axios({ method:"POST", "url": url, "data": {email: this.form.email, password: this.form.password}})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.token = parsed.token; 
            localStorage.setItem('JWT_account_storify', this.token);
            this.$router.push({ name: 'BOProducts'});
          },
          error => {
            console.log(error);
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
