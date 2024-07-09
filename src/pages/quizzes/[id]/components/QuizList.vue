<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-select
        v-model="subject"
        :options="subjectOptions"
        label="과목 선택"
        class="q-mb-md"
        @update:model-value="updateDetailSubjectOptions"
      ></q-select>
      <q-select
        v-model="detailSubject"
        :options="filteredDetailSubjectOptions"
        label="챕터 선택"
        class="q-mb-md"
      ></q-select>
      <q-btn @click="sortQuizzes">문제정렬</q-btn>
      <q-list bordered class="rounded-borders">
        <div v-for="quiz in quizzes" :key="quiz.quizId" class="q-mb-md">
          <q-card
            clickable
            v-ripple
            @click="goToQuizDetail(quiz.quizId)"
            class="my-card"
          >
            <q-card-section class="card-content">
              <div class="row justify-between">
                <div class="text-h6 text-subject">
                  과목 : {{ quiz.subject }}
                </div>
                <div class="text-body2">
                  {{ formatQuizType(quiz.quizType) }}
                </div>
              </div>
              <div class="row justify-between">
                <div class="text-subtitle2">
                  챕터 : {{ quiz.detailSubject }}
                </div>
              </div>
              <div class="text-caption text-createAt">
                생성일 : {{ formatDate(quiz.createAt) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import useCategories from 'src/services/useCategories.js';

//카테고리 조회 서비스 사용.
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();

const quizzes = ref([]);
const subject = ref('');
const detailSubject = ref('');
const filteredDetailSubjectOptions = ref([]);

watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

onMounted(async () => {
  await fetchCategories();
  await fetchQuizzes();
});

const quizSubject = ref([]);
const quizDetailSubject = ref([]);
//서버에서 퀴즈 목록 들고 오기.
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/default');
    quizzes.value = response.data.content;
    quizSubject.value = quizzes.value.map(quiz => quiz.subject);
    quizDetailSubject.value = quizzes.value.map(quiz => quiz.detailSubject);
    console.log('퀴즈목록 : ', quizzes.value);
    console.log('과목목록 : ', quizSubject.value);
    console.log('챕터목록 : ', quizDetailSubject.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const router = useRouter();

const goToQuizDetail = quizId => {
  router.push(`/quizzes/${quizId}`);
};

//과목에 따른 챕터 필터링 함수.
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

// 퀴즈 정렬하기.
const sortQuizzes = () => {
  console.log(subject.value); //이건 목록에서 선택한 과목
  console.log(detailSubject.value); //이건 목록에서 선택한 챕터
  console.log(quizSubject.value); //이건 서버에서 가져온 과목
  console.log(quizDetailSubject.value); //이건 서버에서 가져온 챕터
};

// 문제 형식에 따라 유형 알려주기.
const formatQuizType = quizType => {
  switch (quizType) {
    case 1:
      return '<4지선다형>';
    case 2:
      return '<단답형>';
    case 3:
      return '<선긋기형>';
    case 4:
      return '<O/X형>';
    case 5:
      return '<빈칸 채우기형>';
    default:
      return '<알 수 없는 유형>';
  }
};

// 시간 알려주기.
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};
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

<route lang="yaml">
meta:
  layout: admin
</route>
