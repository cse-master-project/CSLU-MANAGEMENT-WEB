<template>
  <q-form class="q-pa-md form-container">
    <div class="title-container">
      <q-title class="title">O/X형</q-title>
    </div>
    <q-card>
      <q-card-section class="cs">
        <!-- 과목과 챕터 수평 배치 -->
        <div class="horizontal-select">
          <!-- 대분류 선택 -->
          <div class="select-container">
            <q-label>과목선택<span class="required"></span></q-label>
            <q-select
              v-model="subject"
              :options="subjectOptions"
              outlined
              dense
              class="q-mb-md"
              @update:model-value="updateDetailSubjectOptions"
            />
          </div>
          <!-- 소분류 선택 -->
          <div class="select-container">
            <q-label>챕터선택<span class="required"></span></q-label>
            <q-select
              v-model="detailSubject"
              :options="filteredDetailSubjectOptions"
              outlined
              dense
              class="q-mb-md"
            />
          </div>
        </div>
        <!-- 문제 입력 -->
        <q-label>Q. <span class="required">*</span></q-label>
        <q-input
          v-model="quiz"
          type="textarea"
          rows="3"
          outlined
          dense
          placeholder="문제를 입력하세요"
          maxlength="100"
          counter
          class="q-mb-md"
        />
        <!-- O/X 선택 -->
        <q-option-group
          v-model="selectedAnswer"
          :options="options"
          class="q-mb-md large-option-group"
        />
        <!-- 해설 입력 -->
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력하세요"
          outlined
          dense
          autogrow
          class="q-mb-md"
        />
      </q-card-section>
      <q-card-section class="cs">
        <!-- 파일 첨부 섹션 -->
        <section class="container">
          <label for="file">
            <div class="styled-file-input">
              <div class="attachment-button">🔗 FILE UPLOAD</div>
              <p v-if="fileName" class="attached-file">{{ fileName }}</p>
            </div>
          </label>
          <input type="file" id="file" @change="fileInputHandler" />
          <!-- 이미지 미리보기 -->
          <div v-if="filePreview" class="file-preview">
            <img :src="filePreview" alt="File Preview" class="preview-image" />
          </div>
        </section>
      </q-card-section>
      <!-- 액션 버튼 섹션 -->
      <q-card-actions align="right" class="cs">
        <q-btn
          class="backbtn"
          color="secondary"
          outline
          @click="goBack"
          style="width: 10%; margin: 3% 1%"
        >
          뒤로가기
        </q-btn>
        <q-btn
          class="registerbtn"
          color="primary"
          @click="submitQuiz"
          style="width: 10%; margin: 3% 0"
        >
          문제 등록
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
  <!-- SubmitQuizSuccess 컴포넌트 -->
  <SubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import SubmitQuizSuccess from 'src/components/quiz/SubmitQuizSuccess.vue';
import useCategories from 'src/services/useCategories.js';

const emits = defineEmits(['change-quiz-type']);

const goBack = () => {
  emits('change-quiz-type', '');
};

const fileName = ref('');
const filePreview = ref(null); // 이미지 미리보기 URL

const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = files[0].name;

    // 파일 타입이 이미지인지 확인
    if (files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        filePreview.value = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    } else {
      alert('이미지 파일만 선택할 수 있습니다.');
      filePreview.value = null; // 파일 미리보기 초기화
    }
  }
};

const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();

onMounted(fetchCategories);

const options = [
  { label: 'O', value: 1 },
  { label: 'X', value: 0 },
];
const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const selectedAnswer = ref(null);
const commentary = ref('');

const filteredDetailSubjectOptions = ref([]);

// 대분류 선택에 따라 소분류 옵션을 업데이트하는 함수
const updateDetailSubjectOptions = () => {
  filteredDetailSubjectOptions.value = getDetailSubjectsBySubject(
    subject.value,
  );
};

watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

const submitQuizSuccess = ref(false);

const submitQuiz = () => {
  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '4',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: selectedAnswer.value,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
  api
    .post('/api/quiz/default', quizData)
    .then(response => {
      submitQuizSuccess.value = true;
    })
    .catch(error => {
      if (error.response.status === 400) {
        alert(
          '입력된 데이터가 부족하거나 잘못되었습니다. 빈칸이 없는지 확인해주세요 ^_^',
        );
      } else if (error.response.status === 500) {
        alert(
          '서버에서 문제를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        );
      } else {
        alert('문제 등록 중 예상치 못한 오류가 발생했습니다.');
      }
    });
};
</script>

<style scoped lang="scss">
/* 폼 컨테이너 스타일 - 최대 너비 800px, 중앙 정렬 */
.form-container {
  max-width: 800px;
  margin: auto;
}

/* 제목 컨테이너 스타일 - 중앙 정렬, 아래쪽 여백 */
.title-container {
  text-align: center;
  margin-bottom: 20px;
}

/* 제목 스타일 - 글씨 크기, 색상 */
.title {
  font-size: 1.5rem;
  color: #2c3e50;
}

/* 공통 라벨 스타일 - 굵은 글씨, 위쪽 여백 */
.q-label {
  font-weight: bold;
  margin-top: 15px;
}

/* 선택 항목 컨테이너 스타일 - 아래쪽 여백 */
.choice-container {
  margin-bottom: 10px;
}

/* 파일 입력 스타일 - Flexbox로 정렬, 커서 포인터 */
.styled-file-input {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 파일 업로드 버튼 스타일 - 배경색, 글자색, 패딩, 둥근 모서리, 오른쪽 여백 */
.attachment-button {
  background-color: #42a5f5;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}

/* 첨부된 파일 이름 스타일 - 왼쪽 여백 */
.attached-file {
  margin-left: 10px;
}

/* 버튼 스타일 - 굵은 글씨 */
.backbtn,
.registerbtn {
  font-weight: bold;
}

/* 과목과 챕터를 중앙 정렬하는 컨테이너 스타일 */
.horizontal-select {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}

/* 각 선택 항목 컨테이너 스타일 - Flexbox로 정렬, 수직 중앙 정렬, 오른쪽 여백 */
.select-container {
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  margin-right: 10px; /* 오른쪽 여백 */
}

/* 마지막 선택 항목 컨테이너 스타일 - 오른쪽 여백 제거 */
.select-container:last-child {
  margin-right: 0; /* 오른쪽 여백 제거 */
}

/* 라벨과 선택 항목 간의 간격 조정 */
.select-container q-label {
  margin-right: 12px; /* 오른쪽 여백 */
}

/* O/X 선택 그룹 스타일 - 큰 라디오 버튼 */
.large-option-group .q-radio__inner {
  width: 2rem;
  height: 2rem;
}

/* O/X 선택 그룹 라벨 스타일 - 큰 글씨 */
.large-option-group .q-radio__label {
  font-size: 1.2rem;
}

/* 카드 스타일 - 둥근 모서리, 그림자 */
.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 파일 미리보기 스타일 */
.file-preview {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 가운데 정렬 */
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
