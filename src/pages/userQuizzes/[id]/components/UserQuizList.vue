<template>
  <q-page padding style="width: 90%; margin: 0 auto">
    <q-card class="q-mb-md q-pa-md">
      <div class="row q-col-gutter-md q-py-md">
        <div class="col-12 col-md-3 q-my-md">
          과목
          <q-select
            v-model="subject"
            :options="subjectOptions.map(s => s.subject)"
            outlined
            label="과목"
            dense
          />
        </div>
        <div class="col-12 col-md-3 q-my-md">
          챕터
          <q-select
            v-model="chapter"
            :options="chapterOptions"
            outlined
            label="챕터"
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
        <div class="col-12 col-md-3 q-my-md">
          승인여부
          <q-select
            v-model="permissionStatus"
            :options="approvalStatuses"
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
    <!-- 문제 개수 -->
    <div style="font-size: 1rem">
      퀴즈 개수 : <strong>{{ quizcount }}</strong>
    </div>

    <!-- Quiz Cards -->
    <div class="row q-pt-md justify-between">
      <div
        v-for="quiz in filteredQuizzes"
        :key="quiz.quizId"
        class="col-12 col-md-6 q-my-md q-gutter-md"
      >
        <q-card
          class="my-card-list"
          clickable
          v-ripple
          @click="goToQuizDetail(quiz.quizId)"
          style="cursor: pointer"
        >
          <q-card-section>
            <div class="text-h6" style="font-weight: bold">
              과목 : {{ quiz.subject }}
            </div>
            <div class="text-subtitle2">챕터 : {{ quiz.chapter }}</div>
            <div class="text-body2">
              문제 유형 : {{ formatQuizType(quiz.quizType) }}
            </div>
            <div class="text-caption text-createAt">
              생성일 : {{ formatDate(quiz.createAt) }}
            </div>

            <!-- 퀴즈 내용 파싱 및 표시 -->
            <div v-if="parsedContent(quiz.jsonContent)" class="q-mt-md">
              <div class="text-h6">
                문제 : {{ parsedContent(quiz.jsonContent)?.quiz }}
              </div>

              <div class="text-body2">
                정답 : {{ parsedContent(quiz.jsonContent)?.answer }}
              </div>
              <div class="text-body2">
                해설 : {{ parsedContent(quiz.jsonContent)?.commentary }}
              </div>
            </div>
          </q-card-section>

          <q-separator inset /><!--선-->

          <q-card-section>
            <QuizPermssionStatus :quiz="quiz" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import QuizPermssionStatus from 'src/components/quiz/QuizPermissionStatus.vue';
import { fetchQuizzesFromApi } from 'src/services/quiz/userQuiz.js'; // 퀴즈 서비스 호출
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useCategorieUser } from 'src/services/quiz/useCategorieUser.js';

const quizzes = ref([]); // 퀴즈 전체 데이터
const filteredQuizzes = ref([]); // 필터링된 퀴즈 목록
const quizcount = ref(0); //퀴즈 개수

const subject = ref(''); // 선택된 과목
const chapter = ref(''); // 선택된 챕터
const permissionStatus = ref(''); // 선택된 승인 여부
const quizType = ref(''); // 선택된 문제 유형
// 승인여부 옵션
const approvalStatuses = [
  { value: 0, label: '승인 대기중' },
  { value: 1, label: '승인' },
  { value: -1, label: '반려' },
];
// 퀴즈타입 옵션
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
} = useCategorieUser();
watch(subject, newSubject => {
  if (newSubject) {
    selectSubject(newSubject);
    chapter.value = ''; // 과목 변경 시 챕터 초기화
  }
});

// 퀴즈 데이터를 서버에서 불러오기
const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    // console.log('퀴즈목록', quizzes.value);
    quizzes.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)); // 날짜 기준 내림차순 정렬
    filterQuizzes();
    // 필터링된 퀴즈 개수 업데이트
    quizcount.value = filteredQuizzes.value.length;
  } catch (error) {
    alert('퀴즈 데이터를 불러오는데 실패했습니다.');
    // console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
//필터링 기능
const filterQuizzes = () => {
  console.log('필터링 퀴즈 value', quizzes.value);

  filteredQuizzes.value = quizzes.value.filter(quiz => {
    console.log('permissionStatus', quiz.permissionStatus);
    const subjectMatch = !subject.value || quiz.subject === subject.value;
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const quizTypeMatch =
      !quizType.value || quiz.quizType === quizType.value.value;
    const permissionStatusMatch =
      !permissionStatus.value ||
      quiz.permissionStatus === permissionStatus.value.value;

    return (
      subjectMatch && chapterMatch && quizTypeMatch && permissionStatusMatch
    );
  });
  quizcount.value = filteredQuizzes.value.length;
};

// 필터링 초기화 기능
const resetFilters = () => {
  subject.value = '';
  chapter.value = '';
  quizType.value = '';
  permissionStatus.value = '';
  filterQuizzes();
};

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
// 승인여부 상태
const getDotClass = value => {
  switch (value) {
    case 0:
      return 'dot-pending';
    case 1:
      return 'dot-approved';
    case -1:
      return 'dot-rejected';
    default:
      return '';
  }
};

const router = useRouter();
// 페이지 상세조회
const goToQuizDetail = quizId => {
  router.push(`/userQuizzes/${quizId}`);
};

onMounted(async () => {
  await fetchQuizzes(); // 퀴즈 목록
  await fetchSubjects();
});
</script>

<style>
.filter-container > * {
  margin: 1% 1%;
}
.btn-container > * {
  margin: 1% 1%;
}
.searchbtn {
  border-radius: 10px;
  padding: 7px 11px;
  font-size: 16px;
  width: 100%;
  background-color: #ced4da;
}
.resetbtn {
  border-radius: 10px;
  padding: 7px 11px;
}
.custom-select {
  width: 100%;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 12px 13px;
  font-size: 14px;
  line-height: 16px;
  background: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20height%3D%2224px%22%20viewBox%3D%220%20-960%20960%20960%22%20width%3D%2224px%22%20fill%3D%22%235f6368%22%3E%3Cpath%20d%3D%22M480-360%20280-560h400L480-360Z%22/%3E%3C/svg%3E')
    93% no-repeat; /*화살표 이미지 삽입*/
  appearance: none;
  text-align: left;
}
.custom-select:focus {
  box-sizing: border-box;
  border-radius: 10px;
  outline: 2px solid #b1dbf0;
  border-radius: 10px;
}
.listbox {
  width: 100%;
  padding: 0 3%;
  list-style: none;
  background: #ffffff;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  margin-top: 9px;
  position: absolute;
  z-index: 1;
}

.list {
  border: none;
  background-color: #ffffff;
  font-size: 14px;
  line-height: 16px;
  padding: 7px 3%;
  margin: 5px auto;
  box-sizing: border-box;
  width: 100%;
  text-align: left;
}

.list:focus {
  background: #99c6ec;
  border-radius: 8px;
  box-sizing: border-box;
}
.status-dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.dot-pending {
  background-color: orange;
}

.dot-approved {
  background-color: #4caf50;
}

.dot-rejected {
  background-color: rgb(255, 0, 0);
}
.my-card-list {
  border-radius: 10px;
}
.my-card-list:hover {
  border: 2px solid #99c6ec;
}

/* 반응형 (모바일 사이즈) */
@media (max-width: 500px) {
  .filter-container {
    flex-direction: column;
  }
  .btn-container {
    flex-direction: column;
    margin-top: 5%;
  }
}
</style>
