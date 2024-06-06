import { defineStore } from 'pinia';

export const useAdminAuthStore = defineStore('adminAuth', {
  // 상태 정의
  state: () => ({
    accessToken: '',
    refreshToken: '',
    refreshIseAt: '',
    refreshExpAt: '',
  }),
  // accessToken이 빈문자열이 아닌경우 true 반환.
  getters: {
    isAuthenticated: state => !!state.accessToken,
  },
  // 상태 변경
  actions: {
    // 서버에서 받은 로그인 데이터를 상태에 저장.
    setAuthData(data) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.refreshIseAt = data.refreshIseAt;
      this.refreshExpAt = data.refreshExpAt;
    },
    // 로그아웃 데이터 상태 저장.
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.refreshIseAt = '';
      this.refreshExpAt = '';
    },
  },
});
