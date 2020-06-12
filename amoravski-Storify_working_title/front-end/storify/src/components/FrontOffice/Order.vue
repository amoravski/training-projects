<template>
    <tr>
      <td>{{ formatDate() }}</td>
      <td>{{ order.name }}</td>
      <td style="text-align:right">{{ formatMoney(order.value, 1) }} </td>
      <td>{{ order.quantity }}</td>
      <td style="text-align:right">{{ formatMoney(order.value, order.quantity) }} </td>
      <td>{{ order.status_name }}</td>
    </tr>
</template>

<script>

export default {
  name: 'BOOrder',
  props: [ 'order' ],

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
