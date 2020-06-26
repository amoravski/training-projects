<template>
  <div>
    <div>
      {{ permission.name }}
      {{ permission.status ? "Active" : "Inactive" }}
    <button v-if="!permission.status" style="background-color: green" v-on:click="added" >
      Add
    </button>
    <button v-if="permission.status" style="background-color: red" v-on:click="revoked" >
      Revoke
    </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BOPermission',
  props: [ 'permission' ],

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
