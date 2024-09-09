<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-gutter-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-4 q-my-md">
          <q-select
            v-model="subject"
            :options="subjectOptions"
            label="과목"
            outlined
            dense
            @update:model-value="filteredDetailSubjectOptions"
          />
        </div>
        <div class="col-12 col-md-4 q-my-md">
          <q-select
            v-model="detailSubject"
            :options="filteredDetailSubjectOptions.slice().reverse()"
            label="챕터"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-4 q-my-md">
          <q-select
            v-model="quizType"
            :options="quizTypeOptions"
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
        v-for="quiz in paginatedQuizzes"
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
            <div class="text-body2">
              문제 유형 : {{ formatQuizType(quiz.quizType) }}
            </div>
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

    <!-- Pagination -->
    <div class="row q-col-gutter-md q-pt-md justify-center">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        max-pages="10"
        boundary-numbers
        @update:model-value="changePage"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import useCategories from 'src/services/useCategories.js';

const quizzes = ref([]);
const currentPage = ref(1); // 현재 페이지 번호
const pageSize = ref(20); // 페이지 크기
const totalElements = ref(0); // 전체 퀴즈 수

const filteredQuizzes = ref([]);
const subject = ref('');
const detailSubject = ref('');
const quizType = ref('');
const quizTypeOptions = [
  { value: 1, label: '4지선다형' },
  { value: 2, label: '단답형' },
  { value: 3, label: '선긋기형' },
  { value: 4, label: 'O/X형' },
  { value: 5, label: '빈칸 채우기형' },
];

// 카테고리 조회 서비스 사용.
const filteredDetailSubjectOptions = ref([]);
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};
watch(subject, () => {
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

// 서버에서 퀴즈 목록 들고 오기.
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/default', {
      params: {
        page: 0, // 서버에서 전체 데이터를 가져오기 위한 페이지 번호
        size: 1000, // 서버에서 전체 데이터를 가져오기 위한 크기
      },
    });
    quizzes.value = response.data.content;
    quizzes.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)); // 날짜 기준 내림차순 정렬
    filterQuizzes(); // 초기 필터링 및 페이지네이션 적용
    totalElements.value = quizzes.value.length; // 전체 퀴즈 수 업데이트
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

// 페이지네이션된 퀴즈 데이터를 반환하는 계산 속성
const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredQuizzes.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(totalElements.value / pageSize.value);
});

const changePage = page => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    filterQuizzes(); // 페이지 변경 시 필터링 및 페이지네이션 적용
  }
};

const filterQuizzes = () => {
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    const subjectMatch = !subject.value || quiz.subject === subject.value;
    const detailSubjectMatch =
      !detailSubject.value || quiz.detailSubject === detailSubject.value;
    const quizTypeMatch =
      !quizType.value || quiz.quizType === quizType.value.value;
    return subjectMatch && detailSubjectMatch && quizTypeMatch;
  });
  // 페이지네이션을 적용한 퀴즈 목록을 업데이트
  paginatedQuizzes.value = paginatedQuizzes.value;
};

// 필터링 초기화 함수
const resetFilters = () => {
  subject.value = '';
  detailSubject.value = '';
  quizType.value = '';
  filterQuizzes(); // 필터링 및 페이지네이션 적용
};

const router = useRouter();

const formatQuizType = quizType => {
  switch (quizType) {
    case 1:
      return '4지선다형';
    case 2:
      return '단답형';
    case 3:
      return '선긋기형';
    case 4:
      return 'O/X형';
    case 5:
      return '빈칸 채우기형';
    default:
      return '알 수 없는 유형';
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

const goToQuizDetail = quizId => {
  router.push(`/quizzes/${quizId}`);
};

onMounted(async () => {
  await fetchCategories();
  await fetchQuizzes();
});
</script>

<style scoped></style>

<route lang="yaml">
meta:
  layout: admin
</route>
