<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-select
          v-model="mainCategory"
          :options="mainCategoryOptions"
          label="대분류"
          outlined
          class="q-mb-md"
        />

        <q-select
          v-model="subCategory"
          :options="subCategoryOptions"
          label="소분류"
          outlined
          class="q-mb-md"
        />

        <q-input
          v-model="question"
          outlined
          placeholder="문제를 입력해주세요"
          autogrow
          class="q-mb-md"
          maxlength="300"
        />

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

        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          class="q-mb-md"
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
          style="width: 10%; margin: 3% 01%"
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

const mainCategoryOptions = [
  { label: '과일', value: 'Fruit' },
  { label: 'c언어', value: 'C' },
  { label: '파이썬', value: 'Python' },
  { label: '자료구조', value: 'Data structure' },
];

const subCategoryOptions = [
  { label: '색', value: 'Color' },
  { label: '스택', value: 'Stack' },
  { label: '큐', value: 'Queue' },
  { label: '그래프', value: 'Graph' },
];
const mainCategory = ref('');
const subCategory = ref('');
const question = ref('');
const answers = ref(['']);
const commentary = ref('');
const emits = defineEmits(['change-quiz-type']);

const goBack = () => {
  emits('change-quiz-type', '');
};
//첨부파일명 표시
const fileName = ref('');
const fileInputHandler = event => {
  const files = event.target && event.target.files;
  if (files && files[0]) {
    fileName.value = event.target.files[0].name;
  }
};
const submitQuiz = () => {
  // 여기에 문제 제출 로직을 구현합니다.
  console.log('제출된 문제:', {
    mainCategory: mainCategory.value, //대
    subCategory: subCategory.value, //소
    question: question.value, //문제
    answers: answers.value, //답리스트
    commentary: commentary.value, //해설
    fileName: fileName.value, //첨부파일
  });
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';


/* 추가적인 스타일링은 필요에 따라 적용하세요 */
</style>
