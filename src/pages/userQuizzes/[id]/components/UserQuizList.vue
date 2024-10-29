<template>
  <q-page padding style="width: 90%; margin: 0 auto">
    <!-- Filters card -->
    <div
      class="q-card q-pa-md q-mb-md"
      style="display: flex; flex-direction: column; border-radius: 10px"
    >
      <div style="display: flex" class="filter-container">
        <!-- 과목 -->
        <div style="flex: 1; position: relative">
          <label for="subject">과목</label>
          <button class="custom-select" @click="toggleDropdown('subject')">
            {{ subjectLabel }}
          </button>
          <ul
            v-if="dropdowns.subject"
            class="listbox"
            style="max-height: 300px; overflow-y: auto"
          >
            <li
              v-for="option in subjectOptions"
              :key="option.value"
              @click="selectSubject(option)"
            >
              <button class="list">
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- 챕터 -->
        <div style="flex: 1; position: relative">
          <label for="detailSubject">챕터</label>
          <button
            class="custom-select"
            @click="toggleDropdown('detailSubject')"
          >
            {{ chapterLabel }}
          </button>
          <ul
            v-if="dropdowns.detailSubject"
            class="listbox"
            style="max-height: 300px; overflow-y: auto"
          >
            <li
              v-for="option in filteredDetailSubjectOptions"
              :key="option"
              @click="selectDetailSubject(option)"
            >
              <button class="list">
                {{ option }}
              </button>
            </li>
          </ul>
        </div>

        <!-- 승인 여부 -->
        <div style="flex: 1; position: relative">
          <label for="permssionStatus">승인 여부</label>
          <button
            class="custom-select"
            @click="toggleDropdown('permssionStatus')"
          >
            {{ permssionStatusLabel }}
          </button>
          <ul v-if="dropdowns.permssionStatus" class="listbox">
            <li
              v-for="option in approvalStatuses"
              :key="option.value"
              @click="selectPermssionStatus(option)"
            >
              <button class="list">
                <span
                  :class="getDotClass(option.value)"
                  class="status-dot"
                ></span>
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- 문제 유형 -->
        <div style="flex: 1; position: relative">
          <label for="quizType">문제 유형</label>
          <button class="custom-select" @click="toggleDropdown('quizType')">
            {{ quizTypeLabel }}
          </button>
          <ul v-if="dropdowns.quizType" class="listbox">
            <li
              v-for="option in quizTypeOptions"
              :key="option.value"
              @click="selectQuizType(option)"
            >
              <button class="list">
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 초기화 & 검색 버튼 -->
      <div style="display: flex" class="btn-container">
        <div style="flex: 1">
          <q-btn
            class="resetbtn"
            @click="resetFilters"
            style="font-size: 16px; width: 100%"
          >
            초기화
          </q-btn>
        </div>
        <div style="flex: 1">
          <q-btn class="searchbtn" @click="filterQuizzes"> 검색 </q-btn>
        </div>
      </div>
    </div>

    <!-- 문제 개수 -->
    <div style="font-size: 1rem">
      검색된 문제 개수 : <strong>{{ quizcount }}</strong>
    </div>

    <!-- Quiz Cards -->
    <div class="row q-pt-md justify-between">
      <div
<<<<<<< HEAD
        v-for="quiz in filteredQuizzes"
=======
        v-if="filteredQuizzes.length === 0"
        class="col-12 text-center text-grey q-my-md"
      >
        퀴즈가 없습니다.
      </div>
      <div
        v-for="quiz in paginatedQuizzes"
>>>>>>> origin/hjy1021
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
<<<<<<< HEAD
import { fetchQuizzesFromApi } from 'src/services/quiz/userQuiz.js'; // 퀴즈 서비스 호출
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import userQuizlistCategories from 'src/services/userQuizlistCategoris';
import userFilterStroe from 'src/stores/userfilter';
=======
import { fetchQuizzesFromApi } from 'src/services/quiz/user/userQuiz.js'; // 퀴즈 서비스 호출
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useCategorieUser } from 'src/services/quiz/user/useCategorieUser.js';
>>>>>>> origin/hjy1021

const userfilter = userFilterStroe();

const quizzes = ref([]);
const filteredQuizzes = ref([]);
const subject = ref(userfilter.subject);
const chapter = ref(userfilter.chapter);
const permssionStatus = ref(userfilter.permissionStatus);
const quizType = ref('');
const quizcount = ref(0); //만든 문제 개수

const dropdowns = ref({
  subject: false,
  chapter: false,
  permssionStatus: false,
  quizType: false,
});
const approvalStatuses = [
  { value: 0, label: '승인 대기중' },
  { value: 1, label: '승인' },
  { value: -1, label: '반려' },
];
const quizTypeOptions = [
  { value: 1, label: '4지선다형' },
  { value: 2, label: '단답형' },
  { value: 3, label: '선긋기형' },
  { value: 4, label: 'O/X형' },
  { value: 5, label: '빈칸 채우기형' },
];

const subjectLabel = ref('선택해주세요');
const chapterLabel = ref('선택해주세요');
const permssionStatusLabel = ref('선택해주세요');
const quizTypeLabel = ref('선택해주세요');
const filteredDetailSubjectOptions = ref([]);

onMounted(async () => {
  await fetchQuizzes();
  fetchCategories();
  document.addEventListener('click', handleClickOutside);
});

const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userQuizlistCategories();

const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

watch(subject, () => {
  chapter.value = '';
  chapterLabel.value = '선택해주세요';
  updateDetailSubjectOptions();
});

const fetchQuizzes = async () => {
  try {
    quizzes.value = await fetchQuizzesFromApi();
    // console.log('퀴즈목록', quizzes.value);
    quizzes.value.sort((a, b) => new Date(b.createAt) - new Date(a.createAt)); // 날짜 기준 내림차순 정렬
    filteredQuizzes.value = quizzes.value;
    quizcount.value = filteredQuizzes.value.length;
  } catch (error) {
    alert('퀴즈 데이터를 불러오는데 실패했습니다.');
    // console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
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
  permssionStatus.value = '';
  quizType.value = '';
  subjectLabel.value = '선택해주세요';
  chapterLabel.value = '선택해주세요';
  permssionStatusLabel.value = '선택해주세요';
  quizTypeLabel.value = '선택해주세요';
  filteredQuizzes.value = quizzes.value;
  quizcount.value = filteredQuizzes.value.length; // 초기화 하고 필터링된 퀴즈 개수 다시 초기화
};

// 필터링 기능
const filterQuizzes = () => {
  filteredQuizzes.value = quizzes.value.filter(quiz => {
    const subjectMatch = !subject.value || quiz.subject === subject.value;
    const chapterMatch = !chapter.value || quiz.chapter === chapter.value;
    const permssionStatusMatch =
      permssionStatus.value === '' ||
      quiz.permissionStatus === Number(permssionStatus.value);
    const quizTypeMatch = !quizType.value || quiz.quizType === quizType.value;

    return (
      subjectMatch && chapterMatch && permssionStatusMatch && quizTypeMatch
    );
  });
  quizcount.value = filteredQuizzes.value.length; // 필터링 하고 필터링된 퀴즈 수 업데이트하기
};

// 페이지 상세조회
const goToQuizDetail = quizId => {
  router.push(`/userQuizzes/${quizId}`);
};

// 드롭다운 토글
const toggleDropdown = dropdown => {
  dropdowns.value[dropdown] = !dropdowns.value[dropdown];
  Object.keys(dropdowns.value).forEach(key => {
    if (key !== dropdown) dropdowns.value[key] = false;
  });
};

// 과목 선택
const selectSubject = option => {
  subject.value = option.value;
  subjectLabel.value = option.label;
  toggleDropdown('subject');
  updateDetailSubjectOptions();
};

// 챕터 선택
const selectDetailSubject = option => {
  chapter.value = option;
  chapterLabel.value = option;
  toggleDropdown('detailSubject');
};

// 승인 여부 선택
const selectPermssionStatus = option => {
  permssionStatus.value = option.value;
  permssionStatusLabel.value = option.label;
  toggleDropdown('permssionStatus');
};

// 문제 유형 선택
const selectQuizType = option => {
  quizType.value = option.value;
  quizTypeLabel.value = option.label;
  toggleDropdown('quizType');
};

// 리스트 밖 누르면 닫히기
const handleClickOutside = event => {
  const dropdownElements = document.querySelectorAll(
    '.listbox, .custom-select',
  );
  let isClickInside = false;
  dropdownElements.forEach(element => {
    if (element.contains(event.target)) {
      isClickInside = true;
    }
  });

  if (!isClickInside) {
    Object.keys(dropdowns.value).forEach(key => {
      dropdowns.value[key] = false;
    });
  }
};

// 승인여부 원
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
