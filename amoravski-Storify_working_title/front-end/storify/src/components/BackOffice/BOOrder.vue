<template>
    <tr>
      <td>{{ order.id }}</td>
      <td>{{ order.name }}</td>
      <td style="text-align:right">{{ formatMoney() }} </td>
      <td>{{ order.quantity }}</td>
      <td>{{ formatDate() }}</td>
      <td>{{ order.status_name }}</td>
    </tr>
</template>

<script>
export default {
  name: 'BOOrder',
  props: [ 'order' ],

  methods: {
    formatMoney () {
      const total_money = this.order.value*this.order.quantity;
      const lv = Math.floor(total_money / 100).toString();
      const st = Math.floor(total_money % 100).toString().padStart(2, '0');
      const final_str = lv + ',' + st + ' лв.';
      return final_str;
    },

    formatDate () {
      const date_time = this.order.started_at.split('T');
      return date_time[0] + ' ' + date_time[1].split('.')[0];
    },

  }
}
</script>
