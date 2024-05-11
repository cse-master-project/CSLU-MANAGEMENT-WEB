<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-select
          v-model="subject"
          :options="subjectOptions"
          label="대분류"
          outlined
          class="q-mb-md"
        />
        <q-select
          v-model="detailSubjet"
          :options="detailSubjectOptions"
          label="소분류"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="quiz"
          type="textarea"
          outlined
          rows="4"
          placeholder="문제를 입력해주세요"
          maxlength="300"
          class="q-mb-md"
        />

        <q-input
          v-model="answer"
          type="textarea"
          autogrow
          outlined
          placeholder="답을 입력해주세요"
          class="textbox"
          style="margin: 3% 0; width: 30%"
        />
        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          style="margin: 3% 0"
        />
        <!--첨부파일-->
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
          @click="goBack()"
          style="width: 10%; margin: 3% 1%"
          >뒤로가기</q-btn
        >
        <q-btn
          class="registerbtn"
          @click="submitQuiz"
          style="width: 10%; margin: 3% 0"
          >문제 등록</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { QInput } from 'quasar';

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

const subjectOptions = [
  { label: 'c언어', value: 'C' },
  { label: '파이썬', value: 'Python' },
  { label: '자료구조', value: 'Data structure' },
];

const detailSubjectOptions = [
  { label: '스택', value: 'Stack' },
  { label: '큐', value: 'Queue' },
  { label: '그래프', value: 'Graph' },
];

const subject = ref('');
const detailSubjet = ref('');
const quiz = ref('');
const answer = ref('');
const commentary = ref('');

const submitQuiz = () => {
  const quizData = {
    subjectId: subject.value,
    detailSubject: detailSubjet.value,
    jsonContent: JSON.stringify({
      type: '2',
      quiz: quiz.value,
      answer: answer.value,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';

.textbox {
  font-family: 'Arial', sans-serif;
}
</style>
