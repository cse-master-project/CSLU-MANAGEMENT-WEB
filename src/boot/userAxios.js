//사용자용

import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useUserAuthStore } from 'src/stores/userAuth'; // 사용자 인증 스토어 불러오기

const userApi = axios.create({
  // 기본 URL
  baseURL: process.env.VUE_APP_API_URL,
  // 헤더 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// boot로 quasar 앱의 글로벌 속성으로 인스턴스 추가.
export default boot(({ app }) => {
  app.config.globalProperties.$userApi = userApi;
});

//요청 인터셉터 설정.
//서버에 요청을 보낼 때마다 토큰을 자동으로 포함할 수 있도록.
userApi.interceptors.request.use(
  config => {
    const userStore = useUserAuthStore();
    if (userStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

//토큰 갱신 refreshToken
// 응답 인터셉터 설정
userApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const userStore = useUserAuthStore();

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청
        const response = await axios.post('/api/v2/user/refresh', {
          refreshToken: userStore.refreshToken,
        });

        // 새로운 토큰을 Pinia 스토어에 저장
        userStore.setAuthData(response.data);

        // 원래 요청에 새로운 토큰을 포함시켜 재시도
        originalRequest.headers.Authorization = `Bearer ${userStore.accessToken}`;

        return userApi(originalRequest);
      } catch (e) {
        // 갱신 실패 시 로그아웃 처리
        userStore.logout();
        // 추가적으로 로그인 페이지로 리다이렉트 등의 처리 필요
        console.error('토큰 갱신 실패:', e);
      }
    }

    return Promise.reject(error);
  },
);

export { userApi };
