<template>
  <q-dialog v-model="modelValue">
    <q-card>
      <q-card-section>
        <q-input
          v-model="id"
          type="text"
          outlined
          placeholder="아이디"
          class="q-mb-md"
          style="margin: 3% 0; width: 100%"
        />
        <q-input
          v-model="pw"
          type="password"
          outlined
          placeholder="비밀번호"
          class="textbox"
          style="margin: 3% 0; width: 100%"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="로그인"
          @click="submitLogin"
          style="width: 100%; margin: 3% 0"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { useManagerStore } from 'src/stores/auth';

// 이벤트를 정의합니다.
const emit = defineEmits(['login-success']);

// 아이디와 패스워드 상태 관리
const id = ref('');
const pw = ref('');
const modelValue = ref(false);

// 로그인 데이터를 서버에 post 요청 전송
const submitLogin = () => {
  const loginData = {
    managerId: id.value,
    managerPw: pw.value,
  };
  console.log('서버에 제출될 데이터:', loginData);

  // useManagerStore 사용해 Pinia 스토어 접근, 서버 응답 데이터를 스토어에 저장
  const managerStore = useManagerStore();
  api
    .post('/api/manager/login', loginData)
    .then(response => {
      managerStore.setAuthData(response.data);
      // 로그인 성공 이벤트 트리거
      emit('login-success', true);
      console.log('로그인 이벤트 발생');
    })
    .catch(error => {
      console.error('서버 응답 오류:', error);
    });
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';
.textbox {
  font-family: 'Arial', sans-serif;
}
</style>
