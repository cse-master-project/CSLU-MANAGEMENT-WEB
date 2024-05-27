import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useManagerStore = defineStore('manager', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    refreshIseAt: '',
    refreshExpAt: '',
  }),
  actions: {
    setAuthData(data) {
      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.refreshIseAt = data.refreshIseAt;
      this.refreshExpAt = data.refreshExpAt;
      //console.log(this.accessToken);
    },
  },
});
