<template>
  <div id="orders">
      <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th style="text-align:right">Value(total)</th>
              <th>Quantity</th>
              <th>Started at</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <BOOrder  v-for="order in orders" v-bind:key="order.id" v-bind:order=order />
          </tbody>
      </table>
  </div>
</template>

<script>
import axios from 'axios';
import BOOrder from './BOOrder.vue';

export default {
  name: 'BOOrders',
  components: { BOOrder },
  data () {
    return { orders: [] };
  },
  mounted () {
    this.getOrders();
  },
  methods: {
    getOrders: function () {
      const url = 'http://localhost:3000/orderTEMP';
      axios({ method:"GET", "url": url}).then(result => {
        const parsed = JSON.parse(JSON.stringify(result.data));
        this.orders = parsed.orders;
      }, error => {
        console.log(error);
      });
    }
  }
}
</script>
