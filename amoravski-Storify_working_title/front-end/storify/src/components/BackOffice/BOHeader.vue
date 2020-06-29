<template>
  <div id="BOHeader">
    <header style="padding: 20px 10px;">
      <h1 style="float:left;">Storify, BO</h1>
      <div v-if="loggedIn" style="float:right;">
        Welcome, {{ userName + ' Roles: ' + formatRoles() }}
        <router-link v-if="interfaces.includes('products_r')" tag="button" class="router_link" to="/boproducts">Products</router-link>
        <router-link v-if="interfaces.includes('orders_r')"  tag="button" class="router_link" to="/boorders">Orders</router-link>
        <router-link v-if="interfaces.includes('users_r')" tag="button" class="router_link" to="/bousers">Users</router-link>
        <router-link v-if="interfaces.includes('roles_r')" tag="button" class="router_link" to="/boroles">Roles</router-link>
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
import axios from 'axios';
export default {
  name: 'BOHeader',
  
  data () {
    return {
      loggedIn: false,
      userName: '',
      token: '',
      roles: [],
      interfaces: []
    }
  },
  mounted () {
    if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
      this.loggedIn = true;
      let jwt = localStorage.getItem('JWT_admin_account_storify');
      this.token = jwt;
      this.roles = jwt_decode(jwt).roles;
      this.userName = jwt_decode(jwt).userName;
      this.getInterfaces();
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
    },

    getInterfaces: function () {
      const backendurl = `http://localhost:3000/`;
      let url = backendurl + `roles/interfaces?token=${this.token}`;
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.interfaces = parsed.interfaces; 
          },
          error => {
            console.log(error);
            alert(error.response.data.message);
          }
        );
    },
  }
}
</script>
