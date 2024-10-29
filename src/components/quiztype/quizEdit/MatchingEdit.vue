<template>
  <q-form class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;선긋기형 수정&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md content-section">
        <div class="label-container">
          <label class="label-quiz">Q. </label>
          <q-input
            v-model="localQuizContent.quiz"
            outlined
            autogrow
            dense
            maxlength="300"
            class="text-subtitle1 input-field"
          />
        </div>
      </q-card-section>
      <q-separator />

      <!-- 좌측/우측 옵션 입력 및 색상 선택 -->
      <div class="q-pa-md row">
        <!-- 좌측 옵션 -->
        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.left_option"
            :key="index"
            class="q-mb-md"
          >
            <div class="q-mb-sm row no-wrap items-center justify-center">
              <q-btn
                v-for="color in colorOptions"
                :key="color"
                class="q-mr-sm"
                :style="{ backgroundColor: color }"
                :disabled="isColorDisabled(color, index)"
                @click="selectOption(color, index)"
              />
            </div>
            <q-input
              v-model="localQuizContent.left_option[index]"
              :label="`좌측 옵션 ${index + 1}`"
              outlined
              dense
              :style="{ backgroundColor: leftOptionsBgColor[index] }"
            />
          </div>
        </q-card-section>

        <!-- 우측 옵션 -->
        <q-card-section class="col">
          <div
            v-for="(option, index) in localQuizContent.right_option"
            :key="index"
            class="q-mb-md"
          >
            <q-input
              v-model="localQuizContent.right_option[index]"
              :label="`우측 옵션 ${index + 1}`"
              outlined
              dense
              :style="{ backgroundColor: rightOptionsBgColor[index] }"
            />
          </div>
        </q-card-section>
      </div>
      <q-separator />

      <!-- 초기화 버튼 -->
      <q-card-section class="q-pa-md">
        <q-btn
          flat
          color="warning"
          class="my-btn small-btn"
          @click="resetAnswers"
        >
          초기화
        </q-btn>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="label-container">
          <label class="label-commentary">해설 : </label>
          <q-input
            v-model="localQuizContent.commentary"
            outlined
            dense
            autogrow
            maxlength="300"
            class="input-field"
          />
        </div>
      </q-card-section>
    </q-card>
    <div class="button-container">
      <q-btn
        flat
        color="negative"
        class="my-btn small-btn"
        icon="close"
        @click="editCancle"
      >
        수정 취소
      </q-btn>
      <q-btn
        flat
        color="primary"
        class="my-btn small-btn"
        icon="edit"
        @click="submitQuiz"
      >
        수정 완료
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { quizPactchApi } from 'src/services/quiz/quizManagement.js';
import { statusReportsFromApi } from 'src/services/quiz/admin/reportedQuiz.js';

const props = defineProps({
  quizcontent: Object,
  quizzes: Object,
  quizReportId: Number,
});

const emit = defineEmits(['update:quizcontent', 'update:isEditing']);

const localQuizContent = ref({ ...props.quizcontent });

// 색상 선택을 위한 배열
const colorOptions = ['yellow', 'yellowgreen', 'orange'];
const leftOptionsBgColor = ref(['', '', '']); // 왼쪽 옵션 배경색
const rightOptionsBgColor = ref(['', '', '']); // 오른쪽 옵션 배경색

// 서버에서 가져온 답을 기반으로 색상 매칭 설정
onMounted(() => {
  applyAnswerColors();
});

// 서버에서 받아온 answer에 맞춰 색상 적용
const applyAnswerColors = () => {
  localQuizContent.value.answer.forEach(answer => {
    const [leftIndex, rightIndex] = answer.split('t').map(Number); // 인덱스 추출
    const color = colorOptions[leftIndex]; // 왼쪽 인덱스에 해당하는 색상 선택
    leftOptionsBgColor.value[leftIndex] = color; // 왼쪽 색상 적용
    rightOptionsBgColor.value[rightIndex] = color; // 오른쪽 색상 적용
  });
};

// 수정 취소 기능
const editCancle = () => {
  emit('update:isEditing', false);
};

// 색상 선택 기능
const selectOption = (color, index) => {
  if (
    leftOptionsBgColor.value.includes(color) &&
    leftOptionsBgColor.value[index] !== color
  ) {
    alert(`색상 ${color}는 이미 선택된 상태입니다.`);
    return;
  }
  leftOptionsBgColor.value[index] = color; // 선택한 색상으로 입력 필드 배경색 업데이트
  updateMatchingOptions(index, color); // 매칭된 색상 업데이트
};

// 매칭 업데이트
const updateMatchingOptions = (index, color) => {
  const colorIndex = colorOptions.indexOf(color);
  if (colorIndex >= 0) {
    localQuizContent.value.answer[index] = `${index}t${colorIndex}`;
    rightOptionsBgColor.value[colorIndex] = color; // 오른쪽 옵션 색상도 적용
  }
};

// 답 및 색상 초기화
const resetAnswers = () => {
  // 색상 초기화
  leftOptionsBgColor.value = ['', '', ''];
  // 답안 초기화
  localQuizContent.value.answer = ['', '', ''];
};

// 왼쪽 옵션 변경 시 자동으로 매칭 업데이트
watch(
  () => localQuizContent.value.left_option,
  () => {
    leftOptionsBgColor.value.forEach((color, index) => {
      if (color) {
        updateMatchingOptions(index, color);
      }
    });
  },
  { deep: true },
);

// 중복된 색상 선택 방지
const isColorDisabled = (color, index) => {
  return leftOptionsBgColor.value.some(
    (bgColor, i) => bgColor === color && i !== index,
  );
};

// 수정 완료 기능
const submitQuiz = async () => {
  const quizData = {
    quiz: localQuizContent.value.quiz,
    left_option: localQuizContent.value.left_option,
    right_option: localQuizContent.value.right_option,
    answer: localQuizContent.value.answer,
    commentary: localQuizContent.value.commentary,
  };
  const confirmation = confirm('수정 하시겠습니까 ?');
  if (!confirmation) {
    return;
  }

  try {
    // 퀴즈 수정 API 호출
    await quizPactchApi(props.quizzes.quizId, quizData);
    alert('수정이 완료되었습니다 ^_^');

    // 수정 완료 후 신고 상태 업데이트
    try {
      await statusReportsFromApi(props.quizReportId);
      console.log('신고 상태가 성공적으로 업데이트되었습니다.');
    } catch (statusError) {
      console.error('신고 상태 업데이트 오류:', statusError);
      alert('신고 상태 업데이트 중 오류가 발생했습니다.');
    }

    // 부모 컴포넌트로 수정된 데이터 전송
    emit('update:quizcontent', localQuizContent.value);
    emit('update:isEditing', false);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('바뀐게 없습니다 .. ㅜㅠ');
    } else {
      console.error('수정 오류:', error);
      alert('문제 수정 중 오류가 발생했습니다.');
    }
  }
};
ㄴ;
</script>

<style scoped>
.option-text {
  padding: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}

.text-positive {
  color: #43a047;
}

/* 입력 필드와 라벨을 수평으로 배치 */
.label-container {
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  gap: 8px; /* 라벨과 입력 필드 사이 간격 */
}

.input-field {
  flex: 1; /* 입력 필드가 가로로 꽉 차도록 확장 */
}

.my-btn {
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 14px 24px; /* 버튼 패딩을 키워서 버튼 크기를 늘림 */
  font-size: 1.1rem; /* 버튼 글자 크기를 키움 */
  width: 200px;
}

.button-container {
  display: flex;
  flex-direction: row; /* 버튼을 수평으로 정렬 */
  justify-content: center; /* 버튼을 가운데 정렬 */
  gap: 100px; /* 버튼 사이 간격 */
  padding: 0 32px; /* 양옆 마진을 카드와 동일하게 */
  margin-top: 30px;
}
</style>
