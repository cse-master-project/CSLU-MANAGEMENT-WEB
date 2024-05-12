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

        <!-- 퀴즈 승인 상태 -->
        <q-card-section>
          <QuizPermssionStatus :quiz="currentQuiz" />
        </q-card-section>
        <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
        <component :quizcontent="quizContent" :is="quizTypeViewForm(type)" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import QuizPermssionStatus from 'src/components/quiz/QuizPermissionStatus.vue';
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

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
      '{"type":"3","quiz":"스택","left_option":["1","2","3"],"right_option":["one","two","three"],"answer":["ata","btb","ctc"],"commentary":"해설^_^"}',
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

const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기
const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
});
// console.log(currentQuiz.value);

// 현재 퀴즈 내용 찾기(JSON). sonContent를 파싱하여 quizContent에 저장
const quizContent = computed(() => {
  if (currentQuiz.value) {
    return JSON.parse(currentQuiz.value.jsonContent);
  }
  return null;
});

const type = quizContent.value.type;
const quizTypeViewForm = type => {
  switch (type) {
    case '1':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/user/UserMultipleChoiceView.vue'),
      );
    case '2':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/user/UserShortAnswerView.vue'),
      );
    case '3':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/user/UserMatchingView.vue'),
      );
    case '4':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/user/UserTrueOrFalseView.vue'),
      );
    case '5':
      return defineAsyncComponent(() =>
        import('src/components/quiztype/user/UserFillInTheBlank.vue'),
      );
  }
};
</script>

<style>
.my-card {
  max-width: 400px;
  margin: auto;
}
</style>
