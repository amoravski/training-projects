<template>
  <div id="newRole">
    <form @submit.prevent="submit" ref="form">
      <label for="name">Name:</label>
      <input name="name" type="text" v-model="name" id="name">
      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>

export default {
  name: 'newProduct',

  data () { 
    return {
      name: '',
    }
  },

  methods: {

    // Raise 'created' event for BOProducts to handle
    submit () {
      this.$emit('created', this.name);
    },


    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (!this.errors.length) {
        this.submit();
        return true;
      }

    },

  }
};
</script>
