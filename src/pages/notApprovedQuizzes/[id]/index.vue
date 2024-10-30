<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="my-card" v-if="quizzes" style="width: 90%; max-width: 800px">
      <!-- 과목, 챕터 -->
      <q-card-section class="q-pa-md">
        <div>퀴즈 ID : {{ quizzes.quizId }}</div>
        <div class="text-h6 q-mb-xs text-orange">
          과목 : {{ quizzes.subject }}
        </div>
        <div class="text-subtitle2 q-mt-sm">챕터 : {{ quizzes.chapter }}</div>

        <!-- 이미지 표시 -->
        <div v-if="imageUrl" class="q-mt-md">
          <img
            :src="imageUrl"
            alt="문제 이미지"
            style="max-width: 100%; height: auto; border-radius: 8px"
          />
        </div>
      </q-card-section>

      <!-- 퀴즈 타입에 따라 동적 컴포넌트 표시 -->
      <q-card-section class="q-pa-md">
        <component
          :is="quizTypeViewForm(quizzes.quizType)"
          :quizcontent="quizContent"
        />
      </q-card-section>

      <q-card-actions class="button-container">
        <q-btn
          flat
          color="red"
          class="my-btn small-btn"
          @click="isReject = true"
          icon="cancel"
        >
          반려
        </q-btn>
        <q-btn
          flat
          color="primary"
          class="my-btn small-btn"
          @click="isApprove = true"
          icon="check"
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
import {
  fetchQuiz,
  fetchQuizImage,
} from 'src/services/quiz/admin/adminQuizDetail.js';
import RejectUserQuizConfirmation from 'src/components/quiz/confirmation/RejectUserQuizConfirmation.vue';
import ApproveUserQuizConfirmation from 'src/components/quiz/confirmation/ApproveUserQuizConfirmation.vue';

const quizzes = ref([]);
const route = useRoute(); // 현재 라우터 파라미터 가져오기
const quizId = route.params.id; // 현재 퀴즈 찾기

// 이미지 URL 상태
const imageUrl = ref(null);

// 서버에서 퀴즈 데이터 가져오기.
const fetchQuizzes = async () => {
  try {
    const data = await fetchQuiz(quizId);
    quizzes.value = data;
    console.log('서버에서 가져온 quiz value : ', quizzes.value);
    // hasImage가 true이면 이미지를 가져옴
    if (quizzes.value.hasImage) {
      await fetchImage(); // 이미지 로드 함수 호출
    }
  } catch (error) {
    console.error('퀴즈 데이터를 불러오는데 실패했습니다.', error);
  }
};
// 서버에서 이미지 가져오기
const fetchImage = async () => {
  try {
    const base64String = await fetchQuizImage(quizId);
    imageUrl.value = `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('이미지 데이터를 불러오는 데 실패했습니다.', error);
  }
};

onMounted(async () => {
  await fetchQuizzes();
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
  max-width: 600px;
  margin: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 카드 그림자 더 강화 */
  border-radius: 12px; /* 카드 테두리 둥글게 */
}

.text-orange {
  color: orange; /* 주황색 글자 색상 */
}

.text-createAt {
  font-size: 0.8rem; /* 약간 큰 작은 글씨 */
  color: #888888; /* 회색 */
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 14px 24px; /* 버튼 패딩을 키워서 버튼 크기를 늘림 */
  font-size: 1.1rem; /* 버튼 글자 크기를 키움 */
  width: auto;
}

.button-container {
  display: flex;
  flex-direction: row; /* 버튼을 수평으로 정렬 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 100px; /* 버튼 사이 간격 */
  padding: 0 32px; /* 양옆 마진을 카드와 동일하게 */
  margin-bottom: 20px;
}
</style>
