const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/admin/adminLogin',
    component: () => import('pages/admin/adminLogin.vue'), // 관리자 로그인 페이지
  },
  {
    path: '/admin',
    component: () => import('layouts/admin.vue'), // 관리자용 레이아웃
    children: [
      { path: '', component: () => import('pages/admin/index.vue') },
      {
        path: 'adminCreate',
        component: () => import('pages/admin/adminCreate.vue'),
      },
      {
        path: 'adminManagement',
        component: () => import('pages/admin/adminManagement.vue'),
      },
      {
        path: 'adminUserManagement',
        component: () => import('pages/admin/adminUserManagement.vue'),
      },
      {
        path: 'adminNotApproved',
        component: () => import('pages/admin/adminNotApproved.vue'),
      },
      {
        path: 'adminReported',
        component: () => import('pages/admin/adminReported.vue'),
      },
    ],
    meta: { requiresAuth: true }, // 관리자 라우트에 인증이 필요함을 명시
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/[...path].vue'),
  },
];

export default routes;
