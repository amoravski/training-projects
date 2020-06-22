<template>
  <div id="reset">
      <Header />
      <div v-if="resetId">
        <label for="password">New password:</label>
        <input v-model="password" name="password" type="password">

        <label for="confirmPassword">Confirm password:</label>
        <input v-model="confirmPassword" name="confirmPassword" type="password">

        <input v-on:click="resetPassword" type="submit" value="Submit">
        <vueRecaptcha
          ref="recaptcha"
          @verify="onCaptchaVerifiedPassword"
          @expired="onCaptchaExpired"
          size="invisible"
          sitekey="6LfC1KYZAAAAAEd9uwB-RfhhhUUFDRq1ENdlJ2Vw">
        </vueRecaptcha>
      </div>
      <div v-if="!resetId">
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="text">

        <input v-on:click="sendResetEmail" type="submit" value="Submit">
        <vueRecaptcha
          ref="recaptcha"
          @verify="onCaptchaVerifiedEmail"
          @expired="onCaptchaExpired"
          size="invisible"
          sitekey="6LfC1KYZAAAAAEd9uwB-RfhhhUUFDRq1ENdlJ2Vw">
        </vueRecaptcha>
      </div>
  </div>
</template>

<script>
import Header from './Header.vue';
import axios from 'axios';
import vueRecaptcha from 'vue-recaptcha';
export default {
  name: 'ForgotPassword',

  components: { Header, vueRecaptcha },

  data () {
    return {
      loggedIn: false,
      userName: '',
      password: '',
      email: '',
      confirmPassword: '',
      resetId: this.$route.query.resetId
    }
  },

  mounted () {
      let recaptchaScript = document.createElement('script');
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicits');
      document.head.appendChild(recaptchaScript);
  },
  
  methods: {
    resetPassword: function (recaptchaToken) {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `forgot`;
      if(this.password!=this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      axios({ method:"POST", "url": url, data: {id: this.resetId, password: this.password, recaptchaToken: recaptchaToken}})
        .then(
          result => {
            alert("Password reset, log in");
            this.$router.push({ name: 'Login'});
            console.log(result);
          },
          error => {
            alert("Link expired");
            console.log(error);
          }
        );
    },

    sendResetEmail: function (recaptchaToken) {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `forgot?email=${this.email}&recaptchaToken=${recaptchaToken}`;
      axios({ method:"GET", "url": url})
        .then(
          result => {
            console.log(result);
            alert("Email sent");
          },
          error => {
            console.log(error);
          }
        );
    },

    onCaptchaVerifiedEmail: function (recaptchaToken) {
      this.$refs.recaptcha.reset();
      this.sendResetEmail(recaptchaToken);
    },

    onCaptchaVerifiedPassword: function (recaptchaToken) {
      this.$refs.recaptcha.reset();
      this.resetPassword(recaptchaToken);
    },

    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    },

    submitCaptcha: function () {
      this.$refs.recaptcha.execute();
    }
  }
}
</script>
