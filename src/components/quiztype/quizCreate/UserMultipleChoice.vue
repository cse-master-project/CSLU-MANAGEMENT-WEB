<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-toolbar-title class="title"
        >4지선다형
        <div class="guidecontainer">
          <img src="/guide.png" alt="guide" style="width: 40px; height: auto" />
          <q-tooltip
            style="
              font-size: 1rem;
              width: 500px;
              background: #ebf0f1;
              color: black;
            "
            >문제 작성 가이드:<br />
            1. <span class="span">*챕터</span>와
            <span class="span">*과목</span>을 선택하세요.<br />
            2. <span class="span">*문제</span>를 입력하세요.<br />
            3. <span class="span">*4개의 지문</span>을 입력하세요.<br />
            4. 입력한 답안 중 하나의 <span class="span">*정답</span>을
            선택하세요.<br />
            5.<span class="span">*해설</span>을 입력한 후, "문제 등록" 버튼을
            클릭하세요.<br />
            6. 이미지가 있을 경우, <span class="span">JPG/JPEG</span> 파일만
            첨부 가능합니다.</q-tooltip
          >
        </div></q-toolbar-title
      >
    </div>
    <div>
      <q-card>
        <!-- 과목과 챕터 선택 -->
        <q-card-section class="select-container">
          <div class="select-subject">
            <label class="label-subject">과목 선택</label>
            <q-select
              class="select-box"
              v-model="subject"
              :options="subjectOptions.map(s => s.subject)"
              outlined
              dense
            />
          </div>
          <div class="select-chapter">
            <label class="label-chapter">챕터 선택</label>
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
                <img src="/addimg.png" alt="Upload Image" />
              </div>
            </label>
            <input type="file" id="file" @change="fileInputHandler" />
          </div>
          <div v-if="filePreview" class="previewImage-container">
            <img :src="filePreview" alt="File Preview" class="preview-image" />
            <div class="cancel-button" @click="cancelFile">
              <q-icon name="close" />
            </div>
          </div>
        </q-card-section>

        <!-- 문제 입력 -->
        <q-card-section class="quiz-container">
          <label class="label-quiz">문제</label>
          <q-input
            v-model="quiz"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="문제를 입력하세요"
            maxlength="400"
            counter
            class="input-quiz"
          />
        </q-card-section>
        <!-- 보기 입력 및 정답 선택 -->
        <q-card-section>
          <div
            v-for="(choice, index) in option"
            :key="`choice-${index}`"
            class="choices-container"
          >
            <q-radio
              v-model="selectedAnswer"
              :val="index"
              name="answer"
              class="q-mb-md"
            />
            <q-input
              v-model="choice.label"
              type="textarea"
              outlined
              dense
              maxlength="100"
              autogrow
              counter
              class="q-mb-md input-choices"
              placeholder="지문을 입력하세요"
            />
          </div>
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
            maxlength="400"
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
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  submitQuiz,
  submitQuizImage,
  submitQuizImageTemp,
} from 'src/services/quiz/user/userQuiz.js';
import { useCategorieUser } from 'src/services/quiz/user/useCategorieUser.js';
import {
  quizSuccessNotification,
  quizErrorNotification,
  errorNotification,
} from 'src/services/quiz/notifications.js';

// 반응형 데이터
const subject = ref('과목을 선택 해주세요.');
const chapter = ref('챕터를 선택 해주세요.');
const quiz = ref('');
const option = ref([
  { label: '', value: '1' },
  { label: '', value: '2' },
  { label: '', value: '3' },
  { label: '', value: '4' },
]);
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
} = useCategorieUser();
onMounted(fetchSubjects);
watch(subject, newSubject => {
  if (newSubject) {
    selectSubject(newSubject);
    chapter.value = '챕터를 선택 해주세요.';
  }
});

// 서버에서 받아온 퀴즈 아이디
const quizId = ref('');

const router = useRouter();

// 서버에 문제 제출.
const submitQuizForm = async () => {
  // 입력값 검증
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
  } else if (option.value.some(choice => choice.label.trim() === '')) {
    errorMessage = '모든 지문을 입력해 주세요.';
    hasError = true;
  } else if (selectedAnswer.value === null) {
    errorMessage = '정답을 선택해 주세요.';
    hasError = true;
  } else if (commentary.value.trim() === '') {
    errorMessage = '해설을 입력해 주세요.';
    hasError = true;
  }
  if (hasError) {
    alert(errorMessage);
    return; // 입력값이 유효하지 않으면 서버 요청을 중단합니다.
  }
  const confirmation = confirm('문제를 등록하시겠습니까? ');
  if (!confirmation) {
    return;
  }
  try {
    //서버에 제출될 데이터
    const quizData = {
      subject: subject.value,
      chapter: chapter.value,
      quizType: '1',
      jsonContent: JSON.stringify({
        quiz: quiz.value,
        option: option.value.map(choice => choice.label),
        answer: selectedAnswer.value + 1, // 선택된 답의 인덱스를 +1 해서 서버에 보냄
        commentary: commentary.value,
      }),
      hasImage: !!filePreview.value,
    };
    //console.log('서버에 제출될 데이터:', quizData);
    try {
      // 이미지가 있는 경우
      if (filePreview.value) {
        // 이미지 임시로 제출
        const uuid = await submitQuizImageTemp(filePreview.value);
        // 이미지 오류 처리
        if (!uuid) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        quizId.value = await submitQuiz(quizData);
        // console.log(quizId.value);

        // 이미지 진짜 제출
        await submitQuizImage(quizId.value, uuid);

        // 성공
        quizSuccessNotification();
        router.push(`/userQuizzes/${quizId.value}`);
      } else {
        // 이미지 없을 시 바로 제출
        quizId.value = await submitQuiz(quizData);
        // 성공
        quizSuccessNotification();
        router.push(`/userQuizzes/${quizId.value}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        quizErrorNotification();
      } else {
        errorNotification();
      }
    }
  } catch (error) {
    errorNotification();
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
//가이드 스타일
.guidecontainer {
  display: flex;
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  width: 60px;
  height: 60px;
  background-color: #ebf0f1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 1%;
}
.span {
  color: red;
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
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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

//4지선다형 입력 스타일
.choices-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.input-choices {
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
@media (max-width: 700px) {
  .select-container {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .form-container {
    padding: 10px 10px;
  }
}
@media (max-width: 1100px) {
  .form-container {
    margin: 0 3%;
  }
}
</style>
