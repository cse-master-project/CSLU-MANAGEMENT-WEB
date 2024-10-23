<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-4 q-my-md">
          신고된 날짜
          <q-input
            v-model="selectedDate"
            outlined
            dense
            mask="####-##-##"
            placeholder="YYYY-MM-DD"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
                @click="openDatePicker"
              />
            </template>
          </q-input>
          <q-popup-proxy
            ref="datePopup"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="selectedDate"
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

    <!-- Quiz Cards -->
    <div class="row q-col-gutter-md q-pt-md">
      <div
        v-for="quiz in filteredQuizzes"
        :key="quiz.quizReportId"
        class="col-12 col-md-6 q-my-md"
      >
        <q-card
          class="my-card"
          clickablesss
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer"
        >
          <q-card-section>
            <div class="text-h6">퀴즈 ID: {{ quiz.quizId }}</div>
            <div class="text-caption text-reportAt">
              신고일: {{ formatDate(quiz.reportAt) }}
            </div>
            <div class="text-subtitle2">신고 이유 : {{ quiz.content }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/admin/reportedQuiz.js';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useCategorie } from 'src/services/quiz/admin/useCategorie.js';

const quizzes = ref([]);
const filteredQuizzes = ref([]);
const selectedDate = ref(''); // Date filter

//카테고리 조회 서비스 사용.
const {
  subjectOptions,
  chapterOptions,
  fetchSubjects,
  selectSubject,
  fetchChapters,
} = useCategorie();

//서버에서 퀴즈 목록 들고 오기.
const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    console.log('신고된 문제 :', quizzes.value);
  } catch (error) {
    console.error('퀴즈 신고 데이터를 불러오는데 실패했습니다.', error);
  }
};

// 필터링 초기화 기능
const resetFilters = () => {
  selectedDate.value = '';
  filteredQuizzes.value = quizzes.value;
};

// 필터링 기능
const filterQuizzes = () => {
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    // 신고된 날짜가 선택된 날짜와 일치하는지 확인
    const quizDate = formatDate(quiz.reportAt).slice(0, 10); // 'YYYY-MM-DD' 형식으로 자름
    const selectedDateStr = selectedDate.value;
    return selectedDateStr === '' || quizDate === selectedDateStr;
  });
};

// 시간 형식 변환
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

const router = useRouter();
function goToQuizDetail(quizId) {
  router.push(`/ReportedQuizzes/${quizId}`);
}

onMounted(async () => {
  await fetchQuizzes();
  filteredQuizzes.value = quizzes.value;
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
