<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card">
      <q-card-section class="text-h6 text-center q-py-lg">
        환영합니다 관리자님 ^_^
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="id"
          type="text"
          outlined
          placeholder="아이디"
          class="q-mb-md"
        />
        <q-input
          v-model="pw"
          type="password"
          outlined
          placeholder="비밀번호"
          class="textbox q-mb-md"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="로그인"
          @click="submitLogin"
          class="q-pa-md"
          color="primary"
          rounded
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import { adminAuth } from 'src/services/adminAuth';

// 아이디와 패스워드 상태 관리
const id = ref('');
const pw = ref('');

// 라우터 사용
const router = useRouter();

// Pinia 스토어 사용
const adminStore = useAdminAuthStore();

// 로그인 데이터를 서버에 post 요청 전송
const submitLogin = async () => {
  try {
    const response = await adminAuth.login(id.value, pw.value);
    adminStore.setAuthData(response.data);
    console.log('로그인 성공:', response.data);
    // 로그인 성공 후
    router.push('/admin');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
</script>

<style>
.my-card {
  width: 90%;
  max-width: 400px;
}

.textbox input {
  font-size: 16px !important;
}

.q-btn {
  width: 80%;
}
</style>
