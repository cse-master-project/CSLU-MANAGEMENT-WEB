<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="dialog">
      <q-card-section class="dialog-header">
        <div class="text-h6">퀴즈를 반려하시겠습니까 ?</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="reason"
          type="textarea"
          outlined
          rows="4"
          placeholder="반려 사유"
          maxlength="300"
          class="q-mb-md"
          counter
        />
      </q-card-section>

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          color="grey-8"
          label="취소"
          @click="rejectCancle"
          class="dialog-button cancle-btn"
        />

        <q-btn
          flat
          color="whithe"
          label="반려"
          @click="quizReject"
          class="dialog-button go-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { quizRejecthApi } from 'src/services/quiz/quizManagement.js';
import { useRouter } from 'vue-router';

const props = defineProps({
  isReject: Boolean,
  currentQuiz: Object,
});

const emit = defineEmits(['update:isReject']);

const visible = ref(props.isReject);

//퀴즈 삭제 취소 기능.
const rejectCancle = () => {
  emit('update:isReject', false);
};

const router = useRouter();

const reason = ref('');

//퀴즈 반려 기능.
const quizReject = async () => {
  //console.log(reason.value);
  try {
    await quizRejecthApi(props.currentQuiz.quizId, reason.value);
    alert('퀴즈가 반려되었습니다.');
    router.push('/admin/adminNotApproved'); // 성공 후 페이지 이동
    emit('update:isReject', false);
  } catch (error) {
    console.error('퀴즈 삭제에 실패했습니다.', error);
    alert('문제 반려 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.dialog {
  width: 300px;
  height: 300px;
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
