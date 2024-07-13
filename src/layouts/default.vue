<template>
  <q-layout view="lHh Lpr lff">
    <q-header bordered class="bg-info">
      <!-- 툴바 & 제목 -->
      <q-toolbar class="toolbar">
        <q-btn flat dense to="/" class="toolbar-item">
          <q-toolbar-title class="title">
            <q-avatar>
              <img src="/gnu2.jpg" />
            </q-avatar>
            CSLU
          </q-toolbar-title>
        </q-btn>

        <q-btn
          stretch
          flat
          label="홈"
          to="/"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />
        <q-btn
          stretch
          flat
          label="서비스 소개"
          to="/about"
          class="toolbar-item"
          :class="{ active: isActive('/about') }"
        />
        <q-btn
          stretch
          flat
          label="문제 만들기"
          to="/create"
          class="toolbar-item"
          :class="{ active: isActive('/create') }"
        />
        <q-btn
          stretch
          flat
          label="문제 관리"
          to="/management"
          class="toolbar-item"
          :class="{ active: isActive('/management') }"
        />

        <q-btn
          rounded
          label="로그인"
          color="light-blue-13"
          @click="isLogin = true"
          @update:isLogin="false"
          class="toolbar-item"
        />
      </q-toolbar>
    </q-header>
    <q-page-container :style="pageContainerStyles">
      <router-view />
    </q-page-container>
    <q-footer>
      <footerbar>CSLU © 2024 . All Rights Reserved. </footerbar></q-footer
    >
    <UserLoginGoogle
      v-if="isLogin"
      :is-login="isLogin"
      @update:isLogin="isLogin = false"
    />
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

// 현재 경로와 비교하여 활성화된 버튼을 감지하는 함수
const isActive = path => route.path === path;
</script>

<style lang="scss" scoped>
.q-header {
  height: 8%; /* 헤더 높이 조정 */
  display: flex;
  align-items: center; /* 헤더 내부 요소 중앙 정렬 */
  justify-content: center; /* 헤더 내부 요소 중앙 정렬 */
}
.q-footer {
  height: 100px;
  border: 1px solid #dddddd;
  background-color: white;
  color: black;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toolbar {
  width: 70%; /* 툴바 너비 조정 */
  display: flex;
  justify-content: space-between;
  align-items: center; /* 툴바 내부 요소 중앙 정렬 */
}

.toolbar-item {
  margin-left: 16px; /* 필요에 따라 조정 */
  margin-right: 16px; /* 필요에 따라 조정 */
  font-size: 1.1rem; /* 글씨 크기 조정 */
  position: relative;
}

.toolbar-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px; /* 밑줄 위치 조정 */
  left: 0;
  right: 0;
  height: 2px; /* 밑줄 두께 */
  background-color: currentColor; /* 글씨 색상과 동일한 색상 */
}

.title {
  font-size: 1.8rem; /* 제목 글씨 크기 조정 */
  font-weight: bold;
}
</style>
