<template>
  <div id="roles">
    <Header />
    <h2>Roles</h2>

    <table>
      <thead>
        <tr>
          <th>Role name</th>
          <th>Permissions</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <BORole @removed="removeRole" v-for="role in roles" v-bind:key="role.id" v-bind:role=role v-bind:token=token v-bind:interfaces=interfaces />
      </tbody>
    </table>

    <!--Empty page-->
    <h3 v-if="empty">None found! :(</h3>
  </div>
</template>

<script>
//import jwt_decode from 'jwt-decode';
import axios from 'axios';
  
import BORole from './BORole.vue';
import Header from './BOHeader.vue';

export default {
  name: 'BORoles',
  components: { Header, BORole },

  data () {
    return {
      roles : [], 
    token: '',
    empty: false,
    interfaces: [],
    };
  },

  mounted () {
    if(typeof localStorage.getItem('JWT_admin_account_storify') != undefined && localStorage.getItem('JWT_admin_account_storify') != null) {
      let jwt = localStorage.getItem('JWT_admin_account_storify');
      this.token = jwt;
    }
    this.getRoles();
    this.getInterfaces();
  },

  methods: {
    getRoles: function () {
      // Build url
      const backendurl = `http://localhost:3000/`;
      let url = backendurl + `roles?token=${this.token}`;

      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.roles = parsed.roles; 
            if(this.roles.length == 0) {
              this.empty= true;
            }
            else {
              this.empty = false;
            }
          },
          error => {
            console.log(error);
            alert(error.response.data.message);
          }
        );
    },

    removeRole: function (event) {
      var url = `http://localhost:3000/roles?roleId=${event}&token=${this.token}`
      axios({ method:"DELETE", "url": url}).then(() => { 
          alert("Removed Role");
          this.getRoles();
        }
      , error => {
        console.log(error);
            alert(error.response.data.message);
      });
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
