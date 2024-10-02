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
};
