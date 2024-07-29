<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-gutter-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-3 q-my-md">
          <q-select
            v-model="subject"
            :options="subjectOptions"
            label="과목"
            outlined
            dense
            @update:model-value="updateDetailSubjectOptions"
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
          <q-select
            v-model="detailSubject"
            :options="filteredDetailSubjectOptions"
            label="챕터"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
          <q-select
            v-model="permssionStatus"
            :options="approvalStatuses"
            label="승인 여부"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
          <q-select
            v-model="quizType"
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
    </q-card>

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
            <div class="text-h6">과목 : {{ quiz.subject }}</div>
            <div class="text-subtitle2">챕터 : {{ quiz.detailSubject }}</div>
            <div class="text-caption text-createAt">
              생성일 : {{ formatDate(quiz.createAt) }}
            </div>
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
import { userApi } from 'src/boot/userAxios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const quizzes = ref([]);
const subject = ref('');
const detailSubject = ref('');
const quizType = ref('');

onMounted(async () => {
  await fetchQuizzes();
});

const fetchQuizzes = async () => {
  try {
    const response = await userApi.get('/api/quiz/my');
    quizzes.value = response.data;
    // quizSubject.value = quizzes.value.map(quiz => quiz.subject);
    // quizDetailSubject.value = quizzes.value.map(quiz => quiz.detailSubject);
    console.log('퀴즈목록 : ', quizzes.value);
    // console.log('과목목록 : ', quizSubject.value);
    // console.log('챕터목록 : ', quizDetailSubject.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const router = useRouter();

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

function goToQuizDetail(quizId) {
  router.push(`/userQuizzes/${quizId}`);
}

//Todo 정렬
</script>
