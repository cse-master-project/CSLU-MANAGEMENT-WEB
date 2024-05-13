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

            <q-card-section> 신고사유 : {{ quiz.userId }} </q-card-section>

            <q-card-section>
              <q-chip
                v-if="quiz.permissionStatus === 0"
                color="blue"
                text-color="white"
              >
                사용자 문제
              </q-chip>
              <q-chip
                v-if="quiz.permissionStatus === 1"
                color="yellow"
                text-color="white"
              >
                기본 문제
              </q-chip>
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
    userId: '부적절',
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type" : "1","quiz" : "맞는 답을 고르시오.","option" : ["101호", "102호", "103호", "104호"],"answer" : "4", "commentary" : "해설 ~~~"}',
    createAt: '2024-04-27T11:38:12.753Z',
    permissionStatus: 0,
  },
  {
    quizId: 2,
    userId: '부적절함ㅜㅜ',
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent: '{}',
    createAt: '2024-04-27T11:40:00.000Z',
    permissionStatus: 1,
  },
  {
    quizId: 3,
    userId: '부적절합니다.',
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent: '{}',
    createAt: '2024-04-27T11:42:00.000Z',
    permissionStatus: 0,
  },
]);

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/ReportedQuizzes/${quizId}`);
}
</script>

<route lang="yaml">
meta:
  layout: admin
</route>
