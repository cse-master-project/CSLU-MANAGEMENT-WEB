<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card">
      <q-img src="/public/BS-18_보더라인.jpg" class="card-image" contain />
      <q-card-section class="text-h6 text-center q-py-lg">
        환영합니다 관리자님 ^_^
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="id"
          type="text"
          outlined
          placeholder="아이디"
          class="q-mb-md input-field"
          @keyup.enter="submitLogin"
        />
        <q-input
          v-model="pw"
          type="password"
          outlined
          placeholder="비밀번호"
          class="q-mb-md input-field"
          @keyup.enter="submitLogin"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="로그인"
          @click="submitLogin"
          class="q-pa-md btn-login"
          color="primary"
          rounded
          size="lg"
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
import { Notify } from 'quasar';

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
    alert('로그인에 실패했습니다. \n아이디 또는 비밀번호를 확인해주세요.');
  }
};
</script>

<style scoped>
.my-card {
  width: 100%; /* 카드의 너비를 100%로 설정하여 페이지에 맞게 확장 */
  max-width: 500px; /* 최대 너비를 설정하여 너무 넓어지지 않도록 함 */
  min-height: 400px; /* 최소 높이 설정 */
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px; /* 카드 내부 여백 조정 */
}

.card-image {
  height: 200px; /* 이미지 높이 조정 (사용 시) */
}

.input-field .q-input__control {
  border-radius: 8px;
}

.input-field .q-input__control input {
  font-size: 16px;
}

.btn-login {
  width: 100%;
  font-size: 16px;
}
</style>
