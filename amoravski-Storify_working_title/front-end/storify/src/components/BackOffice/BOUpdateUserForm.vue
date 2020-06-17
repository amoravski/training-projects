<template>
  <div>
    <form @submit.prevent="submit" ref="form">

      <label for="date">StartedAt:</label>
      <div name="date" id="date">
        <input v-model="date" type="date" id="date" />
        <input v-model="time" type="time" id="time" />
      </div>

      <label for="email">Email:</label>
      <input name="email" type="text" v-model="user_up.email" id="email">

      <label for="user_name">User Name:</label>
      <input name="user_name" type="text" v-model="user_up.user_name" id="user_name">

      <label for="password">Password:</label>
      <input name="password" type="text" v-model="user_up.password" id="password">

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'BOUpdateOrderForm',
  props: [ 'user' ],

  data () { 
    return {
      user_up: {
        id: this.user.id,
        created_at: this.user.created_at,
        user_name: this.user.user_name,
        password: '',
        email: this.user.email,
        status: this.user.status_name,
      },
      time: format(new Date(this.user.created_at), 'HH:mm:ss'),
      date: format(new Date(this.user.created_at), 'yyyy-MM-dd'),
      errors: []
    }
  },

  methods: {
    submit () {
      console.log(this.date + 'T' + this.time + '.000+03');
      this.user_up.created_at = new Date(this.date + 'T' + this.time).toISOString(),
      this.$emit('update', this.user_up);
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
