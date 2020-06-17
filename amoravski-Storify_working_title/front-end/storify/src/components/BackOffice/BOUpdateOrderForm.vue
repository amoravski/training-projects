<template>
  <div>
    <form @submit.prevent="submit" ref="form">

      <label for="date">StartedAt:</label>
      <div name="date" id="date">
        <input v-model="date" type="date" id="date" />
        <input v-model="time" type="time" id="time" />
      </div>

      <label for="value">Price (lv.):</label>
      <input name="value" step="0.01" type="number" v-model="order_up.value" min="1" id="value">

      <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="order_up.quantity" min="1" id="quantity">

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'BOUpdateOrderForm',
  props: [ 'order' ],

  data () { 
    return {
      order_up: {
        startedAt: this.order.started_at,
        id: this.order.id,
        value: this.order.value,
        status: this.order.status_name,
        quantity:this.order.quantity,
      },
      time: format(new Date(this.order.started_at), 'HH:mm:ss'),
      date: format(new Date(this.order.started_at), 'yyyy-MM-dd'),
      errors: []
    }
  },

  methods: {
    submit () {
      console.log(this.date + 'T' + this.time + '.000+03');
      this.order_up.startedAt = new Date(this.date + 'T' + this.time).toISOString(),
      this.$emit('update', this.order_up);
    },

    checkForm: function (e) {
      e.preventDefault();
      this.errors = [];
      if (this.order.value < 0) {
        this.errors.push('Price must be under 0');
      }

      if (!this.errors.length) {
        this.submit();
        return true;
      }

    },

  }
};
</script>
