<template>
    <tr>
      <td v-if="!updateFormActive">{{ user.id }}</td>
      <td v-if="!updateFormActive">{{ user.user_name }}</td>
      <td v-if="!updateFormActive">{{ user.email }}</td>
      <td v-if="!updateFormActive">{{ user.status_name }}</td>
      <td v-if="!updateFormActive">{{ new Date(user.created_at).toLocaleString() }}</td>

      <!-- Buttons -->
      <td v-if="!updateFormActive" >
        <button style="background-color: red" v-on:click="removed" >
          Remove
        </button>
      </td>

      <td>
        <button style="background-color: green" v-on:click="toggleUpdateForm" >
          {{updateFormActive ? "Close Form" : "Edit"}}
        </button>
      </td>


      <BOUpdateUserForm @update="updated" v-if="updateFormActive" :user="user" />
    </tr>
</template>

<script>
import BOUpdateUserForm from './BOUpdateUserForm.vue';
export default {
  name: 'BOUser',
  props: [ 'user' ],

  components: { BOUpdateUserForm },

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

    // Transmit 'updated' event 
    updated (event) {
      this.$emit('updated', event);
      this.updateFormActive = false;
    },

    toggleUpdateForm () {
      this.updateFormActive = !this.updateFormActive;
    },
  }
}
</script>
