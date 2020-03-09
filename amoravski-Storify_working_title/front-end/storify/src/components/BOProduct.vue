<template>
  <span>
    <h3>{{ product.name }}</h3>
    <p>
      Tag: {{ product.tag }}
      Quantity: {{ product.quantity }}
      Price: {{ product.price }} лв.
    </p>
    <button v-on:click="removed" >Remove</button>
    <button v-on:click="updateActive" >Update</button>
    <BOUpdateProductForm @update="updated" v-if="formActive" :product="product" @close="formActive = false"/>
  </span>
</template>

<script>
import BOUpdateProductForm from './BOUpdateProductForm.vue';

export default {
  name: 'BOProduct',
  props: [ 'product' ],
  components: { BOUpdateProductForm },
  data () {
    return { formActive: null };
  },
  methods:
  {
    removed () {
      this.$emit('removed', this.product.id);
    },
    updated (event) {
      console.log(event)
      this.$emit('updated', event);
      this.formActive = false;
    },
    updateActive () {
      this.formActive = true;
    }
  }
}

</script>
