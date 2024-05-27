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
//import api from 'boot/axios';
const id = ref('');
const pw = ref('');
const submitLogin = () => {
  const loginData = {
    managerId: id.value,
    managerPw: pw.value,
  };
  console.log('서버에 제출될 데이터:', loginData);
  const managerStore = useManagerStore();
  api
    .post('/api/manager/login', loginData)
    .then(response => {
      //console.log('서버 응답:', response.data);
      managerStore.setAuthData(response.data);
      // 성공적으로 서버에 데이터를 전송한 후의 동작
    })
    .catch(error => {
      //console.error('서버 응답 오류:', error);
      // 서버에 데이터 전송 중 오류가 발생한 경우의 동작
    });
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';
.textbox {
  font-family: 'Arial', sans-serif;
}
</style>
<route lang="yaml">
meta:
  layout: admin
</route>
