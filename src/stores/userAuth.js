import { defineStore } from 'pinia';
import { Cookies } from 'quasar';

// Pinia 스토어 정의
export const useUserAuthStore = defineStore('userAuth', {
  // 상태 정의
  state: () => ({
    accessToken: Cookies.get('accessToken') || '',
    refreshToken: Cookies.get('refreshToken') || '',
    refreshIseAt: '',
    refreshExpAt: '',
  }),
  // accessToken이 빈문자열이 아닌 경우 true 반환.
  getters: {
    isAuthenticated: state => !!state.accessToken,
  },
  // 상태 변경
  actions: {
    // 로그인 시 토큰을 상태와 쿠키에 저장
    setAuthData(data) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.refreshIseAt = data.refreshIseAt;
      this.refreshExpAt = data.refreshExpAt;

      // 30분 유효 시간으로 쿠키 저장
      const thirtyMinutesLater = new Date();
      thirtyMinutesLater.setMinutes(thirtyMinutesLater.getMinutes() + 30);

      Cookies.set('accessToken', data.accessToken, {
        expires: thirtyMinutesLater,
        path: '/',
      });
      Cookies.set('refreshToken', data.refreshToken, {
        expires: thirtyMinutesLater,
        path: '/',
      });
    },
    //새로고침
    loadAuthDataFromCookies() {
      this.accessToken = Cookies.get('accessToken') || '';
      this.refreshToken = Cookies.get('refreshToken') || '';
    },

    // 로그아웃 데이터 상태 저장.
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.refreshIseAt = '';
      this.refreshExpAt = '';

      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
    },
  },
});
