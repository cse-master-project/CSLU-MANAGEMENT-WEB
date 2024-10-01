<template>
  <q-dialog v-model="visible">
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
import { ref } from 'vue';
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
</script>

<style scoped></style>
