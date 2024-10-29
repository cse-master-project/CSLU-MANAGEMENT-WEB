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
    const userRole = adminAuthStore.role;

    // 인증이 필요한 라우트인지 확인
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        // 인증되지 않은 경우 로그인 페이지로 리디렉션
        if (to.path === '/admin/adminLogin') {
          next(); // 누구나 접근 가능
        } else {
          next('/admin/adminLogin'); // 로그인되지 않은 경우 리디렉션
        }
      } else {
        // 로그인된 상태에서 관리자 페이지 접근 시 역할 확인
        if (to.path.includes('admin/admin') && userRole !== 'admin') {
          if (to.path === '/') {
            next(false); // 이미 홈 페이지에 있으면 리디렉션 중단 (무한 리디렉션 방지)
          } else {
            next('/'); // 홈 페이지로 리디렉션
          }
        } else {
          next(); // 인증되고 권한 있으면 접근 허용
        }
      }
    } else {
      next(); // 인증이 필요 없는 페이지는 그대로 진행
    }
  });

  return Router;
});
