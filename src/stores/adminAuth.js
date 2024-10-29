import { defineStore } from 'pinia';
import { Cookies } from 'quasar';

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    accessToken: Cookies.get('accessToken') || '',
    refreshToken: Cookies.get('refreshToken') || '',
    refreshIseAt: '',
    refreshExpAt: '',
    role: Cookies.get('role') || '',
  }),
  getters: {
    isAuthenticated: state => !!state.accessToken,
    isAdmin: state => state.role === 'admin',
  },
  actions: {
    // 로그인 시 토큰을 상태와 쿠키에 저장
    setAuthData(data) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.refreshIseAt = data.refreshIseAt;
      this.refreshExpAt = data.refreshExpAt;
      this.role = 'admin'; //관리자로 설정.

      // 30분 유효 시간으로 만료 시간을 설정
      const thirtyMinutesLater = new Date();
      thirtyMinutesLater.setMinutes(thirtyMinutesLater.getMinutes() + 30); // 현재 시간 기준 30분 후

      // 만료 시간으로 쿠키 저장 (30분)
      Cookies.set('accessToken', data.accessToken, {
        expires: thirtyMinutesLater, // 30분 후 만료
        path: '/',
      });
      Cookies.set('refreshToken', data.refreshToken, {
        expires: thirtyMinutesLater, // 30분 후 만료
        path: '/',
      });
      Cookies.set('role', this.role, {
        expires: 7,
        path: '/', // 만료 시간이 없으므로 세션 동안 유지
      });
      // 콘솔로 만료 시간을 출력
      console.log(
        '새로운 리프레시 토큰 만료 시간 (30분 후):',
        thirtyMinutesLater,
      );
    },
    // 새로고침 시 쿠키에서 토큰을 불러와 상태 복원
    loadAuthDataFromCookies() {
      this.accessToken = Cookies.get('accessToken') || '';
      this.refreshToken = Cookies.get('refreshToken') || '';
      this.role = Cookies.get('role') || ''; // 역할 정보도 복원
    },
    // 로그아웃 시 상태 및 쿠키 초기화
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.refreshIseAt = '';
      this.refreshExpAt = '';
      this.role = '';

      // 쿠키 삭제 (path를 '/'로 명시하여 삭제)
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
      Cookies.remove('role', { path: '/' }); // role 쿠키도 삭제
    },
  },
});
