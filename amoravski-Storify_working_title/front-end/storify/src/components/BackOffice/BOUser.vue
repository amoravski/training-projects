<template>
    <tr>
      <td>{{ user.id }}</td>
      <td>{{ user.user_name }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.status_name }}</td>
      <td>{{ formatDate() }}</td>

      <!-- Buttons -->
      <td v-if="!updateFormActive" >
        <button style="background-color: red" v-on:click="removed" >
          Remove
        </button>
      </td>

      <td>
        <button style="background-color: green" v-on:click="toggleUpdateForm" >
          Change password
        </button>
      </td>

      <td>
        <button style="background-color: green" >
          Edit
        </button>
      </td>

    </tr>
</template>

<script>
export default {
  name: 'BOUser',
  props: [ 'user' ],

  data () {
    return { updateFormActive: false };
  },

  methods: {
    formatDate () {
      const date_time = this.user.created_at.split('T');
      return date_time[0] + ' ' + date_time[1].split('.')[0];
    },

    // Raise 'removed' event for BOUsers, pass id
    removed () {
      this.$emit('removed', this.user.id);
    },

    toggleUpdateForm () {
      this.updateFormActive = !this.updateFormActive;
    },
  }
}
</script>
