<template>
  <q-form class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">문제 유형: 선긋기형</div>
        <div class="text-subtitle1">문제 : {{ quizcontent.quiz }}</div>
      </q-card-section>

      <div class="q-pa-md row">
        <q-card-section class="col">
          <div
            v-for="(option, index) in quizcontent.left_option"
            :key="'left-' + index"
            class="q-mb-md"
            :style="{ backgroundColor: getColor(option, 'left') }"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div
            v-for="(option, index) in quizcontent.right_option"
            :key="'right-' + index"
            class="q-mb-md"
            :style="{ backgroundColor: getColor(option, 'right') }"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>
      </div>

      <q-card-section>
        <div>정답: {{ quizcontent.answer }}</div>
      </q-card-section>

      <q-card-section>
        <div>해설: {{ quizcontent.commentary }}</div>
      </q-card-section>
    </q-card>
  </q-form>
</template>

<script setup>
const props = defineProps({
  quizcontent: {
    type: Object,
    required: true,
  },
});

const getColor = (option, side) => {
  // 정답 배열에서 왼쪽과 오른쪽 인덱스를 구분
  const answers = props.quizcontent.answer.map(answer => answer.split('t'));

  for (let i = 0; i < answers.length; i++) {
    const [left, right] = answers[i];

    if (side === 'left' && option === left) {
      return getColorForIndex(i);
    }
    if (side === 'right' && option === right) {
      return getColorForIndex(i);
    }
  }

  return 'transparent'; // 정답이 아닌 경우 기본 투명 색상
};

const getColorForIndex = index => {
  // 인덱스에 따라 색상을 반환
  switch (index) {
    case 0:
      return 'yellow';
    case 1:
      return 'yellowgreen';
    case 2:
      return 'orange';
    default:
      return 'transparent'; // 인덱스가 정의되지 않은 경우 기본 투명 색상
  }
};
</script>

<style scoped>
.q-mb-md {
  margin-bottom: 16px; /* 필요에 따라 조정 */
}
</style>
