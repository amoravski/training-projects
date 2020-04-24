import Vue from 'vue';
import VueRouter from 'vue-router';

import Header from './components/Header.vue';
import Products from './components/FrontOffice/Products.vue';
import BOProducts from './components/BackOffice/BOProducts.vue';
import BOOrders from './components/BackOffice/BOOrders.vue';

// Config
Vue.config.productionTip = false; // Disables annoying text in console

// Router
Vue.use(VueRouter);
const routes = [
    { path: '/products', component: Products },
    { path: '/boproducts', component: BOProducts },
    { path: '/boorders', component: BOOrders },
];
const router = new VueRouter({
    mode: 'history',
    routes
});

// Main instance mount
new Vue({
    router,
    render: h => h(Header)
}).$mount('#app');
