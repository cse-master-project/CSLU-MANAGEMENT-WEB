<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-toolbar-title class="title">빈칸 채우기형</q-toolbar-title>
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
          <label class="label-quiz">질문</label>
          <q-input
            v-model="quiz"
            type="textarea"
            autogrow
            outlined
            dense
            placeholder="문제를 입력해주세요."
            maxlength="400"
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
          <label class="label-answer">빈칸 답안</label>
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
              maxlength="400"
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
          />
          <q-icon class="help-icon"></q-icon>
        </q-card-section>
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
  submitQuizImageTemp,
  submitQuizImage,
  deleteQuiz,
} from 'src/services/quiz/admin/adminQuiz.js';
import { useCategorie } from 'src/services/quiz/admin/useCategorie.js';
import {
  quizSuccessNotification,
  quizErrorNotification,
  errorNotification,
} from 'src/services/quiz/notifications.js';

//반응형 데이터
const subject = ref('과목을 선택 해주세요.');
const chapter = ref('챕터를 선택 해주세요.');
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
    chapter.value = '챕터를 선택 해주세요.';
  }
});

// 문제에 포함된 <<빈칸>>의 개수를 최대 3개로 제한하는 watch
watch(quiz, newQuiz => {
  // <<빈칸>>을 정확히 감지
  const blankCount = (newQuiz.match(/<<빈칸>>/g) || []).length;

  if (blankCount > 3) {
    // 빈칸이 3개를 넘을 경우 경고 메시지
    alert('빈칸은 최대 3개까지 입력할 수 있습니다.');
    // 빈칸 개수를 3개로 제한
    quiz.value = quiz.value.replace(/<<빈칸>>/g, (match, offset, string) => {
      const currentCount = (string.slice(0, offset).match(/<<빈칸>>/g) || [])
        .length;
      return currentCount < 3 ? match : '';
    });
  }

  if (blankCount > blankInputs.value.length) {
    while (blankInputs.value.length < blankCount) {
      blankInputs.value.push('');
    }
  } else if (blankCount < blankInputs.value.length) {
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

// 서버에서 받아온 퀴즈 아이디
const quizId = ref('');

const router = useRouter();

// 서버에 문제 제출
const submitQuizForm = async () => {
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
  } else if (chapter.value === '챕터를 선택 해주세요.') {
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
  const confirmation = confirm('문제를 등록하시겠습니까? ');
  if (!confirmation) {
    return;
  }
  try {
    //서버에 보낼 퀴즈 데이터
    const quizData = {
      subject: subject.value,
      chapter: chapter.value,
      quizType: '5',
      jsonContent: JSON.stringify({
        quiz: quiz.value,
        answer: normalizedAnswers,
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

        // 이미지 진짜 제출
        await submitQuizImage(quizId.value, uuid);

        // 성공
        quizSuccessNotification();
        router.push(`/quizzes/${quizId.value}`);
      } else {
        // 이미지 없을 시 바로 제출
        quizId.value = await submitQuiz(quizData);
        // 성공
        quizSuccessNotification();
        router.push(`/quizzes/${quizId.value}`);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        quizErrorNotification();
        await deleteQuiz(quizId.value); // 퀴즈 삭제 처리
      } else {
        errorNotification();
        await deleteQuiz(quizId.value); // 퀴즈 삭제 처리
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

.tooltip {
  background-color: #000000;
  font-size: 1.3rem;
}
</style>
