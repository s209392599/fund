import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/index.vue'),
    redirect: '/index/fund09',
    children: [
      {
        path: 'home', // 查看
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'selfHome', // 查看
        name: 'selfHome',
        component: () => import('../views/selfHome.vue'),
      },
      {
        path: 'fund06',
        name: 'fund06',
        component: () => import('../components/fund06.vue'), //综合观察
      },
      {
        path: 'fund02',
        name: 'fund02',
        component: () => import('../components/fund02.vue'),
      },
      {
        path: 'fund03', //历史收益
        name: 'fund03',
        component: () => import('../components/fund03.vue'),
      },
      {
        path: 'fund04', //历史净值
        name: 'fund04',
        component: () => import('../components/fund04.vue'),
      },
      {
        path: 'fund05', //业绩表现
        name: 'fund05',
        component: () => import('../components/fund05.vue'),
      },
      {
        path: 'fund07', // 网页地址导航
        name: 'fund07',
        component: () => import('../components/fund07.vue'),
      },
      {
        // 均线
        path: 'fund08',
        name: 'fund08',
        component: () => import('../components/fund08.vue'),
      },
      {
        // 今日收益
        path: 'fund09',
        name: 'fund09',
        component: () => import('../components/fund09.vue'),
      },
      {
        // 累计净值
        path: 'fund10',
        name: 'fund10',
        component: () => import('../components/fund10.vue'),
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('../views/edit.vue'),
      },
      {
        path: 'selfEdit', //自选的编辑
        name: 'selfEdit',
        component: () => import('../views/selfEdit.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
