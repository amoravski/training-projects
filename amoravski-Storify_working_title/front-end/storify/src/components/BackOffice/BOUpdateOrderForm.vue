<template>
  <div>
    <form @submit.prevent="submit" ref="form">
      <label for="name">Name:</label>
      <input name="name" type="text" v-model="order_up.name" id="name">

      <label for="value">Price (lv.):</label>
      <input name="value" step="0.01" type="number" v-model="order_up.value" min="1" id="value">

      <label for="quantity">Quantity:</label>
      <input name="quantity" type="number" v-model="order_up.quantity" min="1" id="quantity">

      <input type="submit" value="Submit">
    </form>
  </div>
</template>

<script>

export default {
  name: 'BOUpdateOrderForm',
  props: [ 'order' ],

  data () { 
    return {
      order_up: {
        startedAt: this.order.started_at,
        id: this.order.id,
        name: this.order.name,
        value: this.order.value,
        status: this.order.status_name,
        quantity:this.order.quantity,
      },
      errors: []
    }
  },

  methods: {
    submit () {
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
