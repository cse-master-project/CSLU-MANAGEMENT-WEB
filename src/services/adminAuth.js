import { api } from 'src/boot/axios';
import { useAdminAuthStore } from 'src/stores/adminAuth';

export const adminAuth = {
  // 로그인
  login(managerId, managerPw) {
    return api.post('/api/v2/manager/login', {
      managerId,
      managerPw,
    });
  },

  // 로그아웃
  logout(accessToken) {
    // accessToken을 인자로 받습니다.
    return api.post(
      '/api/v2/manager/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 인자로 받은 accessToken 사용
        },
      },
    );
  },

  // 리프래시 토큰을 사용하여 새로운 액세스 토큰 요청 함수
  async refreshToken() {
    const adminStore = useAdminAuthStore();
    try {
      const response = await api.post('/api/v2/manager/refresh', {
        refreshToken: adminStore.refreshToken,
      });
      // 새로 받은 토큰을 Pinia 스토어에 저장
      adminStore.setAuthData(response.data);
      return response.data.accessToken;
    } catch (error) {
      // 만료되거나 실패 시 로그아웃 처리
      adminStore.logout();
      throw new Error('토큰 갱신 실패');
    }
  },
};
