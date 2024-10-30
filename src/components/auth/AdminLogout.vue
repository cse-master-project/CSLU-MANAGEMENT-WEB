<template>
  <q-dialog v-model="visiable" persistent>
    <q-card class="q-pa-md" style="max-width: 400px">
      <q-card-section class="row items-center q-py-sm">
        <q-avatar
          icon="logout"
          size="40px"
          color="primary"
          text-color="white"
        />
        <div class="q-ml-md text-h6">로그아웃 하시겠습니까?</div>
      </q-card-section>
      <q-card-actions align="center" class="q-mt-md q-px-md">
        <q-btn
          flat
          label="취소"
          color="negative"
          @click="close"
          class="btn-action"
        />
        <q-btn
          flat
          label="로그아웃"
          color="primary"
          @click="logout"
          class="btn-action"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminAuthStore } from 'src/stores/adminAuth';
import { adminAuth } from 'src/services/auth/adminAuth';
import { useRouter } from 'vue-router';

const props = defineProps({
  isLogout: Boolean,
});
const visiable = ref(props.isLogout);

const emit = defineEmits(['update:isLogout']);

// Pinia 스토어 사용
const adminStore = useAdminAuthStore();
const router = useRouter();

// 로그아웃 데이터를 서버에 post 요청 전송
const logout = async () => {
  try {
    const accessToken = adminStore.accessToken; // accessToken을 스토어에서 가져옵니다.
    await adminAuth.logout(accessToken); // accessToken을 인자로 넘깁니다.
    adminStore.logout();
    emit('update:isLogout', false);
    router.push('/admin/adminLogin');
  } catch (error) {
    alert('로그아웃 실패.');
    console.error('로그아웃 실패:', error);
  }
};

// 다이얼로그 닫기
const close = () => {
  emit('update:isLogout', false);
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  display: flex;
  align-items: center;
}

.q-card-actions {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  gap: 16px; /* 버튼 사이에 간격 추가 */
  padding: 8px 0; /* 위아래 패딩 추가 */
}

.btn-action {
  min-width: 120px; /* 버튼 최소 너비 조정 */
  height: 36px; /* 버튼 높이 조정 */
  font-size: 14px; /* 버튼 텍스트 크기 조정 */
  border-radius: 8px; /* 버튼 모서리 둥글기 조정 */
}

.q-btn[flat] {
  border: 1px solid currentColor;
}
</style>
