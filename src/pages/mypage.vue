<template>
  <q-page>
    <q-card class="text-center" flat>
      <div class="container">
        <q-title class="title">나의 정보</q-title><br />
        <q-btn class="quiz-type-btn" @click="deactivate"> 탈퇴하기 </q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useUserAuthStore } from 'src/stores/userAuth'; //사용자 인증 상태관리

import { userApi } from 'src/boot/userAxios'; // userAxios 파일에서 userApi를 가져옴

const userStore = useUserAuthStore();
const deactivate = async () => {
  console.log(userStore.accessToken);
  try {
    const response = await userApi.post('/api/user/deactivate');
    console.log('탈퇴 요청 성공:', response.data);
  } catch (error) {
    console.error('탈퇴 요청 실패:', error);
  }
};
</script>

<style lang="scss" scoped></style>
