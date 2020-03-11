<template>
  <div class="product">
    <h3>{{ product.name }}</h3>
    <p>
      <b>Tags:</b> {{ tagsList() }}
      <b>Quantity:</b> {{ product.quantity }}
      <b>Price:</b> {{ product.price }} лв.
    </p>
    <button v-on:click="removed" >Remove</button>
    <button v-on:click="updateActive" >{{formActive ? "Close Form" : "Update"}}</button>
    <BOUpdateProductForm @update="updated" v-if="formActive" :product="product" @close="formActive = false"/>
  </div>
</template>

<script>
import BOUpdateProductForm from './BOUpdateProductForm.vue';

export default {
  name: 'BOProduct',
  props: [ 'product' ],
  components: { BOUpdateProductForm },
  data () {
    return { formActive: false };
  },
  methods:
  {
    removed () {
      this.$emit('removed', this.product.id);
    },
    updated (event) {
      this.$emit('updated', event);
      this.formActive = false;
    },
    updateActive () {
      this.formActive = !this.formActive;
    },
    tagsList () {
      var tags = '';
      for(var i=0; i<this.product.tags.length; i++) {
        tags += this.product.tags[i];
        tags += ','
      }
      tags = tags.substring(0, tags.length -1);
      return tags;
    }
  }
}

</script>
