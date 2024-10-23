<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="dialog">
      <q-card-section class="dialog-header">
        <div class="text-h6">퀴즈를 승인하겠습니까 ?</div>
      </q-card-section>

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          color="grey-8"
          label="취소"
          @click="approveCancle"
          class="dialog-button cancle-btn"
        />

        <q-btn
          flat
          color="whithe"
          @click="quizApprove"
          class="dialog-button go-btn"
          >승인</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';
import { quizApproveApi } from 'src/services/quiz/quizManagement.js';

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
    console.log('승인 요청 보냄');
    quizApproveApi(props.currentQuiz.quizId);
    alert('퀴즈가 승인 되었습니다.');
    router.push('/admin/adminNotApproved'); // 성공 후 페이지 이동
    emit('update:isApprove', false);
  } catch (error) {
    console.error('퀴즈 승인에 실패했습니다.', error);
    alert('문제 승인 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.dialog {
  width: 300px;
  height: 150px;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  text-align: center;
  padding: 20px 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px; /* 버튼을 하단으로 밀기 위한 패딩 */
  position: absolute;
  bottom: 0;
  width: 100%;
}

.dialog-button {
  min-width: 90px;
  margin: 0 10px;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 8px 16px;
}

.cancle-btn {
  color: #757575;
  background-color: #f5f5f5;
}

.cancle-btn:hover {
  background-color: #e0e0e0;
}

.go-btn {
  color: white;
  background-color: #3682f4;
  border-radius: 6px;
}

.go-btn:hover {
  background-color: #2f60d3;
}
</style>
