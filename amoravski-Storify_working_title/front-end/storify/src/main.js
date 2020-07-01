import Vue from 'vue';
import VueRouter from 'vue-router';

import EmptyHeader from './components/EmptyHeader.vue';
import Header from './components/FrontOffice/Header.vue';
import Products from './components/FrontOffice/Products.vue';
import Orders from './components/FrontOffice/Orders.vue';
import Login from './components/FrontOffice/Login.vue';
import Register from './components/FrontOffice/Register.vue';
import VerifyEmail from './components/FrontOffice/VerifyEmail.vue';
import ForgotPassword from './components/FrontOffice/ForgotPassword.vue';
import BOHeader from './components/BackOffice/BOHeader';
import BOProducts from './components/BackOffice/BOProducts.vue';
import BOOrders from './components/BackOffice/BOOrders.vue';
import BOUsers from './components/BackOffice/BOUsers.vue';
import BORoles from './components/BackOffice/BORoles.vue';
import BOLogin from './components/BackOffice/BOLogin.vue';
import BORegister from './components/BackOffice/BORegister.vue';

// Config
Vue.config.productionTip = false; // Disables annoying text in console

// Router
Vue.use(VueRouter);
const routes = [
    { path: '/', name: 'Header', component: Header },
    { path: '/products', name: 'Products', component: Products },
    { path: '/orders', name: 'Orders', component: Orders },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/verify', name: 'Verify', component: VerifyEmail },
    { path: '/forgot', name: 'Forgot', component: ForgotPassword },
    { path: '/bo', name: 'BOHeader', component: BOHeader },
    { path: '/boproducts', name: 'BOProducts', component: BOProducts },
    { path: '/boorders', name: 'BOOrders', component: BOOrders },
    { path: '/bousers', name: 'BOUsers', component: BOUsers },
    { path: '/boroles', name: 'BORoles', component: BORoles },
    { path: '/bologin', name: 'BOLogin', component: BOLogin },
    { path: '/boregister', name: 'BORegister', component: BORegister },
];
const router = new VueRouter({
    mode: 'history',
    routes
});

// Main instance mount
new Vue({
    router,
    render: h => h(EmptyHeader)
}).$mount('#app');
