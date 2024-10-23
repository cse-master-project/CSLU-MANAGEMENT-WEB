<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="dialog">
      <q-card-section class="dialog-header">
        <div class="text-h6">퀴즈를 폐기하시겠습니까?</div>
      </q-card-section>

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          color="grey-8"
          @click="deleteCancle"
          class="dialog-button cancle-btn"
          >취소</q-btn
        >
        <q-btn
          flat
          color="whithe"
          @click="quizDelete"
          class="dialog-button go-btn"
          >폐기</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { quizDeleteApi } from 'src/services/quiz/quizManagement.js';

const props = defineProps({
  isDelete: Boolean,
  currentQuiz: Object,
  quiz: String,
});

const emit = defineEmits(['update:isDelete']);

const visible = ref(props.isDelete);

//퀴즈 삭제 취소 기능.
const deleteCancle = () => {
  emit('update:isDelete', false);
};

const router = useRouter();

//퀴즈 삭제 기능.
const quizDelete = async () => {
  try {
    quizDeleteApi(props.currentQuiz.quizId);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('퀴즈가 삭제 되었습니다.');
    if (props.quiz === '승인된 제출자 문제')
      router.push('/admin/adminUsermanagement'); // 성공 후 페이지 이동
    if (props.quiz === '관리자 문제') router.push('/admin/adminManagement'); // 성공 후 페이지 이동
    if (props.quiz === '신고된 문제') router.push('/admin/adminReported'); // 성공 후 페이지 이동
    emit('update:isDelete', false);
  } catch (error) {
    console.error('퀴즈 삭제에 실패했습니다.', error);
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
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
  background-color: #f44336;
  border-radius: 6px;
}

.go-btn:hover {
  background-color: #d32f2f;
}
</style>
