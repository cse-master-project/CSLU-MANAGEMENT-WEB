<template>
  <q-form class="q-pa-md">
    <div class="title-container">
      <q-title class="title">빈칸채우기형</q-title>
    </div>
    <q-card>
      <q-card-section>
        <!-- 대분류 선택 -->
        <q-label>과목<span class="required">*</span></q-label>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-label>챕터<span class="required">*</span></q-label>
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          outlined
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <div>
          <q-label>문제<span class="required">*</span></q-label>
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
          <q-tooltip style="font-size: 1rem">
            '안녕하세요 저는 ( )입니다'처럼 입력해주세요.
          </q-tooltip>
        </div>

        <!-- 답변 입력 -->
        <q-label>답안<span class="required">*</span></q-label>
        <div v-for="(answer, index) in answers" :key="index" class="q-mb-md">
          <q-input
            v-model="answers[index]"
            type="text"
            class="q-mb-md"
            outlined
            placeholder="답을 입력해주세요"
          />
        </div>

        <!-- 해설 입력 -->
        <q-label>해설<span class="required">*</span></q-label>
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          class="q-mb-md"
        />
      </q-card-section>
      <q-card-section>
        <!-- 파일 첨부 -->
        <section class="container">
          <label for="file">
            <div class="styled-file-input">
              <div class="attachment-button">🔗 FILE UPLOAD</div>
              <p v-if="fileName" class="attached-file">{{ fileName }}</p>
            </div>
          </label>
          <input type="file" id="file" @change="fileInputHandler" />
        </section>
      </q-card-section>

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
const answers = ref(['']);
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
    quizType: '5',
    jsonContent: JSON.stringify({
      quiz: quiz.value,
      answer: answers.value,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
  userApi
    .post('/api/quiz/user', quizData)
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
@import '/src/css/QuizBtn.css';
</style>
