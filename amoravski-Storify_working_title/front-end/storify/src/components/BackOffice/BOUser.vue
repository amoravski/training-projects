<template>
    <tr>
      <td>{{ user.id }}</td>
      <td>{{ user.user_name }}</td>
      <td>{{ formatDate() }}</td>
    </tr>
</template>

<script>
export default {
  name: 'BOUser',
  props: [ 'user' ],

  methods: {
    formatDate () {
      const date_time = this.user.created_at.split('T');
      return date_time[0] + ' ' + date_time[1].split('.')[0];
    },

  }
}
</script>
