import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        hideNavbar: true
      }
    },
    // 登录视图
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/UserLogin.vue'),
      meta: {
        hideNavbar: true
      }
    },
    {
      path: '/home',
      name: 'userHome',
      component: () => import('../views/UserHome.vue')
    },
    {
      path: '/upload',
      name: 'UploadFish',
      component: () => import('../views/UploadFish.vue')
    },
    {
      path: '/check',
      name: 'CheckFish',
      component: () => import('../views/CheckFish.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminHome.vue'),
      meta: {
        hideNavbar: true
      }
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: () => import('../views/UserFavorite.vue')
    }
  ]
})

export default router
