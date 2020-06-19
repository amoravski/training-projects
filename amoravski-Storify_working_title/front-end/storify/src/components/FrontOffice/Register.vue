<template>
  <div id="register">
      <Header />
      <h2>Register</h2>
      <label for="username">Username:</label>
      <input v-model="form.username" name="username" type="text">

      <label for="email">Email:</label>
      <input v-model="form.email" name="email" type="email">

      <label for="address">Address:</label>
      <input v-model="form.address" name="address" type="text">

      <label for="phone">Phone:</label>
      <input v-model="form.phone" name="email" type="phone">

      <label for="password">Password:</label>
      <input v-model="form.password" name="password" type="password">

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
import vueRecaptcha from 'vue-recaptcha';
import Header from './Header.vue';

export default {
  name: 'Register',

  components: { Header, vueRecaptcha },

  data () {
    return {
      form: {
        username: '',
        email: '',
        phone: '',
        address: '',
        password: ''
      },
    }
  },

  mounted () {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.j?onload=vueRecaptchaApiLoaded&render=explicits')
      document.head.appendChild(recaptchaScript)
  },

  methods: {

    submit (recaptchaToken) {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + 'account';
      axios({ method:"POST", "url": url, "data": {userName: this.form.username, email: this.form.email, password: this.form.password, phone: this.form.phone, address: this.form.address, recaptchaToken: recaptchaToken}})
        .then(
          () => {
            alert("Account made, please log in");
            this.$router.push({ name: 'Login'});
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
