<template>
  <q-dialog v-model="visible" @hide="handleHide">
    <q-card>
      <q-card-section>
        <div class="text-h6">성공</div>
        <p>문제가 성공적으로 등록되었습니다.</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="확인" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  submitQuizSuccess: Boolean,
  quizId: Number, // 퀴즈 ID를 props로 받음
});

const emit = defineEmits(['update:submitQuizSuccess']);

const visible = ref(props.submitQuizSuccess);

const router = useRouter();

const confirm = () => {
  emit('update:submitQuizSuccess', false);
  router.push(`/userQuizzes/${props.quizId}`); // 성공 후 퀴즈 상세 페이지로 이동
};

// 다이얼로그가 닫힐 때 호출되는 함수
const handleHide = () => {
  router.push(`/userQuizzes/${props.quizId}`); // 다이얼로그가 닫힐 때 페이지 이동
};

// 다이얼로그의 가시성 변화를 감시
watch(visible, newVisible => {
  if (!newVisible) {
    handleHide();
  }
});
</script>

<style scoped></style>
