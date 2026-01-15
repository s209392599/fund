import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/login/login.vue';
import LoginBoxue from '@/views/login/login_boxue.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  // {
  //   path: '/',
  //   name: 'Preview',
  //   component: () => import('@/views/preview/preview.vue'),
  // },
  {
    path: '/boxue',
    name: 'Login_boxue',
    component: LoginBoxue,
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/preview/preview.vue'),
  },
];
/*
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isUserLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
*/

// const base = process.env.BASE_URL || '/';
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
