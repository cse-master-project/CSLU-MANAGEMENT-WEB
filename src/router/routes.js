const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/admin',
    component: () => import('layouts/admin.vue'), // 관리자용 레이아웃
    children: [
      { path: '', component: () => import('adminpages/index.vue') },
      {
        path: 'adminCreate',
        component: () => import('adminpages/adminCreate.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
