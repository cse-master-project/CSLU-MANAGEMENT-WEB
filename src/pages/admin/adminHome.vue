<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md row justify-center">
      <!-- 미승인 문제 카드 -->
      <q-card class="my-card col-12 col-md-5" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-center">미승인 문제</div>
        </q-card-section>
        <q-separator />
        <!-- 미승인 문제가 없을 때 안내 문구 표시 -->
        <div
          v-if="notApprovedQuizzes.length === 0"
          class="text-center q-mt-md text-grey"
        >
          미승인 문제가 없습니다.
        </div>
        <q-card-section>
          <div
            v-for="quiz in notApprovedQuizzes"
            :key="quiz.quizId"
            class="q-mt-md"
          >
            <q-card
              clickable
              v-ripple
              @click="goToNotApprovedQuizDetail(quiz.quizId)"
              class="my-card q-mb-md"
            >
              <q-card-section>
                <div>퀴즈ID : {{ quiz.quizId }}</div>
                <div class="text-subtitle1 bold-text text-primary">
                  과목 : {{ quiz.subject }}
                </div>
                <div class="text-subtitle1 text-secondary">
                  챕터 : {{ quiz.chapter }}
                </div>
                <div class="text-body2 text-dark">
                  문제 유형: {{ formatQuizType(quiz.quizType) }}
                </div>
                <div>생성일 : {{ formatDate(quiz.createAt) }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>

      <!-- 신고 문제 카드 -->
      <q-card class="my-card col-12 col-md-5" flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-center">신고 문제</div>
        </q-card-section>
        <q-separator />
        <!-- 신고 문제가 없을 때 안내 문구 표시 -->
        <div
          v-if="reportedQuizzes.length === 0"
          class="text-center q-mt-md text-grey"
        >
          신고된 문제가 없습니다.
        </div>
        <q-card-section>
          <div
            v-for="quiz in reportedQuizzes"
            :key="quiz.quizId"
            class="q-mt-md"
          >
            <q-card
              clickable
              v-ripple
              @click="goToReportedQuizDetail(quiz.quizId)"
              class="q-mb-md"
            >
              <q-card-section>
                <div>퀴즈ID: {{ quiz.quizId }}</div>
                <div class="text-body2 text-grey">
                  신고일: {{ formatDate(quiz.reportAt) }}
                </div>
                <div class="text-subtitle1 bold-text text-primary">
                  신고 이유: {{ quiz.content }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchQuizzesFromApi as fetchNotApprovedQuizzes } from 'src/services/quiz/admin/notApprovedQuiz.js';
import { fetchQuizzesFromApi as fetchReportedQuizzes } from 'src/services/quiz/admin/reportedQuiz.js';
import { useRouter } from 'vue-router';

const notApprovedQuizzes = ref([]);
const reportedQuizzes = ref([]);

// 미승인 문제와 신고 문제를 각각 서버에서 불러오는 함수
const loadQuizzes = async () => {
  notApprovedQuizzes.value = await fetchNotApprovedQuizzes();
  reportedQuizzes.value = await fetchReportedQuizzes();
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
// 날짜 형식 포맷 함수
const formatDate = dateString => {
  return new Date(dateString).toLocaleString();
};

const router = useRouter();
function goToNotApprovedQuizDetail(quizId) {
  router.push(`/NotApprovedQuizzes/${quizId}`);
}
function goToReportedQuizDetail(quizId) {
  router.push(`/ReportedQuizzes/${quizId}`);
}

// 컴포넌트가 마운트될 때 데이터를 불러옴
onMounted(() => {
  loadQuizzes();
});
</script>

<style scoped>
.my-card {
  margin: 10px; /* 카드 간의 간격을 조정합니다. */
  /* 반응형 디자인을 위해 미디어 쿼리를 사용할 수 있습니다. */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 카드에 약간의 그림자를 추가하여 입체감을 줍니다. */
}

.bg-grey-2 {
  background-color: #f5f5f5; /* 카드 섹션의 배경색을 약간 더 밝게 변경합니다. */
}

.text-center {
  text-align: center; /* 텍스트를 가운데 정렬합니다. */
}

.text-h6 {
  font-weight: bold; /* 제목 텍스트의 가중치를 증가시켜 강조합니다. */
  color: #faa108; /* 제목 텍스트 색상을 변경합니다. */
}

.q-gutter-md > .q-card {
  transition: transform 0.2s; /* 카드에 호버 효과를 추가하여 반응성을 높입니다. */
}

.q-gutter-md > .q-card:hover {
  transform: translateY(
    -5px
  ); /* 마우스를 올리면 카드가 살짝 떠오르는 효과를 줍니다. */
}

.bold-text {
  font-weight: bold; /* 굵게 표시 */
}
</style>
