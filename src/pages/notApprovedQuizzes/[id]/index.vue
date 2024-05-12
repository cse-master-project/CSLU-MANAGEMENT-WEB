<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      v-if="currentQuiz"
      style="width: 90%; max-width: 600px"
    >
      <q-card-section class="q-pa-md">
        <div class="text-h5 q-mb-xs">{{ currentQuiz.subject }}</div>
        <div class="text-subtitle2">{{ currentQuiz.detailSubject }}</div>
      </q-card-section>

      <!-- 퀴즈 승인 상태 -->
      <q-card-section class="q-pa-md">
        <QuizPermssionStatus :quiz="currentQuiz" />
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component :is="quizTypeViewForm(type)" :quizcontent="quizContent" />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn flat color="negative" class="q-mr-sm" @click="notPermission"
          >반려</q-btn
        >

        <q-btn flat color="primary" @click="submitQuiz">문제 등록</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import QuizPermssionStatus from 'src/components/quiz/QuizPermissionStatus.vue';
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const quizzes = ref([
  {
    quizId: 1,
    userId: 'wndud',
    subject: '자료구조',
    detailSubject: '스택',
    jsonContent:
      '{"type" : "1","quiz" : "맞는 답을 고르시오.","option" : ["101호", "102호", "103호", "104호"],"answer" : "4", "commentary" : "해설 ~~~"}',
    createAt: '2024-04-27T11:38:12.753Z',
    permissionStatus: 0,
  },
  {
    quizId: 2,
    userId: 'alsdud',
    subject: 'c언어',
    detailSubject: '포인터',
    jsonContent: '{}',
    createAt: '2024-04-27T11:40:00.000Z',
    permissionStatus: 0,
  },
  {
    quizId: 3,
    userId: 'dPwls',
    subject: '파이썬',
    detailSubject: 'list',
    jsonContent: '{}',
    createAt: '2024-04-27T11:42:00.000Z',
    permissionStatus: 0,
  },
]);

const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기
const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
});

// 현재 퀴즈 내용 찾기(JSON). sonContent를 파싱하여 quizContent에 저장
const quizContent = computed(() => {
  if (currentQuiz.value && currentQuiz.value.jsonContent) {
    try {
      return JSON.parse(currentQuiz.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
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

  const submitQuiz = () => {
    console.log(currentQuiz.value); // 현재 퀴즈 내용을 콘솔에 출력
  };

  const notPermission = () => {
    console.log('허가 X');
  };
};
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
