<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="delete-success-dialog">
      <q-card-section>
        <div class="text-h6">퀴즈 폐기하시겠습니까 ?</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="취소"
          @click="deleteCancle"
          class="deleteCancle-button"
        />
        <q-btn
          flat
          color="red"
          label="폐기"
          @click="quizDelete"
          class="deleteCancle-button"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

const props = defineProps({
  isDelete: Boolean,
  currentQuiz: Object,
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
    await api.delete(`/api/management/quiz/${props.currentQuiz.quizId}`);
    // 삭제 성공 시 로직(alert말고 딴거 해야함.)
    alert('퀴즈가 삭제 되었습니다.');
    router.push('/admin/adminManagement'); // 성공 후 페이지 이동
    emit('update:isDelete', false);
  } catch (error) {
    console.error('퀴즈 삭제에 실패했습니다.', error);
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.delete-success-dialog {
  max-width: 300px;
  width: 100%;
}

.deleteCancle-button {
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
