<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section class="row items-center justify-end">
        <div>로그아웃 하시겠습니까?</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" @click="close" />
        <q-btn flat label="로그아웃" color="primary" @click="logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import { adminAuth } from 'src/services/adminAuth';
import { useRouter } from 'vue-router';

// Pinia 스토어 사용
const adminStore = useAdminAuthStore();
const router = useRouter();

// 다이얼로그의 열림/닫힘 상태를 제어하는 반응형 변수
const show = ref();

// 로그아웃 데이터를 서버에 post 요청 전송
const logout = async () => {
  try {
    const accessToken = adminStore.accessToken; // accessToken을 스토어에서 가져옵니다.
    await adminAuth.logout(accessToken); // accessToken을 인자로 넘깁니다.
    adminStore.logout();
    //console.log('로그아웃 성공');
    // 로그아웃 성공 후 로그인 페이지로 리디렉션
    router.push('/admin/adminLogin');
  } catch (error) {
    alert('로그아웃 실패.');
    console.error('로그아웃 실패:', error);
  }
};

// 다이얼로그 닫기
const close = () => {
  show.value = false;
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
