<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">퀴즈를 승인하겠십니까 ?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="primary" label="취소" @click="approveCancle" />
        <q-btn flat color="red" label="승인" @click="quizApprove" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

const props = defineProps({
  isApprove: Boolean,
  currentQuiz: Object,
});

const emit = defineEmits(['update:isApprove']);

const visible = ref(props.isApprove);

//퀴즈 승인 취소 기능.
const approveCancle = () => {
  emit('update:isApprove', false);
};

const router = useRouter();

//퀴즈 승인 기능.
const quizApprove = async () => {
  try {
    await api.put(`/api/management/quiz/${props.currentQuiz.quizId}/approve`);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('퀴즈가 승인 되었습니다.');
    router.push('/admin/admin/adminNotApproved'); // 성공 후 페이지 이동
    emit('update:isApprove', false);
  } catch (error) {
    console.error('퀴즈 승인에 실패했습니다.', error);
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>

<style scoped></style>
