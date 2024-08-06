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
          label="서비스"
          to="/about"
          class="toolbar-item"
          :class="{ active: isActive('/about') }"
        />

        <div>
          <q-btn
            stretch
            flat
            label="문제 만들기"
            to="/create"
            class="toolbar-item"
            :class="{ active: isActive('/create') }"
            @mouseover="showMenu = true"
            color="primary"
            text-color="white"
            v-if="isUserLoggedIn"
            style="font-size: 18px; padding: 10px"
          />
          <q-menu
            v-model="showMenu"
            anchor="bottom middle"
            self="top middle"
            @mouseover="showMenu = true"
            @mouseleave="showMenu = false"
            class="custom-menu"
          >
            <q-list>
              <q-item
                v-for="quizType in quizTypes"
                :key="quizType.id"
                clickable
                class="menu-item"
                v-ripple
                :class="{ 'selected-btn': selectedQuizType === quizType.value }"
                @click="selectQuizType(quizType.value)"
                style="padding: 10px 20px"
              >
                <q-item-section>{{ quizType.name }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <q-btn
          stretch
          flat
          label="문제 관리"
          to="/management"
          class="toolbar-item"
          v-if="isUserLoggedIn"
          :class="{ active: isActive('/management') }"
        />
        <q-btn
          stretch
          flat
          label="마이 페이지"
          to="/mypage"
          class="toolbar-item"
          v-if="isUserLoggedIn"
          :class="{ active: isActive('/mypage') }"
        />

        <q-btn
          v-if="!isUserLoggedIn"
          rounded
          label="LOG IN"
          @click="isLogin = true"
          @update:isLogin="false"
          class="loginbtn"
        />
        <q-btn
          v-if="isUserLoggedIn"
          rounded
          label="로그아웃"
          color="orange"
          @click="isLogout = true"
        />
      </q-toolbar>
    </q-header>

    <!--뷰-->
    <q-page-container :style="pageContainerStyles">
      <!-- selectedQuizType이 없을 때만 router-view를 렌더링 -->
      <router-view v-if="!selectedQuizType" />

      <!-- selectedQuizType이 있을 때만 문제 유형 컴포넌트를 렌더링 -->
      <component v-else :is="getQuizComponent(selectedQuizType)" />
    </q-page-container>

    <!--Footer-->
    <q-footer>
      <footerbar>CSLU © 2024 . All Rights Reserved. </footerbar></q-footer
    >
    <UserLoginGoogle
      v-if="isLogin"
      :is-login="isLogin"
      @update:isLogin="isLogin = false"
    />
    <UserLogout
      v-if="isLogout"
      :is-logout="isLogout"
      @update:isLogout="isLogout = false"
    />
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserLoginGoogle from 'src/components/auth/UserLoginGoogle.vue';
import { useUserAuthStore } from 'src/stores/userAuth'; // 사용자 인증 상태관리
import UserLogout from 'src/components/auth/UserLogout.vue';

import UserMultipleChoice from 'src/components/quiztype/quizCreate/UserMultipleChoice.vue';
import UserShortAnswer from 'src/components/quiztype/quizCreate/UserShortAnswer.vue';
import UserMatching from 'src/components/quiztype/quizCreate/UserMatching.vue';
import UserTrueOrFalse from 'src/components/quiztype/quizCreate/UserTrueOrFalse.vue';
import UserFillInTheBlank from 'src/components/quiztype/quizCreate/UserFillInTheBlank.vue';

// 페이지 크기를 나타내는 코드.
const route = useRoute();
const router = useRouter();

const pageContainerStyles = computed(() => ({
  maxWidth: route.meta?.width || '1280px',
  margin: '0 auto',
}));

// 로그인 다이얼로그 상태
const isLogin = ref(false);
const showMenu = ref(false); // 드롭다운 메뉴의 표시 상태를 제어하는 변수

// 관리자 스토어 가져오기
const userStore = useUserAuthStore();
// 로그인 상태를 나타내는 반응형 데이터
const isUserLoggedIn = computed(() => userStore.isAuthenticated);

// 로그아웃 기능
const isLogout = ref(false);

// 현재 경로와 비교하여 활성화된 버튼을 감지하는 함수
const isActive = path => route.path === path;

const quizTypes = ref([
  { id: 1, value: 'MultipleChoice', name: '4지선다형' },
  { id: 2, value: 'ShortAnswer', name: '단답형' },
  { id: 3, value: 'Matching', name: '선긋기형' },
  { id: 4, value: 'TrueOrFalse', name: 'o/x형' },
  { id: 5, value: 'FillInTheBlank', name: '빈칸 채우기형' },
]);

const selectedQuizType = ref(null);

const selectQuizType = quizType => {
  selectedQuizType.value = quizType;
  router.push('/create');
};

watch(route, newRoute => {
  if (newRoute.path !== '/create') {
    selectedQuizType.value = null;
  }
});

const getQuizComponent = quizType => {
  switch (quizType) {
    case 'MultipleChoice':
      return UserMultipleChoice;
    case 'ShortAnswer':
      return UserShortAnswer;
    case 'Matching':
      return UserMatching;
    case 'TrueOrFalse':
      return UserTrueOrFalse;
    case 'FillInTheBlank':
      return UserFillInTheBlank;
    default:
      return null;
  }
};
</script>

<style>
.q-header {
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.8rem;
  font-family: 'NotoB', sans-serif;
}
.toolbar-item {
  margin-left: 16px;
  margin-right: 16px;
  font-size: 1.1rem;
  position: relative;
}

.toolbar-item.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: currentColor;
}
.q-menu {
  padding: 0;
  opacity: 0.9;
}

.menu-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.q-menu .q-list {
  min-width: 200px;
  color: black;
  border-radius: 20px;
  font-family: 'Toss Product Sans';
}
.custom-menu {
  min-width: 200px;
  border-radius: 20px;
}
.selected-btn {
  background: linear-gradient(0.25turn, #730286, #be99bb);
  color: #fff;
}
.loginbtn {
  background-color: rgba(33, 44, 60, 0.8);
  font-family: 'Toss Product Sans';
  font-weight: 600;
  color: white;
  font-size: 1rem;
  border-radius: 40px;
  padding: 0 20px;
}
</style>
