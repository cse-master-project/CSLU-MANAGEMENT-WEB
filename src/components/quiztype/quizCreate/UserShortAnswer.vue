<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-title class="title">단답형</q-title>
    </div>
    <div>
      <q-card>
        <!-- 과목과 챕터 선택 -->
        <q-card-section class="select-container">
          <div class="select-subject">
            <q-label class="label-subject">과목 선택</q-label>
            <q-select
              class="select-box"
              v-model="subject"
              :options="subjectOptions"
              outlined
              dense
              @update:model-value="updateDetailSubjectOptions"
              style="width: 200px"
            />
          </div>
          <div class="select-chapter">
            <q-label class="label-chapter">챕터 선택</q-label>
            <q-select
              class="select-box"
              v-model="detailSubject"
              :options="filteredDetailSubjectOptions"
              outlined
              dense
              style="width: 200px"
            />
          </div>
        </q-card-section>
        <!-- 이미지 업로드 -->
        <q-card-section class="imageUpload-container">
          <div>
            <label for="file">
              <div class="upload-button">+</div>
            </label>
            <input type="file" id="file" @change="fileInputHandler" />
          </div>
          <div v-if="filePreview" class="previewImage-container">
            <img :src="filePreview" alt="File Preview" class="preview-image" />
            <q-icon name="close" class="cancel-button" @click="cancelFile" />
          </div>
        </q-card-section>
        <!-- 문제 입력 -->
        <q-card-section class="quiz-container">
          <q-label class="label-quiz">문제</q-label>
          <q-input
            v-model="quiz"
            type="textarea"
            rows="3"
            outlined
            dense
            placeholder="문제를 입력하세요."
            maxlength="300"
            counter
            class="input-quiz"
          />
        </q-card-section>
        <q-card-section class="answer-container">
          <q-label class="label-answer">답안</q-label>
          <q-input
            v-model="answer"
            type="textarea"
            rows="1"
            outlined
            dense
            placeholder="답안을 입력하세요."
            maxlength="300"
            counter
            class="q-mb-md input-answer"
          />
        </q-card-section>
        <!-- 해설 입력 -->
        <q-card-section class="comment-container">
          <q-label class="label-quiz">해설 </q-label>
          <q-input
            v-model="commentary"
            type="textarea"
            rows="2"
            outlined
            placeholder="해설을 입력하세요."
            dense
            maxlength="300"
            counter
            class="input-commentary"
        /></q-card-section>
        <q-card-section class="btn-container">
          <q-btn class="btn-back" @click="goBack"> 뒤로가기 </q-btn>
          <q-btn class="btn-submit" @click="submitQuiz"> 문제 등록 </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-form>
  <!-- 문제 생성 성공 컴포넌트 -->
  <UserSubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
  />
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import { userApi } from 'src/boot/userAxios';
import UserSubmitQuizSuccess from 'src/components/quiz/UserSubmitQuizSuccess.vue';
import userUseCategories from 'src/services/userUseCategories.js';

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

const cancelFile = () => {
  filePreview.value = null;
  fileName.value = ''; // 파일 이름 초기화
  document.getElementById('file').value = ''; // 파일 입력 초기화
};

const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userUseCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const answer = ref('');
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

// 서버에 문제 제출.
const submitQuiz = () => {
  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '2',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: answer.value,
      commentary: commentary.value,
    }),
    hasImage: false,
  };
  console.log('서버에 제출될 데이터:', quizData);
  userApi
    .post('/api/quiz/user', quizData)
    .then(response => {
      // console.log('서버 응답:', response.data);
      submitQuizSuccess.value = true;
    })
    .catch(error => {
      //console.error('서버 응답 오류:', error);
      if (error.response.status === 400) {
        // 예: 사용자에게 문제가 부족하거나 잘못된 데이터를 입력했다고 알림
        alert(
          '입력된 데이터가 부족하거나 잘못되었습니다. 빈칸이 없는지 확인해주세요 ^_^',
        );
      } else if (error.response.status === 500) {
        // 예: 서버 측에서 처리 중 오류 발생
        alert(
          '서버에서 문제를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        );
      } else {
        // 기타 다른 오류 상황에 대한 처리
        alert('문제 등록 중 예상치 못한 오류가 발생했습니다.');
      }
      // 실패 시 사용자 경험을 개선할 수 있는 추가적인 로직 추가
    });
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
  margin-right: 10px;
}
.select-chapter {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-left: 10px;
}
.label-subject,
.label-chapter {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.select-box {
  max-width: 400px;
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
  width: 50px;
  height: 50px;
  background-color: #42a5f5;
  color: white;
  font-size: 2rem;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.5s ease-in-out;
}
//회전 애니메이션
.upload-button:hover {
  transform: rotate(360deg);
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
  cursor: pointer;
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

// 답안 입력 스타일
.answer-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.label-answer {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.input-answer {
  width: 70%;
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
  color: black;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.71429;
  height: 40px;
  font-family: 'Toss Product Sans';
  box-shadow: rgba(39, 40, 40, 0.24) 0px 8px 16px 0px;
}
.btn-submit {
  background-color: rgb(0, 154, 233);
  color: white;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.71429;
  height: 40px;
  font-family: 'Toss Product Sans';
  box-shadow: rgba(0, 154, 233, 0.24) 0px 8px 16px 0px;
}
</style>
