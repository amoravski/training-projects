<template>
  <div>
    <div>
      {{ permission.name }}
      {{ permission.status ? "Active" : "Inactive" }}
    <button v-if="!permission.status && interfaces.includes('roles_u')" style="background-color: green" v-on:click="added" >
      Add
    </button>
    <button v-if="permission.status && interfaces.includes('roles_u')" style="background-color: red" v-on:click="revoked" >
      Revoke
    </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BOPermission',
  props: [ 'permission', 'interfaces'],

  methods: {

    added () {
      this.$emit('added', this.permission.id);
    },

    revoked () {
      this.$emit('revoked', this.permission.id);
    },
  }
}
</script>
