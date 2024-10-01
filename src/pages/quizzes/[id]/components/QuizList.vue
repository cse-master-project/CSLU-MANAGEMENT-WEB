<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-3 q-my-md">
          과목
          <q-select
            v-model="subject"
            :options="subjectOptions"
            outlined
            dense
            @update:model-value="updateDetailSubjectOptions"
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
          챕터
          <q-select
            v-model="chapter"
            :options="filteredDetailSubjectOptions.reverse().slice()"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
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
            class="full-width bg-grey-2 text-primary"
            @click="resetFilters"
          />
        </div>
        <div class="col-12 col-md-6 q-my-md">
          <q-btn
            label="검색"
            class="full-width bg-primary text-white"
            @click="filterQuizzes"
          />
        </div>
      </div>
    </q-card>

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
            <div class="text-h6 text-primary">과목: {{ quiz.subject }}</div>
            <div class="text-subtitle2 text-secondary">
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
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useFilterStore } from 'src/stores/filter';
import useCategories from 'src/services/useCategories.js';

const filterStore = useFilterStore();

const quizzes = ref([]);
const currentPage = ref(1); // 현재 페이지 번호
const pageSize = ref(20); // 페이지 크기
const totalElements = ref(0); // 전체 퀴즈 수

const filteredQuizzes = ref([]);
const subject = ref(filterStore.subject);
const chapter = ref(filterStore.chapter);
const quizType = ref(filterStore.quizType);
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
watch(subject, newValue => {
  chapter.value = '';
  filteredDetailSubjectOptions.value = [];
  updateDetailSubjectOptions();
  filterStore.setSubject(newValue);
});
watch(chapter, newValue => {
  filterStore.setChapter(newValue); // setDetailSubject에서 setChapter로 변경
});
watch(quizType, newValue => {
  filterStore.setQuizType(newValue);
});

// 서버에서 퀴즈 목록 들고 오기.
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/v2/quiz/default', {
      params: {
        page: 0, // 서버에서 전체 데이터를 가져오기 위한 페이지 번호
        size: 1000, // 서버에서 전체 데이터를 가져오기 위한 크기
      },
    });
    quizzes.value = response.data.content;
    console.log('퀴즈목록', quizzes.value);
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
  return Math.ceil(filteredQuizzes.value.length / pageSize.value);
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
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch =
      !quizType.value || quiz.quizType === quizType.value.value; // 객체에서 value 값을 추출하여 비교
    return subjectMatch && chapterMatch && quizTypeMatch;
  });
  // 페이지네이션을 적용한 퀴즈 목록을 업데이트
  console.log('Filtered Quizzes:', filteredQuizzes.value);
};

// 필터링 초기화 함수
const resetFilters = () => {
  subject.value = '';
  chapter.value = '';
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

// JSON 콘텐츠 파싱 함수
const parsedContent = jsonContent => {
  try {
    return JSON.parse(jsonContent);
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    return null;
  }
};
const currentLayout = ref(1);

const setLayout = layout => {
  currentLayout.value = layout; // 주어진 레이아웃으로 설정
};

const getColumnClass = () => {
  switch (currentLayout.value) {
    case 1:
      return 'col-12'; // 1열 레이아웃
    case 2:
      return 'col-12 col-md-6'; // 2열 레이아웃
    case 3:
      return 'col-12 col-md-3'; // 4열 레이아웃
    default:
      return 'col-12';
  }
};
onMounted(async () => {
  await fetchCategories();
  await fetchQuizzes();
});
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  overflow: hidden;
  min-height: 300px; /* 최소 높이 설정 */
  /* 또는 높이를 고정하고 싶다면 */
  height: 300px;
}

.q-card-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.q-btn {
  border-radius: 5px;
}

.q-pagination {
  border-radius: 5px;
}

.bg-primary {
  background-color: #1976d2; /* Primary color */
}

.text-primary {
  color: #1976d2; /* Primary color */
}

.bg-grey-2 {
  background-color: #f5f5f5;
}

.text-secondary {
  color: #757575;
}

.text-dark {
  color: #333;
}

.text-grey {
  color: #9e9e9e;
}
.layoutimg {
  width: 40px;
  height: auto;
  display: flex;
}
.layout2 {
  width: 50px;
}
@media (max-width: 1100px) {
  .layoutbtn {
    display: none;
  }
}
</style>
