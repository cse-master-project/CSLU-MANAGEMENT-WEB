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

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component :is="quizTypeViewForm(type)" :quizcontent="quizContent" />
      </q-card-section>

      <q-card-section
        >사용자 ID : {{ currentQuiz.userNickname }}</q-card-section
      >

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
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { useManagerStore } from 'src/stores/auth';

const quizzes = ref([]);

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

const type = computed(() => {
  return currentQuiz.value ? currentQuiz.value.quizType.toString() : null;
});

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

const managerStore = useManagerStore();
const accessToken = managerStore.accessToken;

// 서버에서 데이터 가져오기
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/management/quiz/unapproved', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    quizzes.value = response.data.content; // 서버로부터 받아온 데이터를 quizzes에 저장
    console.log(quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(() => {
  fetchQuizzes();
  console.log('currentQuiz:', currentQuiz.value);
  console.log('quizContent:', quizContent.value);
  console.log('type:', type.value);
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
