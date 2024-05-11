<template>
  <q-page padding>
    <p>신고 퀴즈 상세</p>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const quiz = ref({
  quizId: 1,
  subject: '문제1',
  detailSubject: '문제1 상세 설명',
  jsonContent: '{ "question": "Q?", "answer": "A" }',
  createAt: '2024-04-27T11:38:12.753Z',
  permissionStatus: 0, // 0: 승인 대기, 1: 승인됨, 2: 반려됨
  reason: '부적절한 내용',
});
</script>

<style>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
