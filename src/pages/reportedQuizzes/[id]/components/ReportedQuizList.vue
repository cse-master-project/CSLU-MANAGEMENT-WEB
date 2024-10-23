<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-3 q-my-md bold-text">
          <q-toggle v-model="isRange" label="날짜 범위 선택" color="primary" />
        </div>
        <!-- Start and End Date Inputs -->
        <div class="col-12 col-md-3 q-my-md bold-text" v-if="isRange">
          신고된 날짜 (시작일)
          <q-input
            v-model="startDate"
            outlined
            dense
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openStartDatePicker"
              />
            </template>
          </q-input>
          <q-popup-proxy
            ref="startDatePopup"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="startDate"
              mask="YYYY-MM-DD"
              @input="filterQuizzes"
            />
          </q-popup-proxy>
        </div>
        <div class="col-12 col-md-3 q-my-md bold-text" v-if="isRange">
          신고된 날짜 (종료일)
          <q-input
            v-model="endDate"
            outlined
            dense
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openEndDatePicker"
              />
            </template>
          </q-input>
          <q-popup-proxy
            ref="endDatePopup"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="endDate"
              mask="YYYY-MM-DD"
              @input="filterQuizzes"
            />
          </q-popup-proxy>
        </div>

        <!-- Single Date Input -->
        <div class="col-12 col-md-3 q-my-md bold-text" v-else>
          신고된 날짜
          <q-input
            v-model="singleDate"
            outlined
            dense
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openSingleDatePicker"
              />
            </template>
          </q-input>
          <q-popup-proxy
            ref="singleDatePopup"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="singleDate"
              mask="YYYY-MM-DD"
              @input="filterQuizzes"
            />
          </q-popup-proxy>
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
        v-for="quiz in paginatedQuizzes"
        :key="quiz.quizReportId"
        :class="getColumnClass()"
        class="q-my-md"
      >
        <q-card
          class="my-card bg-white q-mb-md"
          clickablesss
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3)"
        >
          <q-card-section>
            <div class="text-h6">퀴즈 ID : {{ quiz.quizId }}</div>
            <div class="text-subtitle1 bold-text text-primary">
              신고일 : {{ formatDate(quiz.reportAt) }}
            </div>
            <div class="text-body2 text-dark">
              신고 이유 : {{ truncateText(quiz.content, 100) }}
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
import { ref, computed, onMounted } from 'vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/admin/reportedQuiz.js';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const quizzes = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const totalElements = ref(0);

const filteredQuizzes = ref([]);
const startDate = ref(''); // Start date for range filter
const endDate = ref(''); // End date for range filter
const singleDate = ref(''); // Single date filter
const isRange = ref(false); // Toggle for range selection
const quizcount = ref(0); //퀴즈 개수ㄴㄴ

// 서버에서 퀴즈 목록 가져오기
const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    filterQuizzes();
    quizcount.value = filteredQuizzes.value.length;
    totalElements.value = quizzes.value.length;
  } catch (error) {
    console.error('퀴즈 데이터를 가져오는데 실패했습니다.', error);
  }
};
// 퀴즈 필터링 기능
const filterQuizzes = () => {
  if (isRange.value) {
    // 날짜 범위 필터링
    filteredQuizzes.value = quizzes.value.filter(quiz => {
      const quizDate = formatDate(quiz.reportAt).slice(0, 10); // 'YYYY-MM-DD' 형식으로 변환
      const isAfterStartDate = !startDate.value || quizDate >= startDate.value;
      const isBeforeEndDate = !endDate.value || quizDate <= endDate.value;
      return isAfterStartDate && isBeforeEndDate;
    });
  } else {
    // 단일 날짜 필터링
    filteredQuizzes.value = quizzes.value.filter(quiz => {
      const quizDate = formatDate(quiz.reportAt).slice(0, 10); // 'YYYY-MM-DD' 형식으로 변환
      return singleDate.value === '' || quizDate === singleDate.value;
    });
  }
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

// 필터 초기화
const resetFilters = () => {
  startDate.value = '';
  endDate.value = '';
  singleDate.value = '';
  filterQuizzes();
};

// 날짜 형식 포맷팅
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};
//  내용 줄임표
const truncateText = (text, length) => {
  if (text && text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
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
function goToQuizDetail(quizId) {
  router.push(`/ReportedQuizzes/${quizId}`);
}

onMounted(async () => {
  await fetchQuizzes();
});
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  overflow: hidden;
  min-height: 150px;
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
