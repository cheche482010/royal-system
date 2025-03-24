// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home', 
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'), 
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User/User.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart/Cart.vue'),
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product/Product.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/Register.vue'),
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/views/Payment/Payment.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/terms/terms.vue'),
  },
  {
    path: '/productdetails',
    name: 'Productdetails',
    component: () => import('@/views/Producdetails/Productdetails.vue'),
  },
  {
    path: '/:pathMatch(.*)*', 
    name: '404',
    component: () => import('@/views/error/404/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;