<template>
  <div id="app">
    <header style="padding: 20px 10px;">
      <h1 style="float:left;">Storify</h1>
      <div v-if="loggedIn" style="float:right;">
        Welcome, {{ userName }}
        <router-link tag="button" class="router_link" to="/products">Products</router-link> 
        <button v-on:click="logout">Logout</button>
      </div>
      <div v-if="!loggedIn" style="float:right;">
        <router-link tag="button" class="router_link" to="/products">Products</router-link> 
        <router-link tag="button" class="router_link" to="/login">Login</router-link>
        <router-link tag="button" class="router_link" to="/register">Register</router-link>
      </div>
    </header>
    <hr/>
  </div>
</template>

<script>
/* Header component, has all routes */
import jwt_decode from 'jwt-decode';
export default {
  name: 'Header',
  
  data () {
    return {
      loggedIn: false,
      userName: '',
    }
  },

  mounted () {
    if(typeof localStorage.getItem('JWT_account_storify') != undefined && localStorage.getItem('JWT_account_storify') != null) {
      this.loggedIn = true;
      let jwt = localStorage.getItem('JWT_account_storify');
      this.userName = jwt_decode(jwt).userName;
    }
  },

  methods: {
    logout: function () {
      if(typeof localStorage.getItem('JWT_account_storify') != undefined && localStorage.getItem('JWT_account_storify') != null) {
        localStorage.removeItem('JWT_account_storify');
        this.loggedIn = false;
        window.location.reload();
      }
    }
  }
}
</script>
