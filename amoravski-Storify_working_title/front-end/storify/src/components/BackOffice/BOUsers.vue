<template>
  <div id="users">
      <Header />
      <h2>Users</h2>


    <div>
      <label for="idFilter"><b>Id search: </b></label>
      <input style="width: 40rem;" v-model="idFilter" type="text" id="idFilter"/>
      <label for="nameFilter"><b>Name search: </b></label>
      <input style="width: 40rem;" v-model="nameFilter" type="text" id="nameFilter"/>
      <label for="emailFilter"><b>Email search: </b></label>
      <input style="width: 40rem;" v-model="emailFilter" type="text" id="emailFilter"/>
    </div>


    <div>
      <label for="statusFilter"><b>Status: </b></label>
      <select style="width: 40rem;" id="statusFilter" v-model="statusFilter">
        <option value="unverified">Unverified</option>
        <option value="verified">Verified</option>
        <option value="deleted">Deleted</option>
        <option value=""></option>
      </select >
    </div>


    <div>
      Date filter: from
      <input v-model="date.lower" type="date" id="lower-date" />
      <input v-model="time.lower" type="time" id="lower-time" />
      to
      <input v-model="date.upper" type="date" id="upper-date" />
      <input v-model="time.upper" type="time" id="upper-time" />
    </div>

    <button v-on:click="search">Search</button>

    <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <BOUser @updated="updateUser" @removed="removeUser"  v-for="user in users" v-bind:key="user.id" v-bind:user=user />
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
      nameFilter : "",
      emailFilter : "",
      idFilter : "",
      statusFilter : "",
      empty: false,
      date: {
        lower: '',
        upper: '',
      },
      time: {
        lower: '',
        upper: '',
      },
      page: 0,
      usersCount: 0,
      asc: false,
    };
  },

  mounted () {
    this.getUsers();
  },

  methods: {
    search: function () {
      this.page = 0;
      this.getUsers();
    },

    getUsers: function () {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `account?offset=${this.page*10}&limit=10`;

      url += this.idFilter ? `&id=${this.idFilter}` : '';
      url += this.nameFilter ? `&userName=${this.nameFilter}` : '';
      url += this.emailFilter ? `&email=${this.emailFilter}` : '';
      url += this.statusFilter ? `&status=${this.statusFilter}` : '';
      url += this.date.upper && this.time.upper ? `&lowerDate=${this.date.lower + 'T' +this.time.lower}&upperDate=${this.date.upper + 'T' +this.time.upper}` : '';

      url += this.sort ? `&sort=${this.sort}` : '';
      url += this.asc ? `&ord=asc` : '&ord=desc';
      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            console.log(parsed)
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

    updateUser: function(event) {
      var url = `http://localhost:3000/account`
      console.log(event);
      axios({ method:"PUT", "url": url, data: event}).then(() => {
          alert("Updated user");
          this.getUsers();
        }
      , error => {
        console.log(error);
      });
    },

    removeUser: function (event) {
      var url = `http://localhost:3000/account?id=${event}`
      axios({ method:"DELETE", "url": url}).then(() => { this.getUsers();
        }
      , error => {
        console.log(error);
      });
    },

    goForwardsPage: function() {
      this.page++;
      this.getUsers();
    },

    goBackwardsPage: function() {
      if(this.page>0) {
        this.page--;
        this.getUsers();
      }
    },
  }
}
</script>
