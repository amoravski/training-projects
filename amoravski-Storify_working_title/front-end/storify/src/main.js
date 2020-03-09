import Vue from 'vue'
import VueRouter from 'vue-router'
import Products from './components/Products.vue';
import BOProducts from './components/BOProducts.vue';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    { path: '/products', component: Products },
    { path: '/boproducts', component: BOProducts }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
