<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-list bordered class="rounded-borders">
        <div v-for="quiz in quizzes" :key="quiz.quizId" class="q-mb-md">
          <q-card clickable v-ripple @click="goToQuizDetail(quiz.quizId)">
            <q-card-section>
              <div class="text-h6">{{ quiz.subject }}</div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle2">{{ quiz.detailSubject }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 임시 데이터
const quizzes = ref([
  {
    quizId: 1,
    userId: '한주영',
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent: '{}',
    createAt: '2024-04-27T11:38:12.753Z',
    permissionStatus: 0,
  },
  {
    quizId: 2,
    userId: '박예진',
    subject: 'c언어',
    detailSubject: '포인터',
    jsonContent: '{}',
    createAt: '2024-04-27T11:40:00.000Z',
    permissionStatus: 0,
  },
  {
    quizId: 3,
    userId: '박민영',
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent: '{}',
    createAt: '2024-04-27T11:42:00.000Z',
    permissionStatus: 0,
  },
]);

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/quizzes/${quizId}`);
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
