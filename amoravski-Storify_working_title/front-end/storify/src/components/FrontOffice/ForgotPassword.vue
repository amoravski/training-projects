<template>
  <div id="reset">
      <Header />
      <div v-if="resetId">
        <label for="password">New password:</label>
        <input v-model="password" name="password" type="password">

        <label for="confirmPassword">Confirm password:</label>
        <input v-model="confirmPassword" name="confirmPassword" type="password">

        <input v-on:click="resetPassword" type="submit" value="Submit">
      </div>
      <div v-if="!resetId">
        <label for="email">Email:</label>
        <input v-model="email" name="email" type="text">

        <input v-on:click="sendResetEmail" type="submit" value="Submit">
      </div>
  </div>
</template>

<script>
import Header from './Header.vue';
import axios from 'axios';
export default {
  name: 'ForgotPassword',

  components: { Header },
  
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
  },

  methods: {
    resetPassword: function () {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `forgot`;
      if(this.password!=this.confirmPassword) {
        return;
      }
      axios({ method:"POST", "url": url, data: {id: this.resetId, password: this.password}})
        .then(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    },

    sendResetEmail: function () {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `forgot?email=${this.email}`;
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
  }
}
</script>
