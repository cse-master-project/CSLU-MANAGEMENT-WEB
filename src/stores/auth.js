import { defineStore } from 'pinia';

export const useManagerStore = defineStore('manager', {
  // 상태 정의
  state: () => ({
    accessToken: '',
    refreshToken: '',
    refreshIseAt: '',
    refreshExpAt: '',
  }),
  // 상태 변경
  actions: {
    // 서버에서 받은 로그인 데이터를 상태에 저장.
    setAuthData(data) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.refreshIseAt = data.refreshIseAt;
      this.refreshExpAt = data.refreshExpAt;
      //console.log(this.accessToken);
    },
    //로그아웃 데이터 상태 저장.
    logout() {
      this.accessToken = '';
      this.refreshToken = '';
      this.refreshIseAt = '';
      this.refreshExpAt = '';
    },
  },
});
