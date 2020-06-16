<template>
  <div>
    Email Activated, redirecting you shortly
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'VerifyEmail',
  
  data () {
    return {
      loggedIn: false,
      userName: '',
      verificationId: this.$route.query.verificationId
    }
  },

  mounted () {
    if(this.verificationId) {
      this.verifyAccount();
    }
    this.$router.push({name: 'Products'});
  },

  methods: {
    verifyAccount: function () {
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `verification?id=${this.verificationId}`;
      axios({ method:"GET", "url": url})
        .then(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
}
</script>
