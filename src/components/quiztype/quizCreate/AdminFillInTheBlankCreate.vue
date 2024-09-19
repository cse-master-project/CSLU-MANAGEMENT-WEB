<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-title class="title">빈칸 채우기형</q-title>
    </div>
    <div>
      <q-card>
        <!-- 과목과 챕터 선택 -->
        <q-card-section class="select-container">
          <div class="select-subject">
            <q-label class="label-subject">과목선택</q-label>
            <q-select
              class="select-box"
              v-model="subject"
              :options="subjectOptions"
              outlined
              dense
              @update:model-value="updateDetailSubjectOptions"
            />
          </div>
          <div class="select-chapter">
            <q-label class="label-chapter">챕터선택</q-label>
            <q-select
              class="select-box"
              v-model="detailSubject"
              :options="filteredDetailSubjectOptions.slice().reverse()"
              outlined
              dense
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
            <div class="cancel-button" @click="cancelFile">X</div>
          </div>
        </q-card-section>
        <!-- 문제 입력 -->
        <q-card-section class="quiz-container">
          <q-label class="label-quiz">질문</q-label>
          <q-input
            v-model="quiz"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="문제를 입력해주세요."
            maxlength="300"
            counter
            class="input-quiz"
          /><q-icon name="help" class="help-icon1">
            <q-tooltip style="background-color: black; font-size: medium">
              빈칸 넣을 시 &lt;&lt;빈칸&gt;&gt; 작성 해주세요. <br />
              예시 : 안녕하세요. 저는 &lt;&lt;빈칸&gt;&gt;입니다.
            </q-tooltip>
          </q-icon>
        </q-card-section>
        <!-- 빈칸 입력 동적 생성 -->
        <q-card-section class="answer-container">
          <q-label class="label-answer">빈칸 답안</q-label>
          <div
            v-for="(blank, index) in blankInputs"
            :key="index"
            class="q-mb-md input-answer"
            style="display: flex; align-items: center"
          >
            <!-- 답안 입력 필드 -->
            <q-input
              v-model="blankInputs[index]"
              type="textarea"
              autogrow
              outlined
              dense
              :placeholder="`( ${index + 1} ) 의 답안을 입력해주세요.`"
              maxlength="300"
              counter
              style="flex-grow: 1"
            />
            <!-- 도움말 아이콘과 툴팁 -->
            <q-icon name="help" class="help-icon2" style="margin-left: 12px">
              <q-tooltip style="background-color: black; font-size: medium">
                "답안을 입력해주세요. 답이 여러 개일 경우 쉼표(,)로 구분하세요."
              </q-tooltip>
            </q-icon>
          </div>
        </q-card-section>
        <!-- 해설 입력 -->
        <q-card-section class="comment-container">
          <q-label class="label-quiz">해설 </q-label>
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
          <q-icon class="help-icon"></q-icon>
        </q-card-section>
        <q-card-section class="btn-container">
          <q-btn class="btn-back" @click="goBack"> 뒤로가기 </q-btn>
          <q-btn class="btn-submit" @click="submitQuiz"> 문제 등록 </q-btn>
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
import { api } from 'src/boot/axios';
import SubmitQuizSuccess from 'src/components/quiz/SubmitQuizSuccess.vue';
import useCategories from 'src/services/useCategories.js';
//반응형 데이터
const subject = ref('과목을 선택 해주세요.');
const detailSubject = ref('챕터를 선택 해주세요.');
const quiz = ref('');
const blankInputs = ref([]); // 빈칸에 대한 답안 입력 필드
const commentary = ref('');

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

// 과목,챕터 불러오기 로직
const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  useCategories();

onMounted(fetchCategories);

const filteredDetailSubjectOptions = ref([]);
// 과목 선택에 따라 챕터 옵션을 업데이트하는 함수
const updateDetailSubjectOptions = () => {
  const detailSubjects = getDetailSubjectsBySubject(subject.value);
  if (detailSubjects.length === 0) {
    filteredDetailSubjectOptions.value = ['공백'];
  } else {
    filteredDetailSubjectOptions.value = detailSubjects;
  }
};
watch(subject, () => {
  // 과목이 변경될 때마다 챕터 선택 초기화
  detailSubject.value = '챕터를 선택 해주세요.';
  updateDetailSubjectOptions();
});

// 문제에 포함된 정확히 <<빈칸>>의 개수에 맞춰 답안 입력 필드를 업데이트하는 watch
watch(quiz, newQuiz => {
  // <<빈칸>>을 정확히 감지
  const blankCount = (newQuiz.match(/<<빈칸>>/g) || []).length;
  if (blankCount > blankInputs.value.length) {
    // 빈칸 수가 많아질 경우 빈칸에 맞게 답안을 추가
    while (blankInputs.value.length < blankCount) {
      blankInputs.value.push('');
    }
  } else if (blankCount < blankInputs.value.length) {
    // 빈칸 수가 줄어들 경우 맞춰서 답안 필드를 제거
    blankInputs.value = blankInputs.value.slice(0, blankCount);
  }
});

// 답안 정리 함수(답안을 이차원 배열로 변환하는 함수)
const normalizeAnswers = blankInputs => {
  return blankInputs.map(
    blank =>
      blank
        .split(',') // 쉼표로 여러 답안 구분
        .map(part => part.trim()) // 각 답안의 공백 제거
        .filter(part => part), // 빈 값 제거
  );
};

// 서버 전송 여부
const submitQuizSuccess = ref(false);

// 서버에서 받아온 퀴즈 아이디
const quizId = ref('');

// 서버에 문제 제출
const submitQuiz = async () => {
  // <<빈칸>>이 문제에 포함되어 있는지 확인
  const blankCount = (quiz.value.match(/<<빈칸>>/g) || []).length;
  // 빈칸 답안 검증
  const normalizedAnswers = normalizeAnswers(blankInputs.value);
  const hasEmptyAnswer = normalizedAnswers.some(
    answers => answers.length === 0 || answers.every(answer => answer === ''),
  );

  // 입력값 검증
  let hasError = false;
  let errorMessage = '';

  if (subject.value === '과목을 선택 해주세요.') {
    errorMessage = '과목을 선택해 주세요.';
    hasError = true;
  } else if (detailSubject.value === '챕터를 선택 해주세요.') {
    errorMessage = '챕터를 선택해 주세요.';
    hasError = true;
  } else if (quiz.value.trim() === '') {
    errorMessage = '문제를 입력해 주세요.';
    hasError = true;
  } else if (blankCount === 0) {
    errorMessage = '문제에 최소 하나 이상의 빈칸 <<빈칸>>을 포함해야 합니다.';
    hasError = true;
  } else if (hasEmptyAnswer) {
    errorMessage = '모든 빈칸에 답을 입력해 주세요.';
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
    detailSubject: detailSubject.value,
    quizType: '5',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: normalizedAnswers,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
  try {
    // 문제 데이터 서버에 제출
    const response = await api.post('/api/quiz/default', quizData);
    quizId.value = response.data; // 서버에서 받은 문제 ID

    // 이미지가 있다면, 이미지 데이터 서버에 제출
    if (filePreview.value) {
      const imageData = {
        base64String: filePreview.value,
        quizId: quizId.value,
      };
      console.log('이미지데이터', imageData);

      await api.post('/api/quiz/image', imageData);
      console.log('이미지 추가 완료');
    }

    submitQuizSuccess.value = true;
  } catch (error) {
    if (error.response.status === 400) {
      // 이미지 전송 실패 시 에러 처리
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      // 퀴즈 등록 취소 처리 또는 이미지 전송 실패 시 퀴즈도 등록하지 않음
      await api.delete(`/api/management/quiz/${quizId.value}`); // 퀴즈 삭제 처리
      return; // 이미지 전송 실패 시 퀴즈 등록 중단
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
  width: 200px;
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
  line-height: 50px;
  border-radius: 50%;
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
.help-icon1 {
  margin: 8px 8px;
  font-size: 20px;
  color: #999;
  display: block;
}

// 답안 입력 스타일
.answer-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.label-answer {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
  margin-bottom: 10px; /* 라벨과 답안 사이 간격 */
}
.input-answer {
  width: 70%;
  margin-bottom: 10px; /* 답안 필드 간격 추가 */
}
.help-icon2 {
  margin: 8px 8px;
  font-size: 20px;
  color: #999;
  display: block;
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

.tooltip {
  background-color: #000000;
  font-size: 1.3rem;
}
</style>
