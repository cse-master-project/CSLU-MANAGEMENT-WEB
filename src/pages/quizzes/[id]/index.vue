<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h5">{{ quiz.subject }}</div>
          <div class="text-subtitle2 q-mt-xs">{{ quiz.detailSubject }}</div>
        </q-card-section>

        <q-card-section>
          <q-badge
            v-if="quiz.permissionStatus === 0"
            color="orange"
            text-color="white"
          >
            승인 대기 중
          </q-badge>
          <q-badge
            v-else-if="quiz.permissionStatus === 1"
            color="green"
            text-color="white"
          >
            승인됨
          </q-badge>
          <q-badge
            v-else-if="quiz.permissionStatus === 2"
            color="red"
            text-color="white"
          >
            반려됨: {{ quiz.reason }}
          </q-badge>
        </q-card-section>
      </q-card>
    </div>
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
