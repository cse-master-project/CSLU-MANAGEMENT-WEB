<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="reject-success-dialog">
      <q-card-section>
        <div class="text-h6">퀴즈 반려하시겠습니까 ?</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="reason"
          type="textarea"
          outlined
          rows="4"
          placeholder="문제를 입력해주세요"
          maxlength="300"
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="취소"
          @click="rejectCancle"
          class="rejectCancle-button"
        />

        <q-btn
          flat
          color="red"
          label="반려"
          @click="quizReject"
          class="rejectCancle-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { api } from 'src/boot/axios';
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
    await api.put(
      `/api/management/quiz/${props.currentQuiz.quizId}/reject`,
      reason.value,
    );
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
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
.reject-success-dialog {
  max-width: 300px;
  width: 100%;
}

.rejectCancle-button {
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
