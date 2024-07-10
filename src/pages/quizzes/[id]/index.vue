<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card
      class="my-card"
      v-if="currentQuiz"
      style="width: 90%; max-width: 600px"
    >
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ currentQuiz.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">
          챕터 : {{ currentQuiz.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          생성일 : {{ formatDate(currentQuiz.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(currentQuiz.quizType)"
          :quizcontent="quizContent"
          v-if="!isEditing"
        />
        <!-- 퀴즈 수정시 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
        <component
          :is="quizTypeEditForm(currentQuiz.quizType)"
          :quizcontent="quizContent"
          :currentquiz="currentQuiz"
          @update:quizcontent="updateQuizContent"
          @editComplete="isEditing = false"
          v-if="isEditing"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-py-sm">
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          icon="delete"
          @click="isDelete = true"
        >
          폐기
        </q-btn>
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
      </q-card-actions>
    </q-card>
  </q-page>
  <DeleteQuizConfirmation
    v-if="isDelete"
    :is-delete="isDelete"
    :current-quiz="currentQuiz"
    @update:isDelete="isDelete = $event"
  />
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { date } from 'quasar';
import DeleteQuizConfirmation from 'src/components/quiz/DeleteQuizConfirmation.vue';

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

//console.log('현재', currentQuiz, 'json:', quizContent);

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

// 퀴즈 페기 확인 기능
const isDelete = ref(false);

const updateQuizContent = newContent => {
  if (currentQuiz.value) {
    currentQuiz.value.jsonContent = JSON.stringify(newContent);
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
