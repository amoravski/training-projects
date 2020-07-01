<template>
    <tr>
      <td>
        {{ role.name }}
      </td>

      <td>
        <BOPermission v-for="permission in permissions" v-bind:key="permission.id" v-bind:permission="permission" v-bind:interfaces=interfaces @added="addPermission" @revoked="revokePermission"/>
      </td>
      <td>
        <button v-if="interfaces.includes('roles_d')" style="background-color: red" v-on:click="removed" >
          Remove
        </button>
      </td>
    </tr>
</template>

<script>
import axios from 'axios';
import BOPermission from './BOPermission';
export default {
  name: 'BORole',
  props: [ 'role', 'token', 'interfaces' ],

  components: { BOPermission },

  data () {
    return {
        permissions: [],
        empty: false,
    };
  },

  mounted () {
    this.getPermissions();
  },

  methods: {

    removed () {
      this.$emit('removed', this.role.id);
    },

    getPermissions: function () {
      // Build url
        const backendurl = 'http://localhost:3000/';
        let url = backendurl + `permissions?id=${this.role.id}&token=${this.token}`;

      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.permissions = parsed.permissions; 
          },
          error => {
            console.log(error.response);
            alert(error.response.data.message);
          }
        );
    },

    addPermission: function (event) {
      var url = `http://localhost:3000/permissions`;
      axios({ method:"PUT", "url": url, data: { roleId: this.role.id, permissionId: event, token: this.token}}).then(() => { 
          alert("Added permission");
          this.getPermissions();
        }
      , error => {
        console.log(error);
        alert(error.response.data.message);
      });
    },

    revokePermission: function (event) {
      var url = `http://localhost:3000/permissions?permissionId=${event}&roleId=${this.role.id}&token=${this.token}`
      axios({ method:"DELETE", "url": url}).then(() => { 
          alert("Revoked permission");
          this.getPermissions();
        }
      , error => {
        console.log(error);
        alert(error.response.data.message);
      });
    },
  },
}
</script>
