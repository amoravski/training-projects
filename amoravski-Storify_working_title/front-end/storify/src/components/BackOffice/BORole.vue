<template>
    <tr>
      <td>
        <BOPermission v-for="permission in permissions" v-bind:key="permission.id" v-bind:permission="permission">
      </td>
      <td>
        <button style="background-color: red" v-on:click="removed" >
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
  props: [ 'role' ],

  componetns: { BOPermission },

  data () {
    return {
      permissions: []
    };
  },

  methods: {

    removed () {
      this.$emit('removed', this.role.id);
    },

    getPermissions: function () {
      // Build url
      const backendurl = 'http://localhost:3000/';
      let url = backendurl + `permissions`;

      // Make request
      axios({ method:"GET", "url": url})
        .then(
          result => {
            let parsed = JSON.parse(JSON.stringify(result.data));
            this.permissions = parsed.permissions; 
            if(this.permissions.length == 0) {
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

    removePermissions: function (event) {
      var url = `http://localhost:3000/permissions?permissionId=${event}&roleId=${this.role.id}`
      axios({ method:"DELETE", "url": url}).then(() => { 
          this.getPermissions();
        }
      , error => {
        console.log(error);
        alert(error.response.data.message);
      });
    },
  }
}
</script>
