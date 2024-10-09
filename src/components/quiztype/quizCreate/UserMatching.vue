<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-toolbar-title class="title"
        >선긋기형
        <div class="guidecontainer">
          <img src="/guide.png" alt="guide" style="width: 40px; height: auto" />
          <q-tooltip
            style="
              font-size: 1rem;
              width: 300px;
              background: #ebf0f1;
              color: black;
            "
            >문제를 작성한 후, 왼쪽과 오른쪽 지문을 각각 입력하세요. 왼쪽 지문에
            색상을 선택하여 오른쪽 지문과 매칭하세요. 해설을 입력한 후 "문제
            등록" 버튼을 클릭하세요.</q-tooltip
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
            maxlength="300"
            counter
            class="input-quiz"
          />
        </q-card-section>

        <!-- 왼쪽 그룹 옵션 입력 -->
        <q-card-section>
          <div class="options-container">
            <div class="option-left">
              <div class="reset-container">
                <q-btn class="btn-reset" @click="resetColors">초기화</q-btn>
                <q-icon name="help" class="help-icon1">
                  <q-tooltip
                    anchor="top right"
                    self="top left"
                    style="background-color: black; font-size: medium"
                  >
                    왼쪽 지문, 오른쪽 지문 입력시 답안을 색으로 매칭 시켜주세요.
                  </q-tooltip>
                </q-icon>
              </div>
              <div
                class="btn-select"
                v-for="(option, index) in leftOptions"
                :key="index"
              >
                <q-btn
                  class="btn-select"
                  :style="{ backgroundColor: 'yellow' }"
                  :disabled="isColorDisabled('yellow', index)"
                  @click="selectOption('yellow', index)"
                  >1</q-btn
                >
                <q-btn
                  class="btn-select"
                  :style="{ backgroundColor: 'yellowgreen' }"
                  :disabled="isColorDisabled('yellowgreen', index)"
                  @click="selectOption('yellowgreen', index)"
                  >2</q-btn
                >
                <q-btn
                  class="btn-select"
                  :style="{ backgroundColor: 'orange' }"
                  :disabled="isColorDisabled('orange', index)"
                  @click="selectOption('orange', index)"
                  >3</q-btn
                >
                <q-input
                  v-model="leftOptions[index]"
                  outlined
                  class="input-left"
                  :style="{ backgroundColor: leftOptionsBgColor[index] }"
                />
              </div>
            </div>
            <!-- 오른쪽 그룹 옵션 입력 -->
            <div class="option-right">
              <div
                v-for="(color, index) in ['yellow', 'yellowgreen', 'orange']"
                :key="index"
              >
                <q-input
                  v-model="rightOptions[index]"
                  outlined
                  :style="{ backgroundColor: color }"
                  class="input-right"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- 해설 입력 -->
        <q-card-section class="comment-container">
          <label class="label-quiz">해설</label>
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
          />
        </q-card-section>
        <!-- 버튼 및 색상 선택 초기화 버튼 -->
        <q-card-section class="btn-container">
          <q-btn class="btn-back" @click="goBack"> 뒤로가기 </q-btn>

          <q-btn class="btn-submit" @click="submitQuizForm"> 문제 등록 </q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-form>
  <!-- 문제 생성 성공 컴포넌트 -->
  <UserSubmitQuizSuccess
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
  deleteQuiz,
} from 'src/services/quiz/userQuiz.js';
import UserSubmitQuizSuccess from 'src/components/quiz/UserSubmitQuizSuccess.vue';
import { useCategorieUser } from 'src/services/quiz/useCategorieUser.js';
// 반응형 데이터
const subject = ref('과목을 선택 해주세요.');
const chapter = ref('챕터를 선택 해주세요.');
const quiz = ref('');
const answers = ref(['', '', '']);
const leftOptions = ref(['', '', '']);
const rightOptions = ref(['', '', '']);
const commentary = ref('');
const leftOptionsBgColor = ref(['', '', '']); // 각 옵션의 배경색을 저장

// 퀴즈 유형 바꾸는 로직 (뒤로가기)
const emits = defineEmits(['change-quiz-type']);
const goBack = () => {
  emits('change-quiz-type', '');
};

//이미지 업로드 로직
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
    chapter.value = '챕터를 선택 해주세요.'; // 과목 변경 시 챕터 초기화
  }
});

const selectOption = (color, index) => {
  if (
    leftOptionsBgColor.value.includes(color) &&
    leftOptionsBgColor.value[index] !== color
  ) {
    alert(`색상 ${color}는 이미 선택된 상태입니다.`);
    return;
  }
  leftOptionsBgColor.value[index] = color; // 선택한 색상으로 입력 필드 배경색 업데이트
  updateMatchingOptions(index, color); // 매칭된 색상 업데이트
};

// 왼쪽 옵션 및 색상 매칭 업데이트
const updateMatchingOptions = (index, color) => {
  const colorIndex = ['yellow', 'yellowgreen', 'orange'].indexOf(color);
  if (colorIndex >= 0) {
    answers.value[index] = `${index}t${colorIndex}`;
    console.log(answers.value);
  }
};

// 왼쪽 옵션 변경 시 자동으로 매칭 업데이트
watch(
  leftOptions,
  newLeftOptions => {
    leftOptionsBgColor.value.forEach((color, index) => {
      if (color) {
        updateMatchingOptions(index, color);
      }
    });
  },
  { deep: true },
);

// 오른쪽 옵션 변경 시 자동으로 매칭 업데이트
watch(
  rightOptions,
  newRightOptions => {
    leftOptionsBgColor.value.forEach((color, index) => {
      if (color) {
        updateMatchingOptions(index, color);
      }
    });
  },
  { deep: true },
);

const isColorDisabled = (color, index) => {
  return leftOptionsBgColor.value.some(
    (bgColor, i) => bgColor === color && i !== index,
  );
};

const resetColors = () => {
  leftOptionsBgColor.value = ['', '', '']; // 색상 초기화
};

// 서버 전송 여부
const submitQuizSuccess = ref(false);

// 서버에서 받아온 퀴즈 아이디
const quizId = ref('');

// 서버에 문제 제출
const submitQuizForm = async () => {
  // 답안 정리
  const formattedAnswers = answers.value.map(answer => {
    return answer;
  });
  console.log('answers', formattedAnswers);

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
  } else if (leftOptions.value.some(option => option.trim() === '')) {
    errorMessage = '왼쪽 옵션을 모두 입력해 주세요.';
    hasError = true;
  } else if (rightOptions.value.some(option => option.trim() === '')) {
    errorMessage = '오른쪽 옵션을 모두 입력해 주세요.';
    hasError = true;
  } else if (
    answers.value.length === 0 ||
    answers.value.some(answer => answer.trim() === '')
  ) {
    errorMessage = '답을 매칭해 주세요.';
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
    quizType: '3',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      left_option: leftOptions.value,
      right_option: rightOptions.value,
      answer: formattedAnswers,
      commentary: commentary.value,
    }),
    hasImage: !!filePreview.value,
  };

  //console.log('서버에 제출될 데이터:', quizData);
  try {
    // 문제 데이터 서버에 제출후 반환된 퀴즈 ID 저장.
    quizId.value = await submitQuiz(quizData);

    // 이미지가 있다면 이미지 서버에 제출
    if (filePreview.value) {
      await submitQuizImage(quizId.value, filePreview.value);
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
// .upload-button {
//   width: 50px;
//   height: 50px;
//   background-color: #42a5f5;
//   color: white;
//   font-size: 2rem;
//   text-align: center;
//   line-height: 50px;
//   border-radius: 50%;
// }
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

//옵션 스타일
.options-container {
  display: flex;
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.reset-container {
  display: flex;
  align-items: center; /* 수직으로 중앙 정렬 */
  margin-bottom: 10px;
}

.btn-reset {
  background-color: #90bee4;
  color: white;
  font-size: 1rem;
  padding: 8px 16px; /* 버튼 패딩 */
  border-radius: 10px; /* 둥근 버튼 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  margin-right: 10px; /* 아이콘과의 간격 */
  transition: background-color 0.3s ease; /* 호버 시 애니메이션 */

  &:hover {
    background-color: #1e88e5;
  }
}
.help-icon1 {
  font-size: 20px;
  color: #999;
}

.tooltip {
  background-color: #000000;
  font-size: 1.3rem;
}

.btn-select {
  margin-bottom: 10px;
}
//왼쪽 입력 스타일
.option-left {
  display: flex;
  flex-direction: column;
}
//오른쪽 입력 스타일
.option-right {
  display: flex;
  flex-direction: column;
}
.input-left {
  width: 200px;
  display: flex;
}
.input-right {
  width: 200px;
  display: flex;
  margin-top: 80px;
}

//답안 입력 스타일

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
@media (max-width: 430px) {
  .select-container {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  .title-container {
    margin-left: 5%;
  }
}
</style>
