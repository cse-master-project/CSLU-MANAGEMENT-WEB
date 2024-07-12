<template>
  <q-page padding>
    <!-- Filters -->
    <div class="row q-col-gutter-md q-py-md">
      <div class="col-12 col-md-3 q-my-md">
        <q-select
          v-model="selectedSubject"
          :options="subjects"
          label="과목"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-3 q-my-md">
        <q-select
          v-model="selectedChapter"
          :options="chapters"
          label="챕터"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-3 q-my-md">
        <q-select
          v-model="selectedApproval"
          :options="approvalStatuses"
          label="승인 여부"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-3 q-my-md">
        <q-select
          v-model="selectedQuestionType"
          :options="questionTypes"
          label="문제 유형"
          outlined
          dense
        />
      </div>
    </div>
    <div class="row q-col-gutter-md q-pt-md">
      <div class="col-12 col-md-6 q-my-md">
        <q-btn label="초기화" class="full-width"></q-btn>
      </div>
      <div class="col-12 col-md-6 q-my-md">
        <q-btn label="검색" class="full-width"></q-btn>
      </div>
    </div>

    <!-- Quiz Cards -->
    <div class="row q-col-gutter-md q-pt-md">
      <div
        v-for="quiz in quizzes"
        :key="quiz.quizId"
        class="col-12 col-md-6 q-my-md"
      >
        <q-card
          class="my-card"
          clickable
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer"
        >
          <q-card-section>
            <div class="text-h6">{{ quiz.subject }}</div>
            <div class="text-subtitle2">{{ quiz.detailSubject }}</div>
          </q-card-section>

          <q-card-section>
            <QuizPermssionStatus :quiz="quiz" />
          </q-card-section>
        </q-card>
      </div>
    </div>
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
  {
    quizId: 6,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type":"5","quiz":"스택은 ( ) 이다.","answer":["LIFO"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 1,
  },
  {
    quizId: 7,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type":"5","quiz":"스택은 ( ) 이다.","answer":["LIFO"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 1,
  },
  {
    quizId: 8,
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type":"5","quiz":"스택은 ( ) 이다.","answer":["LIFO"],"commentary":"해설^_^"}',
    createAt: '2024-04-27T11:42:00.000Z',
    permission: 1,
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
