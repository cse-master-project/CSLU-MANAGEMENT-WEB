<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-4 q-my-md">
          <q-select
            v-model="subject"
            :options="subjectOptions"
            label="과목"
            outlined
            dense
            @update:model-value="updateDetailSubjectOptions"
          />
        </div>
        <div class="col-12 col-md-4 q-my-md">
          <q-select
            v-model="chapter"
            :options="filteredDetailSubjectOptions"
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
        v-for="quiz in quizzes"
        :key="quiz.quizId"
        class="col-12 col-md-6 q-my-md"
      >
        <q-card
          class="my-card bg-white q-mb-md"
          clickable
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)"
        >
          <q-card-section>
            <div>퀴즈ID : {{ quiz.quizId }}</div>
            <div class="text-h6 text-primary">과목: {{ quiz.subject }}</div>
            <div class="text-subtitle2 text-secondary">
              챕터: {{ quiz.detailSubject }}
            </div>
            <div class="text-body2 text-dark">
              문제 유형: {{ formatQuizType(quiz.quizType) }}
            </div>
            <div class="text-caption text-grey">
              생성일: {{ formatDate(quiz.createAt) }}
            </div>

            <!-- 퀴즈 내용 파싱 및 표시 -->
            <div v-if="parsedContent(quiz.jsonContent)" class="q-mt-md">
              <div class="text-h6">
                문제: {{ parsedContent(quiz.jsonContent)?.quiz }}
              </div>

              <div class="text-body2">
                정답: {{ parsedContent(quiz.jsonContent)?.answer }}
              </div>
              <div class="text-body2">
                해설: {{ parsedContent(quiz.jsonContent)?.commentary }}
              </div>
            </div>
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
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import useCategories from 'src/services/useCategories.js';

const quizzes = ref([]);
const filteredQuizzes = ref([]);
const subject = ref('');
const chapter = ref('');
const quizType = ref('');

const quizTypeOptions = [
  { value: 1, label: '4지선다형' },
  { value: 2, label: '단답형' },
  { value: 3, label: '선긋기형' },
  { value: 4, label: 'O/X형' },
  { value: 5, label: '빈칸 채우기형' },
];

onMounted(async () => {
  await fetchCategories();
  await fetchQuizzes();
});

//카테고리 조회 서비스 사용.
const filteredDetailSubjectOptions = ref([]);
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();
const updateDetailSubjectOptions = () => {
  //과목에 따른 챕터 필터링 함수.
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};
watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  chapter.value = '';
  updateDetailSubjectOptions();
});

const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/management/quiz/unapproved');
    quizzes.value = response.data; // 서버로부터 받아온 데이터를 quizzes에 저장
    filteredQuizzes.value = quizzes.value;
    console.log('미승인문제 :', quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
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
// JSON 콘텐츠 파싱 함수
const parsedContent = jsonContent => {
  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    return null;
  }
};

// 필터링 초기화 기능
const resetFilters = () => {
  subject.value = '';
  chapter.value = '';
  quizType.value = '';
  filteredQuizzes.value = quizzes.value;
};

//필터링 기능
const filterQuizzes = () => {
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    const subjectMatch = !subject.value || quiz.subject === subject.value;
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch = !quizType.value || quiz.quizType === quizType.value;
    return subjectMatch && chapterMatch && quizTypeMatch;
  });
};

// 상세조회.
function goToQuizDetail(quizId) {
  router.push(`/NotApprovedQuizzes/${quizId}`);
}
</script>
<style scoped>
.my-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.my-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 10px;
}

.text-subject {
  font-weight: bold;
  color: #ffa500; /* 주황색 */
}

.text-createAt {
  font-size: 0.75rem; /* 작은 글씨 */
  color: #888888; /* 회색 */
}
</style>
