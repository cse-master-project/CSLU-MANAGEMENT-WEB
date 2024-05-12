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
          <QuizPermssionStatus :quiz="quiz" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import QuizPermssionStatus from 'src/components/quiz/QuizPermissionStatus.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 임시 데이터
const quizzes = ref([
  {
    quizId: 1,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type" : "1","quiz" : "맞는 답을 고르시오.","option" : ["101호", "102호", "103호", "104호"],"answer" : "4", "commentary" : "해설 ~~~"}',
    createAt: '2024-04-27T11:38:12.753Z',
    permission: 0,
  },
  {
    quizId: 2,
    subject: 'c언어',
    detailSubject: '포인터',
    jsonContent:
      '{"type" : "2", "quiz": "스택은 ?","answer":"스택","commentary":"해설 ~"}',
    createAt: '2024-04-27T11:40:00.000Z',
    permission: 1,
  },
  {
    quizId: 3,
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent:
      '{"type":"3","quiz":"스택","left_option":["1","2","3"],"right_option":["one","two","three"],"answer":["ata","btb","ctc"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 2,
  },
  {
    quizId: 4,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type":"4","quiz":"스택","left_option":["1","2","3"],"right_option":["one","two","three"],"answer":["ata","btb","ctc"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 0,
  },
  {
    quizId: 5,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type":"5","quiz":"스택은 ( ) 이다.","answer":["LIFO"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 1,
  },
]);

const router = useRouter();

function goToQuizDetail(quizId) {
  router.push(`/userQuizzes/${quizId}`);
}
</script>
