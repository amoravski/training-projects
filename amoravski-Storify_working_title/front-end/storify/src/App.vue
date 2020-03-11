<template>
  <div id="app">
    <header>
    <h1>Storify</h1>
    <hr>
      <router-link tag="button" class="router_link" to="/products">Client products</router-link> 
      <router-link tag="button" class="router_link" to="/boproducts">Admin products</router-link>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>
