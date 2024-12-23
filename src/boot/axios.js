//관리자용
import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useAdminAuthStore } from 'src/stores/adminAuth';

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
        const response = await api.post('/api/v2/user/refresh', {
          refreshToken: adminStore.refreshToken,
        });

        // 새로운 토큰을 Pinia 스토어에 저장
        adminStore.setAuthData(response.data);
        // 원래 요청에 새로운 토큰을 포함시켜 재시도
        originalRequest.headers.Authorization = `Bearer ${adminStore.accessToken}`;

        return api(originalRequest);
      } catch (e) {
        // 갱신 실패 시 로그아웃 처리
        adminStore.logout();
        // 추가적으로 로그인 페이지로 리다이렉트 등의 처리 필요
        router.push('/admin/adminLogin');
        Notify.create({
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
          color: 'warning',
        });
      }
    }

    return Promise.reject(error);
  },
);

export { api };
