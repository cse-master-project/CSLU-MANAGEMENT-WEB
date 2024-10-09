<template>
  <q-page padding>
    <!-- Filters card -->
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-4 q-my-md">
          과목
          <q-select
            v-model="subject"
            :options="subjectOptions.map(s => s.subject)"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-4 q-my-md">
          챕터
          <q-select
            v-model="chapter"
            :options="chapterOptions"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-4 q-my-md">
          문제 유형
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

    <!-- Quiz Cards -->
    <div class="row q-pt-md justify-between">
      <div
        v-for="quiz in filteredQuizzes"
        :key="quiz.quizId"
        class="col-12 col-md-6 q-my-md q-gutter-md"
      >
        <q-card
          class="my-card"
          clickable
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3)"
        >
          <q-card-section>
            <div>퀴즈ID : {{ quiz.quizId }}</div>
            <div class="text-h6 text-primary">과목 : {{ quiz.subject }}</div>
            <div class="text-subtitle2 text-secondary">
              챕터 : {{ quiz.chapter }}
            </div>
            <div class="text-body2 text-dark">
              문제 유형 : {{ formatQuizType(quiz.quizType) }}
            </div>
            <div class="text-caption text-grey">
              생성일 : {{ formatDate(quiz.createAt) }}
            </div>
          </q-card-section>

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
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/allUserQuiz.js'; // 퀴즈 서비스 호출
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useCategorie } from 'src/services/quiz/useCategorie.js';

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
    console.log(quizzes.value);
    filteredQuizzes.value = quizzes.value;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
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
    const chaptertMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch = !quizType.value || quiz.quizType === quizType.value;
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch =
      !quizType.value || quiz.quizType === quizType.value.value;

    return subjectMatch && chapterMatch && quizTypeMatch;
  });
};

const router = useRouter();

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
// 시간 알려주기.
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

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
