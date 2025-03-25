// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/auth.service'

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
    meta: { requiresGuest: true } // Solo para usuarios no autenticados
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register/Register.vue'),
    meta: { requiresGuest: true } // Solo para usuarios no autenticados
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User/User.vue'),
    meta: { requiresAuth: true } // Requiere autenticación
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart/Cart.vue'),
    meta: { requiresAuth: true } // Requiere autenticación
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/views/Payment/Payment.vue'),
    meta: { requiresAuth: true } // Requiere autenticación
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product/Product.vue'),
  },
  {
    path: '/productdetails',
    name: 'Productdetails',
    component: () => import('@/views/Producdetails/Productdetails.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/terms/terms.vue'),
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

router.beforeEach(async (to, from, next) => {
  const storedUser = localStorage.getItem('user')
  const storedSessionToken = localStorage.getItem('session_token')
  const isAuthenticated = !!storedUser && !!storedSessionToken
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    
    try {
      const isValid = await authService.verifyToken(storedSessionToken)
      if (!isValid) {
        // Limpiar localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('user_token')
        localStorage.removeItem('session_token')
        localStorage.removeItem('session_active')
        
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
      
      next()
    } catch (error) {
      console.error('Error al verificar token:', error)
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  } 
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next({ name: 'Home' })
      return
    }
    next()
  } 
  else {
    // Rutas públicas
    next()
  }
})

export default router;