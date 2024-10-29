<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" v-if="quizzes" style="width: 90%; max-width: 600px">
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div>퀴즈 ID : {{ quizzes.quizId }}</div>
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ quizzes.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">챕터 : {{ quizzes.chapter }}</div>

        <!-- 이미지 표시 -->
        <div v-if="imageUrl" class="q-mt-md">
          <img
            :src="imageUrl"
            alt="문제 이미지"
            style="max-width: 100%; height: auto; border-radius: 8px"
          />
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(quizzes.quizType)"
          :quizcontent="quizContent"
          v-if="!isEditing"
        />
        <!-- 퀴즈 수정시 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
        <component
          :is="quizTypeEditForm(quizzes.quizType)"
          :quizcontent="quizContent"
          :quizzes="quizzes"
          :quiz-reportId="quizReportId"
          @update:quizcontent="updateQuizContent"
          @update:isEditing="isEditing = false"
          v-if="isEditing"
        />
      </q-card-section>

      <!--신고된 이유 -->
      <q-card-section class="q-pa-md report-section">
        <q-chip small outline class="text-caption text-red report-chip"
          >신고 사유</q-chip
        >
        <div
          v-for="report in reports"
          :key="report.quizReportId"
          class="q-mt-sm report-item"
        >
          <q-item class="report-item-card">
            <q-item-section>
              <q-item-label class="report-content">{{
                report.content
              }}</q-item-label>
              <q-item-label caption class="report-date">{{
                formatDate(report.reportAt)
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <!-- 버튼들을 수평으로 정렬 -->
      <q-card-actions class="button-container">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          icon="delete"
          @click="isDelete = true"
          v-if="!isEditing"
        >
          폐기
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          icon="edit"
          @click="isEditing = true"
          v-if="!isEditing"
        >
          수정
        </q-btn>
      </q-card-actions>
    </q-card>
    <DeleteQuizConfirmation
      v-if="isDelete"
      :quiz="quiz"
      :is-delete="isDelete"
      :current-quiz="quizzes"
      :quiz-reportId="quizReportId"
      @update:isDelete="isDelete = $event"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  fetchQuiz,
  fetchQuizImage,
} from 'src/services/quiz/admin/adminQuizDetail.js';
import { fetchReoportsFromApi } from 'src/services/quiz/admin/reportedQuiz.js';
import DeleteQuizConfirmation from 'src/components/quiz/confirmation/DeleteQuizConfirmation.vue';
import { date } from 'quasar';

const quiz = '신고된 문제';

const quizzes = ref([]);
const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기
const quizReportId = ref();

// 이미지 URL 상태
const imageUrl = ref(null);

// 서버에서 퀴즈 데이터 가져오기.
const fetchQuizzes = async () => {
  try {
    const data = await fetchQuiz(quizId);
    quizzes.value = data;
    console.log('서버에서 가져온 quiz value : ', quizzes.value);
    // hasImage가 true이면 이미지를 가져옴
    if (quizzes.value.hasImage) {
      await fetchImage(); // 이미지 로드 함수 호출
    }
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

// 서버에서 이미지 가져오기
const fetchImage = async () => {
  try {
    const base64String = await fetchQuizImage(quizId);
    imageUrl.value = `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('이미지 데이터를 불러오는 데 실패했습니다.', error);
  }
};

// 신고문제된 이유들 가져오기.
const reports = ref([]);
const fetchReoports = async () => {
  try {
    reports.value = await fetchReoportsFromApi(quizId);
    console.log('신고문제 이유 :', reports.value);
    console.log('신고번호 이유 :', reports.value[0].quizReportId);
    quizReportId.value = reports.value[0].quizReportId;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

onMounted(() => {
  fetchQuizzes();
  fetchReoports();
});

//JSON 파싱.
const quizContent = computed(() => {
  if (quizzes.value && quizzes.value.jsonContent) {
    try {
      return JSON.parse(quizzes.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});
// 날짜 형식 포맷팅
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

// 퀴타입별 보여주기.(View)
const quizTypeViewForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MultipleChoiceView.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/ShortAnswerView.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MatchingView.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/TrueOrFalseView.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/FillInTheBlank.vue'),
      );
    default:
      return null;
  }
};

//퀴즈 타입별 문제 수정하기.(Edit)
const quizTypeEditForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/MultipleChoiceEdit.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/ShortAnswerEdit.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/MatchingEdit.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/TrueOrFalseEdit.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/FillInTheBlankEdit.vue'),
      );
    default:
      return null;
  }
};

// 퀴즈 수정 기능
const isEditing = ref(false); // 수정 모드 플래그

// 수정한 퀴즈 다시 update
const updateQuizContent = newContent => {
  if (quizzes.value) {
    quizzes.value.jsonContent = JSON.stringify(newContent);
  }
};

// 퀴즈 페기 확인 기능
const isDelete = ref(false);
</script>

<style scoped>
.my-card {
  max-width: 600px;
  margin: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 카드 그림자 더 강화 */
  border-radius: 12px; /* 카드 테두리 둥글게 */
}

.text-orange {
  color: orange; /* 주황색 글자 색상 */
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 14px 24px; /* 버튼 패딩을 키워서 버튼 크기를 늘림 */
  font-size: 1.1rem; /* 버튼 글자 크기를 키움 */
  width: auto;
}

.buttons-container {
  justify-content: center;
  margin-top: 20px; /* 위로 띄우기 */
  margin-bottom: 16px; /* 아래로 띄우기 */
}

.button-container {
  display: flex;
  flex-direction: row; /* 버튼을 수평으로 정렬 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 100px; /* 버튼 사이 간격 */
  padding: 0 32px; /* 양옆 마진을 카드와 동일하게 */
  margin-bottom: 20px;
}

/*신고 css */
.report-section {
  border-radius: 8px;
  padding: 16px;
}
.report-chip {
  border-color: #e53935; /* 신고 사유 칩 테두리 색상 */
  color: #e53935; /* 텍스트 색상을 일치시킴 */
  font-weight: bold; /* 텍스트를 강조 */
}
.report-item {
  margin-top: 16px; /* 항목 간격을 크게 설정 */
}
.report-item-card {
  padding: 12px;
  border: 1px solid #ddd; /* 신고된 이유 카드 테두리 */
  border-radius: 8px;
  background-color: #fff; /* 카드 배경색 */
  transition: box-shadow 0.3s ease; /* 호버 시 효과 */
}
.report-content {
  font-size: 16px; /* 신고된 내용의 크기 */
  font-weight: 500;
  color: #424242; /* 다크 그레이 텍스트 색상 */
}
.report-date {
  font-size: 12px; /* 신고된 날짜 크기 */
  color: #9e9e9e; /* 날짜는 더 연한 회색 */
}
</style>
