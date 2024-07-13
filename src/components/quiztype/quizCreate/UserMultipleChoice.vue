<template>
  <!-- 퀴즈 등록 폼 -->
  <q-form class="q-pa-md">
    <div class="title-container">
      <q-title class="title">4지선다형</q-title>
    </div>
    <q-card>
      <q-card-section>
        <!-- 대분류 선택 -->
        <q-label>과목 <span class="required">*</span></q-label>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-label>챕터 <span class="required">*</span></q-label>
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          outlined
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <q-label>문제 <span class="required">*</span></q-label>
        <q-input
          v-model="quiz"
          type="textarea"
          outlined
          rows="3"
          placeholder="문제를 입력해주세요"
          maxlength="100"
          counter
          class="q-mb-md"
        />

        <!-- 보기 입력 -->
        <div
          v-for="index in 4"
          :key="`choice-${index}`"
          class="choice-container"
        >
          <q-label>보기 {{ index }} <span class="required">*</span></q-label>
          <q-input
            v-model="option[index - 1].label"
            type="textarea"
            outlined
            autogrow
            style="margin: 10px 0"
            class="q-mb-md"
          />
        </div>

        <!-- 정답 입력 (숫자만 가능) -->

        <q-label>정답 (Only Number) <span class="required">*</span></q-label>
        <q-input
          v-model.number="answer"
          type="number"
          outlined
          :min="1"
          :max="4"
          style="width: 20%"
          class="q-mb-md"
        />

        <!-- 해설 입력 -->
        <q-label>해설<span class="required">*</span></q-label>
        <q-input
          v-model="commentary"
          type="textarea"
          outlined
          autogrow
          class="q-mb-md"
        />
      </q-card-section>

      <!-- 파일 첨부 섹션 -->
      <q-card-section class="container">
        <label for="file">
          <div class="styled-file-input">
            <div class="attachment-button">🔗 FILE UPLOAD</div>
            <p v-if="fileName" class="attached-file">{{ fileName }}</p>
          </div>
        </label>
        <input type="file" id="file" @change="fileInputHandler" />
      </q-card-section>

      <!-- 액션 버튼 섹션 -->
      <q-card-actions align="right">
        <q-btn
          class="backbtn"
          @click="goBack"
          style="width: 10%; margin: 3% 1%"
        >
          뒤로가기
        </q-btn>
        <q-btn
          class="registerbtn"
          @click="submitQuiz"
          style="width: 10%; margin: 3% 0"
        >
          문제 등록
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>

  <!-- SubmitQuizSuccess 컴포넌트 -->
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
const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = event.target.files[0].name;
  }
};

const { subjectOptions, fetchCategories, getDetailSubjectsBySubject } =
  userUseCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const option = ref([
  { label: '', value: '1' },
  { label: '', value: '2' },
  { label: '', value: '3' },
  { label: '', value: '4' },
]);
const answer = ref(null);
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
    quizType: '1',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      option: option.value.map(choice => choice.label),
      answer: answer.value,
      commentary: commentary.value,
    }),
    hasImage: false,
  };
  // console.log('서버에 제출될 데이터:', quizData);
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

<style scoped>
@import '/src/css/QuizBtn.css';
</style>
