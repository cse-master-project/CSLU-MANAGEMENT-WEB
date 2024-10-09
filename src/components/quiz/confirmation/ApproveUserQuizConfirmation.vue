<template>
  <q-dialog v-model="visible" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">퀴즈를 승인하겠습니까 ?</div>
      </q-card-section>

      <q-card-actions align="center" class="q-px-sm q-py-sm buttons-container">
        <q-btn
          flat
          color="red"
          label="취소"
          @click="approveCancle"
          style="border: 1px solid red"
        />

        <q-btn
          flat
          color="primary"
          label="승인"
          @click="quizApprove"
          :style="`border: 1px solid var(--q-primary)`"
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
    const response = await api.put(
      `/api/v2/management/quiz/${props.currentQuiz.quizId}/approve`,
    );
    console.log('서버 응답:', response.data);
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
.buttons-container {
  justify-content: center;
}

.buttons-container .q-btn {
  margin: 01% 0; /* 버튼 사이 간격 조정 */
}
</style>
