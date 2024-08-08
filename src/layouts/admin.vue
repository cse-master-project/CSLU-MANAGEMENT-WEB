<template>
  <q-layout view="lHh Lpr lff">
    <q-header bordered class="bg-grey-5">
      <!-- 툴바 & 제목 -->
      <q-toolbar class="toolbar">
        <q-btn flat dense to="/admin" class="toolbar-item">
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
          label="챕터 관리"
          to="/admin/adminSubjectManagement"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />

        <q-btn
          stretch
          flat
          label="기본 문제 추가"
          to="/admin/adminCreate"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />
        <q-btn
          stretch
          flat
          label="기본 문제 관리"
          to="/admin/adminManagement"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />
        <q-btn
          stretch
          flat
          label="사용자 문제 관리"
          to="/admin/adminUserManagement"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />
        <q-btn
          stretch
          flat
          label="미승인 문제 관리"
          to="/admin/adminNotApproved"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />
        <q-btn
          stretch
          flat
          label="신고 문제 관리"
          to="/admin/adminReported"
          class="toolbar-item"
          :class="{ active: isActive('/') }"
        />

        <q-btn
          v-if="isLoggedIn"
          rounded
          label="로그아웃"
          color="orange"
          @click="isLogout = true"
        />
      </q-toolbar>
    </q-header>
    <q-page-container style="max-width: 1080px; margin: 0 auto">
      <router-view />
    </q-page-container>
    <AdminLogout
      v-if="isLogout"
      :is-logout="isLogout"
      @update:isLogout="isLogout = $event"
    />
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue';
import AdminLogout from 'src/components/auth/AdminLogout.vue';
import { useRoute } from 'vue-router';
import { useAdminAuthStore } from 'src/stores/adminAuth';

const route = useRoute();

// 관리자 스토어 가져오기
const authStore = useAdminAuthStore();

// 로그인 상태를 나타내는 반응형 데이터
const isLoggedIn = computed(() => authStore.isAuthenticated);

// 로그아웃 상태
const isLogout = ref(false);

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
  width: 80%; /* 툴바 너비 조정 */
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
