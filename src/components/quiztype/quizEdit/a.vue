<template>
  <q-form class="form-container">
    <div class="title-container">
      <q-title class="title">빈칸 채우기형</q-title>
    </div>
    <q-card>
      <q-card-section class="quiz-container">
        <q-label class="label-quiz">Q</q-label>
        <q-input
          v-model="localQuizContent.quiz"
          type="textarea"
          rows="1"
          outlined
          dense
          placeholder="문제를 입력해주세요 (괄호를 넣어줍니다 예 : 안녕하세요 ()입니다. ()살입니다.)"
          maxlength="100"
          counter
          class="input-quiz"
        />
      </q-card-section>
      <!-- 답 입력 -->
      <q-card-section class="answer-container">
        <q-label class="label-answer">답안</q-label>
        <div
          v-for="(answer, index) in localQuizContent.answer"
          :key="index"
          class="q-mb-md input-answer"
        >
          <q-input
            v-model="localQuizContent.answer[index]"
            type="textarea"
            rows="1"
            outlined
            dense
            placeholder="답안 입력해주세요 (다수일 경우 , 로 구분) "
            maxlength="100"
            counter
          />
        </div>
      </q-card-section>
      <!-- 해설 입력 -->
      <q-card-section class="comment-container">
        <q-label class="label-quiz">해설 </q-label>
        <q-input
          v-model="localQuizContent.commentary"
          type="textarea"
          rows="3"
          outlined
          placeholder="해설을 입력하세요"
          dense
          maxlength="100"
          counter
          class="input-commentary"
      /></q-card-section>
      <q-card-section class="btn-container">
        <q-btn class="btn-back" @click="editCancle"> 뒤로가기 </q-btn>
        <q-btn class="btn-submit" @click="submitQuiz"> 문제 등록 </q-btn>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup></script>

<style lang="scss" scoped>
// 폼 컨테이너 스타일
.form-container {
  max-width: 800px;
  margin-bottom: 20px;
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

// 답안 입력 스타일
.answer-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: baseline; /* 수직 중앙 정렬 */
}
.label-answer {
  font-size: 1rem;
  color: #000000;
  margin-right: 15px;
  font-weight: bold;
}
.input-answer {
  width: 70%;
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
</style>
