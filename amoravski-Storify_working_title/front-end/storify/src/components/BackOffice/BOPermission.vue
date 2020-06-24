<template>
  <div>
    <div>
      {{ permission.name }}
    </div>
    <div>
      {{ permission.status }}
    </div>
    <button v-if="permission.status=='active'" style="background-color: green" v-on:click="added" >
      Add
    </button>
    <button v-if="permission.status=='inactive'" style="background-color: red" v-on:click="revoked" >
      Revoke
    </button>
  </div>
</template>

<script>
export default {
  name: 'BORole',
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
