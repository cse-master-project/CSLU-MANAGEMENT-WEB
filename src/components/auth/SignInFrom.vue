<template>
  <div>
    <div class="text-h5 text-center text-weight-bold q-mb-xl">로그인</div>
    <q-form class="q-gutter-y-md">
      <q-btn
        label="구글 계정으로 로그인하기"
        class="full-width"
        outline
        unelevated
        color="primary"
        @click="handleSignInGoogle"
      />
    </q-form>
  </div>
</template>

<script setup>
//원래는 pinia에 있는 auth 호출이였는데....
import { signInWithGoogle } from 'src/services/auth';
//상태를 변경할 수 있는 이벤트
// defineEmits(['changeView']);

// 구글 로그인
const handleSignInGoogle = () => {
  signInWithGoogle();
};
</script>

<style lang="scss" scoped></style>
