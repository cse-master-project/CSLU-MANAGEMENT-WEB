<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-3 q-my-md bold-text">
          과목
          <q-select
            v-model="subject"
            :options="subjectOptions.map(s => s.subject)"
            outlined
            label="과목"
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md bold-text">
          챕터
          <q-select
            v-model="chapter"
            :options="chapterOptions"
            outlined
            label="챕터"
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md bold-text">
          문제유형
          <q-select
            v-model="quizType"
            :options="quizTypeOptions"
            outlined
            dense
          />
        </div>
      </div>
      <div class="row q-col-gutter-md q-pt-md">
        <div class="col-12 col-md-6 q-my-md">
          <q-btn
            label="초기화"
            class="full-width bg-grey-2 text-primary bold-text"
            @click="resetFilters"
          />
        </div>
        <div class="col-12 col-md-6 q-my-md">
          <q-btn
            label="검색"
            class="full-width bg-primary text-white bold-text"
            @click="filterQuizzes"
          />
        </div>
      </div>
    </q-card>
    <!-- 문제 개수 -->
    <div style="font-size: 1rem">
      퀴즈 개수 : <strong>{{ quizcount }}</strong>
    </div>

    <!--레이아웃 변경-->
    <div class="layoutbtn q-gutter-md" align="right">
      <q-btn @click="setLayout(1)" class="layout-btn no-padding">
        <img src="/1layout.png" alt="1열" class="layoutimg"
      /></q-btn>
      <q-btn @click="setLayout(2)" class="layout-btn no-padding">
        <img src="/2layout.png" alt="2열" class="layoutimg"
      /></q-btn>
      <q-btn @click="setLayout(3)" class="layout-btn no-padding">
        <img src="/3layout.png" alt="3열" class="layoutimg"
      /></q-btn>
    </div>

    <!-- Quiz Cards -->
    <div class="row q-col-gutter-md q-pt-md">
      <div
        v-if="filteredQuizzes.length === 0"
        class="col-12 text-center text-grey q-my-md"
      >
        퀴즈가 없습니다.
      </div>
      <div
        v-for="quiz in paginatedQuizzes"
        :key="quiz.quizId"
        :class="getColumnClass()"
        class="q-my-md"
      >
        <q-card
          class="my-card bg-white q-mb-md"
          clickable
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3)"
        >
          <q-card-section>
            <div>퀴즈ID : {{ quiz.quizId }}</div>
            <div class="text-subtitle1 bold-text text-primary">
              과목: {{ quiz.subject }}
            </div>
            <div class="text-subtitle1 text-secondary">
              챕터: {{ quiz.chapter }}
            </div>
            <div class="text-body2 text-dark">
              문제 유형: {{ formatQuizType(quiz.quizType) }}
            </div>
            <div class="text-caption text-grey">
              생성일: {{ formatDate(quiz.createAt) }}
            </div>

            <!-- 퀴즈 내용 파싱 및 표시 -->
            <div v-if="parsedContent(quiz.jsonContent)" class="q-mt-md">
              <div class="text-body2 bold-text quiz-content">
                문제:
                {{ truncateText(parsedContent(quiz.jsonContent)?.quiz, 100) }}
              </div>

              <div class="text-body2 quiz-content">
                정답:
                {{ truncateText(parsedContent(quiz.jsonContent)?.answer, 50) }}
              </div>
              <div class="text-body2 quiz-content">
                해설:
                {{
                  truncateText(parsedContent(quiz.jsonContent)?.commentary, 100)
                }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row q-gutter-md q-pt-md justify-center">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        max-pages="10"
        boundary-numbers
        @update:model-value="changePage"
        class="bg-grey-2"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/admin/allUserQuiz.js'; // 퀴즈 서비스 호출
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useCategorie } from 'src/services/quiz/admin/useCategorie.js';

const quizzes = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalElements = ref(0);

const filteredQuizzes = ref([]);
const quizcount = ref(0); //퀴즈 개수

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

//카테고리 조회 서비스 사용.
const {
  subjectOptions,
  chapterOptions,
  fetchSubjects,
  selectSubject,
  fetchChapters,
} = useCategorie();
watch(subject, newSubject => {
  if (newSubject) {
    selectSubject(newSubject);
    chapter.value = ''; // 과목 변경 시 챕터 초기화
  }
});

//서버에서 퀴즈 목록 들고 오기.
const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    quizzes.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    filterQuizzes();
    quizcount.value = filteredQuizzes.value.length;
    totalElements.value = quizzes.value.length;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
//필터링 기능
const filterQuizzes = () => {
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    const subjectMatch = !subject.value || quiz.subject === subject.value;
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch =
      !quizType.value || quiz.quizType === quizType.value.value;

    return subjectMatch && chapterMatch && quizTypeMatch;
  });
  quizcount.value = filteredQuizzes.value.length;
};

// 페이징 처리
const paginatedQuizzes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredQuizzes.value.slice(start, end);
});
const totalPages = computed(() =>
  Math.ceil(filteredQuizzes.value.length / pageSize.value),
);
const changePage = page => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    filterQuizzes();
  }
};

// 필터링 초기화 기능
const resetFilters = () => {
  subject.value = '';
  chapter.value = '';
  quizType.value = '';
  filterQuizzes();
};

// 문제 형식에 따라 유형 알려주기.
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
// JSON 콘텐츠 파싱 함수
const parsedContent = jsonContent => {
  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    return null;
  }
};
//  내용 줄임표
const truncateText = (text, length) => {
  if (text && text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};
// 시간 알려주기.
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

const currentLayout = ref(1);
const setLayout = layout => {
  currentLayout.value = layout;
};
const getColumnClass = () => {
  switch (currentLayout.value) {
    case 1:
      return 'col-12';
    case 2:
      return 'col-12 col-md-6';
    case 3:
      return 'col-12 col-md-3';
    default:
      return 'col-12';
  }
};

const router = useRouter();
const goToQuizDetail = quizId => {
  router.push(`/allUserQuizzes/${quizId}`);
};

onMounted(async () => {
  await fetchSubjects();
  await fetchQuizzes();
});
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  overflow: hidden;
  min-height: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); /* 살짝 더 부드러운 그림자 */
}

.q-card-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.q-btn {
  border-radius: 5px;
  font-size: 0.9rem; /* 버튼 폰트 사이즈 조정 */
}

.q-pagination {
  border-radius: 5px;
}

.bg-primary {
  background-color: #1976d2;
}

.text-primary {
  color: #1976d2;
}

.bg-grey-2 {
  background-color: #f5f5f5;
}

.text-secondary {
  color: #6c757d; /* 더 부드러운 회색 */
}

.text-dark {
  color: #495057; /* 살짝 밝은 어두운 색상 */
}

.text-grey {
  color: #adb5bd; /* 부드러운 회색 */
}

.layoutimg {
  width: 40px;
  height: auto;
  display: flex;
}

.quiz-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1100px) {
  .layoutbtn {
    display: none;
  }
}

.bold-text {
  font-weight: bold; /* 굵게 표시 */
}
</style>
