<template>
  <div id="BOHeader">
    <header style="padding: 20px 10px;">
      <h1 style="float:left;">Storify, BO</h1>
      <div v-if="loggedIn" style="float:right;">
        Welcome, {{ userName + ' Roles: ' + formatRoles() }}
        <router-link v-if="roles.includes('accountant') || roles.includes('product_manager')" tag="button" class="router_link" to="/boproducts">Products</router-link>
        <router-link v-if="roles.includes('accountant')"  tag="button" class="router_link" to="/boorders">Orders</router-link>
        <router-link v-if="roles.includes('user_admin')" tag="button" class="router_link" to="/bousers">Users</router-link>
        <router-link v-if="roles.includes('user_admin')" tag="button" class="router_link" to="/boroles">Roles</router-link>
        <button v-on:click="logout">Logout</button>
      </div>
      <div v-if="!loggedIn" style="float:right;">
        <router-link tag="button" class="router_link" to="/bologin">Login</router-link>
        <router-link tag="button" class="router_link" to="/boregister">Register</router-link>
      </div>
    </header>
    <hr/>
  </div>
</template>

<script>
/* Header component, has all routes */
import jwt_decode from 'jwt-decode';
export default {
  name: 'BOHeader',
  
  data () {
    return {
      loggedIn: false,
      userName: '',
      roles: [],
    }
  },
  mounted () {
    if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
      this.loggedIn = true;
      let jwt = localStorage.getItem('JWT_admin_account_storify');
      this.roles = jwt_decode(jwt).roles;
      this.userName = jwt_decode(jwt).userName;
    }
  },

  methods: {
    logout: function () {
      if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
        localStorage.removeItem('JWT_admin_account_storify');
        this.loggedIn = false;
        this.$router.push({ name: 'BOLogin'});
      }
    },

    formatRoles: function () {
      var roles = '';
      for(var i=0; i<this.roles.length; i++) {
        roles += this.roles[i];
        roles += ',';
      }
      roles = roles.substring(0, roles.length -1);
      return roles;
    }
  }
}
</script>
