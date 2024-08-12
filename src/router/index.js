import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import routes from './routes'; // 라우트 정의를 포함

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
    extendRoutes: routes => {
      return setupLayouts(
        routes.map(route => {
          if (
            route.path.includes('admin') |
            route.path.includes('quizzes') |
            route.path.includes('allUserQuizzes') |
            route.path.includes('notApprovedQuizzes') |
            route.path.includes('reportedQuizzes')
          ) {
            route = {
              ...route,
              meta: {
                ...route.meta,
                layout: 'admin',
                requiresAuth: true, // 인증이 필요한 라우트로 설정
              },
            };
          }
          return route;
        }),
      );
    },
  });

  Router.beforeEach((to, from, next) => {
    const adminAuthStore = useAdminAuthStore();
    const isAuthenticated = adminAuthStore.isAuthenticated;

    if (
      to.matched.some(record => record.meta.requiresAuth) &&
      !isAuthenticated
    ) {
      if (to.path !== '/admin/adminLogin') {
        next('/admin/adminLogin'); // 인증되지 않은 경우 로그인 페이지로 리디렉션
      } else {
        next(); // 이미 로그인 페이지로 이동 중이면 리디렉션하지 않음
      }
    } else {
      next(); // 인증된 경우 라우트 진행
    }
  });

  return Router;
});
