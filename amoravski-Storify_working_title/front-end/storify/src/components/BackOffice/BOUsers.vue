<template>
  <div id="users">
      <Header />
      <h2>Users</h2>
      <label for="searchTerm"><b>Search: </b></label>
      <input v-model="searchTerm" type="text" id="searchTerm"/>
      <button v-on:click="search">Search</button>
    <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th style="text-align:right">Created at</th>
            <th></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <BOUser @removed="removeUser"  v-for="user in users" v-bind:key="user.id" v-bind:user=user />
        </tbody>
    </table>

    <!--Pages-->
    <button v-if="page" v-on:click="goBackwardsPage">&lt;</button>
    <button>{{ page+1 }}</button>
    <button v-if="(page+1)*10 < usersCount" v-on:click="goForwardsPage">&gt;</button>

    <!--Empty page-->
    <h3 v-if="empty">None found! :(</h3>
  </div>
</template>

<script>
import axios from 'axios';
import BOUser from './BOUser.vue';
import Header from './BOHeader.vue';

export default {
  name: 'BOUsers',
  components: { Header, BOUser },

  data () {
    return {
      users : [], 
      searchTerm : "",
      empty: false,
      lowerPrice: 0,
      upperPrice: 0,
      page: 0,
      usersCount: 0,
      asc: false,
      nameSort: false,
      priceSort: false,
    };
  },

  mounted () {
    this.getUsers(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
  },
  methods: {
    search: function () {
      this.page = 0;
      this.getUsers(this.searchTerm,this.searchTerm, this.lowerPrice, this.upperPrice);
    },

    getUsers: function (name) {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `account?offset=${this.page*10}&limit=10`;
      url += name ? `&name=${name}` : '';
      url += this.nameSort ? `&sort=name` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.users = parsed.accounts; 
            this.usersCount = parsed.count; 
            if(this.users.length == 0) {
              this.empty= true;
            }
            else {
              this.empty = false;
            }
          },
          error => {
            console.log(error);
          }
        );
    },

    removeUser: function (event) {
      var url = `http://localhost:3000/account?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { this.getUsers(this.searchTerm, this.searchTerm);
        }
      , error => {
        console.log(error);
      });
    },

    goForwardsPage: function() {
      this.page++;
      this.getUsers(this.searchTerm,this.searchTerm);
    },

    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getUsers(this.searchTerm,this.searchTerm);
      }
    },
  }
}
</script>
