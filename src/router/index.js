import { createRouter, createWebHashHistory } from 'vue-router';

import Login from '@/views/login/login.vue';
import Register from '@/views/login/register.vue';
import Preview from '@/views/preview/preview.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/preview',
    name: 'Preview',
    component: Preview,
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
