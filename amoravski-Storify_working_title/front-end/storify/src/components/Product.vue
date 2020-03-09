<template>
  <span>
    <h3>{{ product.name }}</h3>
    <p>
      Tag: {{ product.tag }}
      Quantity: {{ product.quantity }}
      Price: {{ product.price }} лв.
    </p>
  </span>
</template>

<script>

export default {
  name: 'Product',
  props: [ 'product' ]
}

</script>
