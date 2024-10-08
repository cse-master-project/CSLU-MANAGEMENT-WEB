<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" v-if="quizzes" style="width: 90%; max-width: 600px">
      <!-- 과목, 챕터, 생성일 -->
      <q-card-section class="q-pa-md">
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ quizzes.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">
          챕터 : {{ quizzes.detailSubject }}
        </div>
        <div class="text-caption text-createAt">
          생성일 : {{ formatDate(quizzes.createAt) }}
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(quizzes.quizType)"
          :quizcontent="quizContent"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-px-sm q-py-sm buttons-container">
        <q-btn
          flat
          color="red"
          class="my-btn small-btn"
          @click="isReject = true"
        >
          반려
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          @click="isApprove = true"
        >
          승인
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
  <RejectUserQuizConfirmation
    v-if="isReject"
    :is-reject="isReject"
    :current-quiz="quizzes"
    @update:isReject="isReject = $event"
  />
  <ApproveUserQuizConfirmation
    v-if="isApprove"
    :is-approve="isApprove"
    :current-quiz="quizzes"
    @update:isApprove="isApprove = $event"
  />
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'src/boot/axios';
import { date } from 'quasar';
import RejectUserQuizConfirmation from 'src/components/quiz/confirmation/RejectUserQuizConfirmation.vue';
import ApproveUserQuizConfirmation from 'src/components/quiz/confirmation/ApproveUserQuizConfirmation.vue';

const quizzes = ref([]);
const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기

//서버에서 퀴즈 데이터 가져오기. /api/quiz/{quizId}
const fetchQuizzes = async () => {
  try {
    const response = await api.get(`/api/quiz/${quizId}`);
    quizzes.value = response.data;
    console.log('퀴즈value:', quizzes.value);
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
// 생성일 포맷팅.
const formatDate = dateString => {
  return date.formatDate(dateString, 'YYYY-MM-DD HH:mm:ss');
};

onMounted(() => {
  fetchQuizzes();
});

//JSON 파싱.
const quizContent = computed(() => {
  if (quizzes.value && quizzes.value.jsonContent) {
    try {
      return JSON.parse(quizzes.value.jsonContent);
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      return null;
    }
  }
  return null;
});

// 퀴타입별 보여주기.(View)
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

// 퀴즈 반려 확인 기능
const isReject = ref(false);

// 퀴즈 승인 확인 기능
const isApprove = ref(false);
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
  width: 90%;
}

.buttons-container {
  justify-content: center;
}

.buttons-container .q-btn {
  margin: 01% 0; /* 버튼 사이 간격 조정 */
}
</style>
