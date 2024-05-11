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

        <div class="option-container">
          <div class="left">
            <!--왼쪽그룹-->
            <q-input label="a" v-model="leftOptions.a" outlined />
            <q-input label="b" v-model="leftOptions.b" outlined />
            <q-input label="c" v-model="leftOptions.c" outlined />
          </div>
          <div class="right">
            <!--오른쪽 그룹-->
            <q-input label="a`" v-model="rightOptions.a" outlined />
            <q-input label="b`" v-model="rightOptions.b" outlined />
            <q-input label="c`" v-model="rightOptions.c" outlined />
          </div>
        </div>

        <div>
          <div v-for="(answer, index) in answers" :key="index" class="q-mb-md">
            <q-input
              v-model="answers[index]"
              type="text"
              class="q-mb-md"
              outlined
              placeholder="답을 입력해주세요"
              style="margin: 3% 0; width: 30%"
            />
            <!--툴팁입니다. -->
            <q-tooltip style="font-size: 1rem">
              ata`,btc`처럼 입력해주세요. a: 노란꽃 a':벚꽃 b':개나리 -> atb'
            </q-tooltip>
          </div>
        </div>

        <q-input
          v-model="commentary"
          type="textarea"
          placeholder="해설을 입력해주세요"
          outlined
          autogrow
          style="margin: 3% 0"
        />

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
const answers = ref(['']);
const leftOptions = ref({
  a: '',
  b: '',
  c: '',
});

const rightOptions = ref({
  a: '',
  b: '',
  c: '',
});
const commentary = ref('');

const submitQuiz = () => {
  const quizData = {
    subjectId: subject.value,
    detailSubject: detailSubject.value,
    jsonContent: JSON.stringify({
      type: '3',
      quiz: quiz.value,
      left_option: [
        leftOptions.value.a,
        leftOptions.value.b,
        leftOptions.value.c,
      ],
      right_option: [
        rightOptions.value.a,
        rightOptions.value.b,
        rightOptions.value.c,
      ],
      answer: answers.value,
      commentary: commentary.value,
    }),
  };
  console.log('서버에 제출될 데이터:', quizData);
};
</script>

<style scoped lang="scss">
@import '/src/css/QuizBtn.css';

.option-container {
  display: flex;
  margin: 30px 0;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  width: 300px;
}
.left > *,
.right > * {
  margin: 10px 0;
}
</style>
