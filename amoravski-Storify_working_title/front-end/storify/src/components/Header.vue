<template>
  <div id="app">
    <header>
      <h1>Storify</h1>
      <router-link tag="button" class="router_link" to="/products">Client products</router-link> 
      <router-link tag="button" class="router_link" to="/boproducts">Admin products</router-link>
      <router-link tag="button" class="router_link" to="/boorders">Admin order</router-link>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
/* Header component, has all routes */
export default {
  name: 'Header',
}
</script>
