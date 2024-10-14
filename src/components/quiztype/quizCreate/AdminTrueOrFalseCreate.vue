<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-toolbar-title class="title">o/x형</q-toolbar-title>
    </div>
    <div>
      <q-card>
        <!-- 과목과 챕터 선택 -->
        <q-card-section class="select-container">
          <div class="select-subject">
            <label class="label-subject">과목선택</label>
            <q-select
              class="select-box"
              v-model="subject"
              :options="subjectOptions.map(s => s.subject)"
              outlined
              dense
            />
          </div>
          <div class="select-chapter">
            <label class="label-chapter">챕터선택</label>
            <q-select
              class="select-box"
              v-model="chapter"
              :options="chapterOptions"
              outlined
              dense
            />
          </div>
        </q-card-section>

        <!-- 이미지 업로드 -->
        <q-card-section class="imageUpload-container">
          <div>
            <label for="file">
              <div class="upload-button">
                <img src="/add-image.png" alt="Upload Image" />
              </div>
            </label>
            <input type="file" id="file" @change="fileInputHandler" />
          </div>
          <div v-if="filePreview" class="previewImage-container">
            <img :src="filePreview" alt="File Preview" class="preview-image" />
            <div class="cancel-button" @click="cancelFile">X</div>
          </div>
        </q-card-section>

        <!-- 문제 입력 -->
        <q-card-section class="quiz-container">
          <label class="label-quiz">질문</label>
          <q-input
            v-model="quiz"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="문제를 입력하세요"
            maxlength="300"
            counter
            class="input-quiz"
          />
        </q-card-section>

        <!-- o/x 고르기 -->
        <q-card-section class="option-container">
          <q-option-group
            v-model="selectedAnswer"
            :options="options"
            class="q-mb-md large-option-group"
          />
        </q-card-section>

        <!-- 해설 입력 -->
        <q-card-section class="comment-container">
          <label class="label-quiz">해설 </label>
          <q-input
            v-model="commentary"
            type="textarea"
            autogrow
            outlined
            placeholder="해설을 입력하세요"
            dense
            maxlength="300"
            counter
            class="input-commentary"
        /></q-card-section>
        <q-card-section class="btn-container">
          <q-btn class="btn-back" @click="goBack"> 뒤로가기 </q-btn>
          <q-btn class="btn-submit" @click="submitQuizForm"> 문제 등록 </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-form>
  <!-- 문제 생성 성공 컴포넌트 -->
  <SubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
    :quiz-id="quizId"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  submitQuiz,
  submitQuizImage,
  submitQuizImageTemp,
  deleteQuiz,
} from 'src/services/quiz/adminQuiz.js';
import SubmitQuizSuccess from 'src/components/quiz/SubmitQuizSuccess.vue';
import { useCategorie } from 'src/services/quiz/useCategorie.js';

// 반응형 데이터
const options = [
  { label: 'O', value: 1 },
  { label: 'X', value: 0 },
];
const subject = ref('과목을 선택 해주세요.');
const chapter = ref('챕터를 선택 해주세요.');
const quiz = ref('');
const selectedAnswer = ref(null);
const commentary = ref('');

// 퀴즈 유형 바꾸는 로직 (뒤로가기)
const emits = defineEmits(['change-quiz-type']);
const goBack = () => {
  emits('change-quiz-type', '');
};

//이미지 업로드 로직
const fileName = ref('');
const filePreview = ref(null); // 이미지 미리보기 URL
//이미지 업로드 로직
const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = files[0].name;
    const fileType = files[0].type;
    // 파일 타입이 JPG 또는 JPEG 인지 확인
    if (fileType === 'image/jpeg') {
      const reader = new FileReader();
      reader.onload = e => {
        filePreview.value = e.target.result;
      };
      reader.readAsDataURL(files[0]);
    } else {
      alert('JPG 파일만 선택할 수 있습니다.');
      filePreview.value = null; // 파일 미리보기 초기화
      document.getElementById('file').value = ''; // 파일 입력 초기화
    }
  }
};
//이미지 업로드 취소 로직
const cancelFile = () => {
  filePreview.value = null;
  fileName.value = ''; // 파일 이름 초기화
  document.getElementById('file').value = ''; // 파일 입력 초기화
};

// 과목, 챕터 불러오기 로직
const {
  subjectOptions,
  chapterOptions,
  fetchSubjects,
  selectSubject,
  fetchChapters,
} = useCategorie();
onMounted(fetchSubjects);
watch(subject, newSubject => {
  if (newSubject) {
    selectSubject(newSubject);
    chapter.value = ''; // 과목 변경 시 챕터 초기화
  }
});

// 서버 전송 여부
const submitQuizSuccess = ref(false);

// 서버에서 받아온 퀴즈 아이디
const quizId = ref('');

// 서버에 문제 제출
const submitQuizForm = async () => {
  //입력값 검증
  let hasError = false;
  let errorMessage = '';

  if (subject.value === '과목을 선택 해주세요.') {
    errorMessage = '과목을 선택해 주세요.';
    hasError = true;
  } else if (chapter.value === '챕터를 선택 해주세요.') {
    errorMessage = '챕터를 선택해 주세요.';
    hasError = true;
  } else if (quiz.value.trim() === '') {
    errorMessage = '문제를 입력해 주세요.';
    hasError = true;
  } else if (selectedAnswer.value === null) {
    errorMessage = '답을 골라 주세요.';
    hasError = true;
  } else if (commentary.value.trim() === '') {
    errorMessage = '해설을 입력해 주세요.';
    hasError = true;
  }

  if (hasError) {
    alert(errorMessage);
    return; // 오류가 있을 경우 제출을 중단합니다.
  }

  //서버에 보낼 퀴즈 데이터
  const quizData = {
    subject: subject.value,
    chapter: chapter.value,
    quizType: '4',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: selectedAnswer.value,
      commentary: commentary.value,
    }),
    hasImage: !!filePreview.value,
  };
  console.log('서버에 제출될 데이터:', quizData);
  try {
    // 문제 데이터 서버에 제출후 반환된 퀴즈 ID 저장.
    quizId.value = await submitQuiz(quizData);

    // 이미지가 있다면
    if (filePreview.value) {
      //이미지 서버에  임시 제출
      const uuid = await submitQuizImageTemp(filePreview.value);
      //이미지 서버에 제출
      await submitQuizImage(quizId.value, uuid);
    }

    submitQuizSuccess.value = true; // 퀴즈 제출 성공
  } catch (error) {
    if (error.response?.status === 400) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      await deleteQuiz(quizId.value); // 퀴즈 삭제 처리
    }
  }
};
</script>

<style scoped lang="scss">
// 폼 컨테이너 스타일
.form-container {
  max-width: 1080px;
  margin: 3% auto;
}

// 카드 스타일 - 둥근 모서리, 그림자
.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

// 퀴즈유형 타이틀 스타일
.title-container {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
}
.title {
  font-size: 2rem;
  color: #0080ff;
}

// 과목 챕터 선택 스타일
.select-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  justify-content: space-evenly;
  align-items: baseline; /* 수직 중앙 정렬 */
  margin-bottom: 5px;
}
.select-subject {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.select-chapter {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.label-subject,
.label-chapter {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.select-box {
  width: 220px;
}

//이미지 업로드 스타일
.imageUpload-container {
  display: flex;
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-bottom: 10px;
}
input[type='file'] {
  /* 파일 입력 숨기기 */
  display: none;
}
/* 파일 업로드 버튼 스타일 - Flexbox로 정렬, 중앙 정렬, 커서 포인터 */
.file-upload-label {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
/* 파일 업로드 버튼 스타일 - 원형, 크기, 배경색, 글자색, 중앙 정렬 */
.upload-button {
  width: 80px;
  height: 80px;
  background-color: #42a5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
}

.upload-button img {
  max-width: 60%;
  max-height: 60%;
}
/* 파일 미리보기 스타일 */
.previewImage-container {
  margin-top: 10px;
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 가운데 정렬 */
}
/* 미리보기 이미지 스타일 */
.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 10px; /* 취소 버튼과의 간격 */
}
/* 취소 버튼 스타일 */
.cancel-button {
  width: 50px;
  height: 50px;
  background-color: #ff002f;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
}

// 문제 입력 스타일
.quiz-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.label-quiz {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.input-quiz {
  width: 70%;
}

// o/x 입력 스타일
.option-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}

// 해설 입력 스타일
.comment-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.input-commentary {
  width: 70%;
}

// 버튼 스타일
.btn-container {
  display: flex;
  justify-content: end; /* 중앙 정렬 */
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.btn-back {
  background-color: rgb(213, 213, 213);
}
.btn-submit {
  background-color: primary;
}
@media (max-width: 430px) {
  .select-container {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
}
</style>
