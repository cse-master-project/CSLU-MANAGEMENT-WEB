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
          <q-btn
            label="초기화"
            class="full-width"
            @click="resetFilters"
          ></q-btn>
        </div>
        <div class="col-12 col-md-6 q-my-md">
          <q-btn label="검색" class="full-width" @click="filterQuizzes"></q-btn>
        </div>
      </div>
    </q-card>

    <!-- Quiz Cards -->
    <div class="row q-col-gutter-md q-pt-md">
      <div
        v-for="quiz in filteredQuizzes"
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import userUseCategories from 'src/services/userUseCategories.js';

const quizzes = ref([]);
const filteredQuizzes = ref([]);
const subject = ref('');
const detailSubject = ref('');
const permssionStatus = ref('');
const quizType = ref('');

onMounted(async () => {
  await fetchQuizzes();
  fetchCategories();
});

const filteredDetailSubjectOptions = ref([]);
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userUseCategories();

const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

watch(subject, () => {
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

const fetchQuizzes = async () => {
  try {
    const response = await userApi.get('/api/quiz/my');
    quizzes.value = response.data;
    filteredQuizzes.value = quizzes.value;
    console.log('퀴즈목록 : ', quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const router = useRouter();

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

const goToQuizDetail = quizId => {
  router.push(`/userQuizzes/${quizId}`);
};

const resetFilters = () => {
  subject.value = '';
  detailSubject.value = '';
  permssionStatus.value = '';
  quizType.value = '';
  filteredQuizzes.value = quizzes.value;
};

const filterQuizzes = () => {
  console.log(subject.value);
  console.log(detailSubject.value);
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    return quiz.subject === subject.value;
  });
};
</script>
