import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  user.value = userData;
  const signin = () => {
    //service signInGoogle
    //setUser(user);
  };
  return {
    user,
    setUser,
  };
});
