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

      <!-- 신고된 내용 표시 -->
      <q-card-section v-if="reports.length">
        <div class="text-h6 q-mb-xs">신고 내용</div>
        <q-list>
          <q-item v-for="report in reports" :key="report.quizReportId">
            <q-item-section>
              <div class="text-subtitle2">{{ report.content }}</div>
              <div class="text-caption">신고자 ID: {{ report.userId }}</div>
              <div class="text-caption">
                신고일: {{ formatDate(report.reportAt) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn flat color="negative" class="q-mr-sm" @click="notPermission"
          >수정</q-btn
        >
        <q-btn flat color="primary" @click="submitQuiz">폐기</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { date } from 'quasar';

const reports = ref([]);
const currentQuiz = ref(null);

const route = useRoute();
const quizId = route.params.id;

const fetchQuizDetails = async () => {
  try {
    const response = await api.get(`/api/quiz/${quizId}`);
    currentQuiz.value = response.data;
    console.log('퀴즈 데이터:', currentQuiz.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const fetchReports = async () => {
  try {
    const response = await api.get(`/api/quiz/${quizId}/report`);
    reports.value = response.data;
    console.log('신고된 문제 :', reports.value);
  } catch (error) {
    console.error('퀴즈 신고 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(() => {
  fetchQuizDetails();
  fetchReports();
});

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

const quizTypeViewForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MultipleChoiceView.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/ShortAnswerView.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MatchingView.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/TrueOrFalseView.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/FillInTheBlank.vue'),
      );
    default:
      return null;
  }
};

const submitQuiz = () => {
  console.log(currentQuiz.value);
};

const notPermission = () => {
  console.log('허가 X');
};

const formatDate = dateStr => {
  return date.formatDate(dateStr, 'YYYY-MM-DD HH:mm:ss');
};
</script>

<style scoped>
.my-card {
  max-width: 600px;
  margin: auto;
}

.q-mb-xs {
  margin-bottom: 8px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
