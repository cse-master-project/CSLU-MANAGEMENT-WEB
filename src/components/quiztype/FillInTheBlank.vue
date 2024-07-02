<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <!-- 대분류 선택 -->
        <q-select
          v-model="subject"
          :options="subjectOptions"
          label="대분류"
          outlined
          class="q-mb-md"
          @update:model-value="updateDetailSubjectOptions"
        />
        <!-- 소분류 선택 -->
        <q-select
          v-model="detailSubject"
          :options="filteredDetailSubjectOptions"
          label="소분류"
          outlined
          class="q-mb-md"
        />
        <!-- 문제 입력 -->
        <div>
          <q-input
            v-model="quiz"
            type="textarea"
            outlined
            rows="4"
            placeholder="문제를 입력해주세요"
            maxlength="300"
            class="q-mb-md"
          />
          <q-tooltip style="font-size: 1rem">
            '안녕하세요 저는 ( )입니다'처럼 입력해주세요.
          </q-tooltip>
        </div>

        <!-- 답변 입력 -->
        <div v-for="(answer, index) in answers" :key="index" class="q-mb-md">
          <q-input
            v-model="answers[index]"
            type="text"
            class="q-mb-md"
            outlined
            placeholder="답을 입력해주세요"
            style="margin: 3% 0; width: 30%"
          />
        </div>

        <!-- 해설 입력 -->
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          class="q-mb-md"
          style="margin: 3% 0"
        />

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
  <!-- SubmitQuizSuccess 컴포넌트 -->
  <SubmitQuizSuccess
    v-if="submitQuizSuccess"
    :submit-quiz-success="submitQuizSuccess"
  />
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import SubmitQuizSuccess from 'src/components/quiz/SubmitQuizSuccess.vue';
import useCategories from 'src/services/useCategories.js';

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

const { categories, subjectOptions, detailSubjectOptions, fetchCategories } =
  useCategories();

onMounted(fetchCategories);

const subject = ref('');
const detailSubject = ref('');
const quiz = ref('');
const answers = ref(['']);
const commentary = ref('');

const updateDetailSubjectOptions = () => {
  const selectedCategory = categories.value.find(
    category => category.subject === subject.value,
  );
  if (selectedCategory) {
    filteredDetailSubjectOptions.value = selectedCategory.detailSubject;
  } else {
    filteredDetailSubjectOptions.value = [];
  }
};

const filteredDetailSubjectOptions = ref([]);

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
@import '/src/css/QuizBtn.css';

/* 추가적인 스타일링은 필요에 따라 적용하세요 */
</style>
