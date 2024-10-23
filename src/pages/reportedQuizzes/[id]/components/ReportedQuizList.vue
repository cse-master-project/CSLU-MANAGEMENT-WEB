<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-4 q-my-md">
          <q-toggle v-model="isRange" label="날짜 범위 선택" color="primary" />
        </div>
      </div>
      <div class="row q-col-gutter-md q-py-md">
        <!-- Start and End Date Inputs -->
        <div class="col-12 col-md-4 q-my-md" v-if="isRange">
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
        <div class="col-12 col-md-4 q-my-md" v-if="isRange">
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
        <div class="col-12 col-md-4 q-my-md" v-else>
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
import { ref, onMounted } from 'vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/admin/reportedQuiz.js';
import { useRouter } from 'vue-router';
import { date } from 'quasar';

const quizzes = ref([]);
const filteredQuizzes = ref([]);
const startDate = ref(''); // Start date for range filter
const endDate = ref(''); // End date for range filter
const singleDate = ref(''); // Single date filter
const isRange = ref(false); // Toggle for range selection

// 서버에서 퀴즈 목록 가져오기
const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    console.log('신고된 문제:', quizzes.value);
    filteredQuizzes.value = quizzes.value;
  } catch (error) {
    console.error('퀴즈 데이터를 가져오는데 실패했습니다.', error);
  }
};

// 필터 초기화
const resetFilters = () => {
  startDate.value = '';
  endDate.value = '';
  singleDate.value = '';
  filteredQuizzes.value = quizzes.value;
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
};

// 날짜 형식 포맷팅
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
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
