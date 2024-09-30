//관리자용
import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import { adminAuth } from 'src/services/adminAuth';

const api = axios.create({
  // 기본 URL
  baseURL: process.env.VUE_APP_API_URL,
  // 헤더 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// boot로 quasar 앱의 글로벌 속성으로 인스턴스 추가.
export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

//요청 인터셉터 설정.
//서버에 요청을 보낼 때마다 토큰을 자동으로 포함할 수 있도록.
api.interceptors.request.use(
  config => {
    const adminStore = useAdminAuthStore();
    if (adminStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${adminStore.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

//토큰 갱신 refreshToken
// 응답 인터셉터 설정
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const adminStore = useAdminAuthStore();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 서비스 레이어에서 토큰 갱신 처리
        const newAccessToken = await adminAuth.refreshToken();

        // 새로운 토큰으로 원래 요청을 다시 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (e) {
        // 갱신 실패 시 로그아웃 및 로그인 페이지 리다이렉트
        console.error('토큰 갱신 실패:', e);
        adminStore.logout();
        this.$router.push('/login');
      }
    }

    return Promise.reject(error);
  },
);

export { api };
