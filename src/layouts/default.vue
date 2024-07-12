<template>
  <q-layout view="lHh Lpr lff">
    <q-header bordered class="bg-info">
      <!-- 툴바 & 제목 -->
      <q-toolbar class="flex justify-between">
        <q-btn flat dense to="/">
          <q-toolbar-title>
            <q-avatar>
              <img src="/gnu.jpeg" />
            </q-avatar>
            CSE
          </q-toolbar-title>
        </q-btn>

        <q-btn stretch flat label="홈" to="/" />
        <q-btn stretch flat label="서비스 소개" to="/about" />
        <q-btn stretch flat label="문제 만들기" to="/create" />
        <q-btn stretch flat label="문제 관리" to="/management" />
        <q-btn stretch flat label="마이페이지" to="/mypage" />
        <q-btn
          rounded
          label="로그인"
          color="light-blue-13"
          @click="isLogin = true"
        />
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyles">
      <router-view />
    </q-page-container>
    <UserLoginGoogle v-if="isLogin" :is-login="isLogin" />
  </q-layout>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import UserLoginGoogle from 'src/components/auth/UserLoginGoogle.vue';

// 페이지 크기를 나타내는 코드.
const route = useRoute();
// debugger;
const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1080px',
  margin: '0 auto',
}));

//로그인 다이얼로그상태
const isLogin = ref(false);
</script>

<style lang="scss" scoped></style>
