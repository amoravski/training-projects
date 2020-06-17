<template>
    <tr>
      <td v-if="!updateFormActive">{{ new Date(order.started_at).toLocaleString() }}</td>
      <td v-if="!updateFormActive">{{ order.id }}</td>
      <td v-if="!updateFormActive">{{ order.paypal_id }}</td>
      <td v-if="!updateFormActive">{{ order.name }}</td>
      <td v-if="!updateFormActive">{{ order.user_name }}</td>
      <td  v-if="!updateFormActive" style="text-align:right">{{ formatMoney(order.value, 1) }} </td>
      <td v-if="!updateFormActive">{{ order.quantity }}</td>
      <td  v-if="!updateFormActive" style="text-align:right">{{ formatMoney(order.value, order.quantity) }} </td>
      <td v-if="!updateFormActive">{{ order.status_name }}</td>

      <!-- Buttons -->
      <td v-if="!updateFormActive && order.status_name == 'not_paid'" >
        <button style="background-color: red" v-on:click="removed" >
          Remove
        </button>
      </td>
      <td v-if="order.status_name == 'not_paid'">
        <button style="background-color: green" v-on:click="toggleUpdateForm" >
          {{updateFormActive ? "Close Form" : "Edit"}}
        </button>
      </td>
      <td v-if="order.status_name == 'paid'">
        <button style="background-color: green" v-on:click="dispatch" >
          Dispatch
        </button>
      </td>
      <td v-if="order.status_name == 'paid'">
      </td>
      <td v-if="order.status_name == 'dispatched'">
      </td>
      <td v-if="order.status_name == 'dispatched'">
      </td>
      <BOUpdateOrderForm @update="updated" v-if="updateFormActive" :order="order" />
    </tr>
</template>

<script>
import BOUpdateOrderForm from './BOUpdateOrderForm.vue';

export default {
  name: 'BOOrder',
  props: [ 'order' ],

  components: { BOUpdateOrderForm },

  data () {
    return { updateFormActive: false };
  },

  methods: {
    formatMoney (value, quantity) {
      const total_money = value*quantity;
      const lv = Math.floor(total_money / 100).toString();
      const st = Math.floor(total_money % 100).toString().padStart(2, '0');
      const final_str = '€' + lv + ',' + st;
      return final_str;
    },

    formatDate () {
      const date_time = this.order.started_at.split('T');
      return date_time[0] + ' ' + date_time[1].split('.')[0];
    },

    // Raise 'removed' event for BOProducts, pass id
    removed () {
      this.$emit('removed', this.order.id);
    },

    dispatch () {
      this.$emit('dispatched', this.order.id);
    },

    // Transmit 'updated' event from BOUpdateOrderForm to BOProducts
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
