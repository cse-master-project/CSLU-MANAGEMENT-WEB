<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card class="my-card" v-if="currentQuiz">
        <q-card-section>
          <div class="text-h5">{{ currentQuiz.subject }}</div>
          <div class="text-subtitle2 q-mt-xs">
            {{ currentQuiz.detailSubject }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-badge
            v-if="currentQuiz.permissionStatus === 0"
            color="orange"
            text-color="white"
          >
            승인 대기 중
          </q-badge>
          <q-badge
            v-else-if="currentQuiz.permissionStatus === 1"
            color="green"
            text-color="white"
          >
            승인됨
          </q-badge>
          <q-badge
            v-else-if="currentQuiz.permissionStatus === 2"
            color="red"
            text-color="white"
          >
            반려됨: {{ currentQuiz.reason }}
          </q-badge>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

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
]); // 퀴즈 데이터 목록

const route = useRoute(); //현재 라우트의 파라미터를 가져오기.
const quizId = route.params.id; //URL파라미터에서 id추출.

const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
}); //quizID에 해당하는 퀴즈 정보를 quizzes 배열에서 찾아 반환.
</script>

<style>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>
