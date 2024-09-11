<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-title class="title">선긋기형</q-title>
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
              :options="filteredDetailSubjectOptions.slice().reverse()"
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
            autogrow
            outlined
            dense
            placeholder="문제를 입력하세요."
            maxlength="300"
            counter
            class="input-quiz"
          />
        </q-card-section>

        <!-- 왼쪽 그룹 옵션 입력 -->
        <q-card-section>
          <div v-if="showHelp" class="help">
            -> 왼쪽지문 입력, 오른쪽 지문 입력 후 색에 맞게 매칭 시켜주세요.
            (순서 중요)
          </div>
          <div class="options-container">
            <div class="option-left">
              <div>
                <q-btn class="btn-reset" @click="resetColors">초기화</q-btn>
                <q-btn class="btn-help" @click="toggleHelp">help</q-btn>
                <!-- 도움말 텍스트 -->
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
          <q-label class="label-quiz">해설</q-label>
          <q-input
            v-model="commentary"
            type="textarea"
            autogrow
            outlined
            placeholder="해설을 입력하세요."
            dense
            maxlength="300"
            counter
            class="input-commentary"
          />
        </q-card-section>
        <!-- 버튼 및 색상 선택 초기화 버튼 -->
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

// useCategories에서 가져오는 데이터와 상태 변수들
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userUseCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const answers = ref(['', '', '']);
const leftOptions = ref(['', '', '']);
const rightOptions = ref(['', '', '']);
const commentary = ref('');

const filteredDetailSubjectOptions = ref([]);
const leftOptionsBgColor = ref(['', '', '']); // 각 옵션의 배경색을 저장

watch(subject, () => {
  detailSubject.value = '';
  updateDetailSubjectOptions();
});

const updateDetailSubjectOptions = () => {
  const detailSubjects = getDetailSubjectsBySubject(subject.value);
  if (detailSubjects.length === 0) {
    filteredDetailSubjectOptions.value = ['공백'];
  } else {
    filteredDetailSubjectOptions.value = detailSubjects;
  }
};

const showHelp = ref(false);

const toggleHelp = () => {
  showHelp.value = !showHelp.value;
};

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

const updateMatchingOptions = (index, color) => {
  // 색상 배열에서 색상 인덱스를 가져옵니다.
  const colorIndex = ['yellow', 'yellowgreen', 'orange'].indexOf(color);
  if (colorIndex >= 0) {
    // 콘솔 로그로 왼쪽 및 오른쪽 옵션과 매칭 결과를 확인합니다.
    // console.log('왼쪽답', leftOptions.value[index]);
    // console.log('오른쪽답', rightOptions.value[colorIndex]);
    // console.log(
    //   `${leftOptions.value[index]}t${rightOptions.value[colorIndex]}`,
    // );

    // answers 배열에 매칭 결과를 추가합니다.
    answers.value[
      index
    ] = `${leftOptions.value[index]}t${rightOptions.value[colorIndex]}`;
    console.log(answers.value);
  }
};

const isColorDisabled = (color, index) => {
  // 이미 선택된 색상인지 확인
  return leftOptionsBgColor.value.some(
    (bgColor, i) => bgColor === color && i !== index,
  );
};

const resetColors = () => {
  leftOptionsBgColor.value = ['', '', '']; // 색상 초기화
};

const submitQuizSuccess = ref(false);

const submitQuiz = () => {
  // answers 배열을 'ㅇtㅇ' 형식으로 변환
  const formattedAnswers = answers.value.map(answer => {
    // 여기에 필요한 변환 로직이 있을 경우 추가
    return answer;
  });
  console.log('answers', formattedAnswers);

  const quizData = {
    subject: subject.value,
    detailSubject: detailSubject.value,
    quizType: '3',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      left_option: leftOptions.value,
      right_option: rightOptions.value,
      answer: formattedAnswers, // 변환된 answers 배열 사용
      commentary: commentary.value,
    }),
    hasImage: false,
  };

  console.log('서버에 제출될 데이터:', quizData);
  userApi
    .post('/api/quiz/user', quizData)
    .then(response => {
      submitQuizSuccess.value = true;
      console.log('문제 등록 성공:', response.data);
    })
    .catch(error => {
      console.error('문제 등록 오류:', error);
      if (error.response && error.response.status === 400) {
        alert('문제 등록에 실패했습니다. 입력값을 확인해 주세요.');
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

//옵션 스타일
.options-container {
  display: flex;
  justify-content: space-evenly; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}
.btn-reset {
  width: 80px;
  align-items: center;

  margin-bottom: 10px;
  background-color: #42a5f5;
  color: white;
  font-size: 1rem;
  text-align: center;
}
.btn-help {
  width: 80px;
  align-items: center;
  margin-left: 5px;
  margin-bottom: 10px;
  background-color: #42a5f5;
  color: white;
  font-size: 1rem;
  text-align: center;
}
.help {
  font-size: 1.1rem;
  color: #ff0000;
  margin-left: 110px;
  margin-bottom: 20px;
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
</style>
