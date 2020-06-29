<template>
    <tr>
      <!-- Properties -->
      <td v-if="!updateFormActive" >{{ product.id }}</td>
      <td v-if="!updateFormActive" >{{ product.name }}</td>
      <td style="text-align:right" v-if="!updateFormActive" >{{ formatMoney() }}</td>
      <td v-if="!updateFormActive" >{{ product.quantity }}</td>
      <td v-if="!updateFormActive" >{{ formatTags() }}</td>

      <!-- Buttons -->
      <td v-if="!updateFormActive && interfaces.includes('products_d')" >
        <button style="background-color: red" v-on:click="removed" >
          Remove
        </button>
      </td>
      <td v-if="interfaces.includes('products_u')">
        <button style="background-color: green" v-on:click="toggleUpdateForm" >
          {{updateFormActive ? "Close Form" : "Edit"}}
        </button>
      </td>

      <!-- Forms -->
      <BOUpdateProductForm @update="updated" v-if="updateFormActive" :product="product" @close="updateFormActive = false"/>
    </tr>
</template>

<script>
import BOUpdateProductForm from './BOUpdateProductForm.vue';

export default {
  name: 'BOProduct',
  props: [ 'product', 'interfaces' ],
  components: { BOUpdateProductForm },

  data () {
    return { updateFormActive: false };
  },

  methods: {

    // Raise 'removed' event for BOProducts, pass id
    removed () {
      this.$emit('removed', this.product.id);
    },

    // Transmit 'updated' event from BOUpdateProductForm to BOProducts
    updated (event) {
      this.$emit('updated', event);
      this.updateFormActive = false;
    },

    toggleUpdateForm () {
      this.updateFormActive = !this.updateFormActive;
    },

    formatTags () {
      var tags = '';
      for(var i=0; i<this.product.tags.length; i++) {
        tags += this.product.tags[i];
        tags += ',';
      }
      tags = tags.substring(0, tags.length -1);
      return tags;
    },

    formatMoney () {
      const lv = Math.floor(this.product.price/100).toString();
      const st = Math.floor(this.product.price % 100).toString().padStart(2, '0');
      const final_str = '€' + lv + ',' + st;
      return final_str;
    },

  }
};
</script>
