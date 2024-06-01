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
import { ref, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useManagerStore } from 'src/stores/auth';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'logout']);

const show = ref(props.modelValue);

watch(
  () => props.modelValue,
  newVal => {
    show.value = newVal;
  },
);

watch(show, newVal => {
  emit('update:modelValue', newVal);
});

const close = () => {
  emit('update:modelValue', false);
};

const logout = async () => {
  const managerStore = useManagerStore();
  const accessToken = managerStore.accessToken; // 토큰을 상태에서 가져옴
  try {
    await api.post(
      '/api/manager/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    console.log('로그아웃 성공');
    managerStore.logout(); // 로그아웃 상태로 변경
    emit('logout'); // 부모 컴포넌트에 로그아웃 이벤트 전달
    close(); // 다이얼로그 닫기
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
