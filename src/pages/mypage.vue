<template>
  <q-page>
    <p>나의 정보</p>
    <q-btn @click="deactivate">탈퇴하기</q-btn>
  </q-page>
</template>

<script setup>
import { userApi } from 'src/boot/userAxios'; // userAxios 파일에서 userApi를 가져옴

const deactivate = async () => {
  try {
    const response = await userApi.post('/api/user/deactivate');
    console.log('탈퇴 요청 성공:', response.data);
  } catch (error) {
    console.error('탈퇴 요청 실패:', error);
  }
};
</script>

<style lang="scss" scoped></style>
