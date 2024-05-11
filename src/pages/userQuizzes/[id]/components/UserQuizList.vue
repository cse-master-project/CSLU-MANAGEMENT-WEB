<template>
  <q-page padding>
    <q-list bordered class="rounded-borders">
      <q-item
        v-for="quiz in quizzes"
        :key="quiz.quizId"
        clickable
        v-ripple
        @click="goToQuizDetail(quiz.quizId)"
      >
        <q-item-section>
          <q-item-label>{{ quiz.subject }}</q-item-label>
          <q-item-label caption>{{ quiz.detailSubject }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-chip
            v-if="quiz.permissionStatus === 0"
            color="orange"
            text-color="white"
            size="md"
          >
            승인 대기중
          </q-chip>
          <q-chip
            v-else-if="quiz.permissionStatus === 1"
            color="green"
            text-color="white"
            size="md"
          >
            승인
          </q-chip>
          <q-chip
            v-else-if="quiz.permissionStatus === 2"
            color="red"
            text-color="white"
            size="md"
          >
            반려
          </q-chip>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 임시 데이터
const quizzes = ref([
  {
    quizId: 1,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent: '{}',
    createAt: '2024-04-27T11:38:12.753Z',
    permissionStatus: 0,
  },
  {
    quizId: 2,
    subject: 'c언어',
    detailSubject: '포인터',
    jsonContent: '{}',
    createAt: '2024-04-27T11:40:00.000Z',
    permissionStatus: 1,
  },
  {
    quizId: 3,
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent: '{}',
    createAt: '2024-04-27T11:42:00.000Z',
    permissionStatus: 2,
  },
]);

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/userQuizzes/${quizId}`);
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
