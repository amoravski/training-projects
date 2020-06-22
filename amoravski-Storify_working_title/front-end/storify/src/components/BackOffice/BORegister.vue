<template>
  <div id="register">
      <Header />
      <h2>Admin register</h2>
      <label for="username">Username:</label>
      <input v-model="form.username" name="username" type="text">

      <label for="email">Email:</label>
      <input v-model="form.email" name="email" type="email">

      <label for="roles">Roles:</label>
      <input v-model="form.roles" name="roles" type="text">

      <label for="password">Password:</label>
      <input v-model="form.password" name="password" type="password">

      <label for="confirmPassword">Confirm Password:</label>
      <input v-model="form.confirmPassword" name="confirmPassword" type="password">

      <input v-on:click="submitCaptcha" type="submit" value="Submit">
      <vueRecaptcha
        ref="recaptcha"
        @verify="onCaptchaVerified"
        @expired="onCaptchaExpired"
        size="invisible"
        sitekey="6LfC1KYZAAAAAEd9uwB-RfhhhUUFDRq1ENdlJ2Vw">
      </vueRecaptcha>
  </div>
</template>

<script>
import axios from 'axios';
import Header from './BOHeader.vue';

import vueRecaptcha from 'vue-recaptcha';

export default {
  name: 'Register',

  components: { Header, vueRecaptcha },

  data () {
    return {
      form: {
        username: '',
        email: '',
        roles: '',
        password: '',
        confirmPassword: '',
      },
    }
  },

  mounted () {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicits')
      document.head.appendChild(recaptchaScript)
  },

  methods: {

    submit (recaptchaToken) {
      if(this.form.password != this.form.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + 'admin';
      let roles = this.form.roles.split(',');
      axios({ method:"POST", "url": url, "data": {userName: this.form.username, email: this.form.email, roles: roles, password: this.form.password, token: recaptchaToken}})
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

    onCaptchaVerified: function (recaptchaToken) {
      this.$refs.recaptcha.reset();
      this.submit(recaptchaToken);
    },

    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    },

    submitCaptcha: function () {
      this.$refs.recaptcha.execute();
    }

  }
};
</script>
