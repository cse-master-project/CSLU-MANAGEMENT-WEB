<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      v-if="currentQuiz"
      style="width: 90%; max-width: 600px"
    >
      <!-- 대분류, 소분류, 만든날짜 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">{{ currentQuiz.subject }}</div>
        <div class="text-subtitle2 q-mt-sm">
          {{ currentQuiz.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          {{ formatDate(currentQuiz.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(currentQuiz.quizType)"
          :quizcontent="quizContent"
          v-if="!isEditing"
        />
        <component
          :is="quizTypeEditForm(currentQuiz.quizType)"
          :quizcontent="quizContent"
          @update:quizcontent="updateQuizContent"
          v-if="isEditing"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn
          flat
          color="negative"
          class="my-btn small-btn"
          icon="edit"
          @click="isEditing = true"
          v-if="!isEditing"
        >
          수정
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          icon="delete"
          @click="quizDelete"
        >
          폐기
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
  <DeleteQuizSuccess
    v-if="deleteQuizSuccess"
    :delete-quiz-success="deleteQuizSuccess"
  />
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { date } from 'quasar';
import DeleteQuizSuccess from 'src/components/quiz/DeleteQuizSuccess.vue';
// import { quizDelete, deleteQuizSuccess } from 'src/services/quizDelete.js'; // quizDelete.js에서 import

const quizzes = ref([]);
const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기

const currentQuiz = computed(() => {
  return quizzes.value.find(q => q.quizId === parseInt(quizId));
});

const quizContent = computed(() => {
  if (currentQuiz.value && currentQuiz.value.jsonContent) {
    try {
      return JSON.parse(currentQuiz.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});

const quizTypeViewForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MultipleChoiceView.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/ShortAnswerView.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/MatchingView.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/TrueOrFalseView.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizView/FillInTheBlank.vue'),
      );
    default:
      return null;
  }
};

//문제 수정하기.
const quizTypeEditForm = quizType => {
  switch (quizType) {
    case 1:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/MultipleChoiceEdit.vue'),
      );
    case 2:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/ShortAnswerEdit.vue'),
      );
    case 3:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/MatchingEdit.vue'),
      );
    case 4:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/TrueOrFalseEdit.vue'),
      );
    case 5:
      return defineAsyncComponent(() =>
        import('src/components/quiztype/quizEdit/FillInTheBlankEdit.vue'),
      );
    default:
      return null;
  }
};

//서버에서 데이터 가져오기
const fetchQuizzes = async () => {
  try {
    const response = await api.get('/api/quiz/default');
    quizzes.value = response.data.content;
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};

const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchQuizzes();
});

// 퀴즈 수정 기능
const isEditing = ref(false); // 수정 모드 플래그

// 퀴즈 폐기 기능 TODO
// const deleteCurrentQuiz = async () => {
//   await quizDelete(currentQuiz.value);
//   deleteQuizSuccess.value = true; // deleteQuizSuccess 변수를 true로 설정
// };
// 퀴즈 폐기 기능.
const deleteQuizSuccess = ref(false);

const quizDelete = async () => {
  try {
    await api.delete(`/api/management/quiz/${currentQuiz.value.quizId}`);
    // 삭제 성공 시 로직
    // console.log("삭제되었습니다.")
    deleteQuizSuccess.value = true;
  } catch (error) {
    // console.error('퀴즈 삭제에 실패했습니다.', error);
    alert('문제 폐기 중 예상치 못한 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.my-card {
  max-width: 400px;
  margin: auto;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.text-orange {
  color: orange; /* 주황색 글자 색상 */
}

.text-createAt {
  font-size: 0.75rem; /* 작은 글씨 */
  color: #888888; /* 회색 */
}
.my-btn {
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 8px 16px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
</route>
