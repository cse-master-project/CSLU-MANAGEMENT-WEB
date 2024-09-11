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
            :style="{ backgroundColor: getColor(index, 'left') }"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div
            v-for="(option, index) in quizcontent.right_option"
            :key="'right-' + index"
            class="q-mb-md"
            :style="{ backgroundColor: getColor(index, 'right') }"
          >
            {{ index + 1 }}. {{ option }}
          </div>
        </q-card-section>
      </div>

      <q-card-section>
        <div>정답: {{ quizcontent.answer.join(', ') }}</div>
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

const getColor = (index, side) => {
  // 정답 배열에서 인덱스를 기반으로 색상을 반환
  const answers = props.quizcontent.answer.map(answer => answer.split('t'));

  // 왼쪽 또는 오른쪽 옵션의 색상 결정
  const colorIndex = answers.findIndex(([left, right]) => {
    if (side === 'left') return left == index;
    if (side === 'right') return right == index;
  });

  return colorIndex >= 0 ? getColorForIndex(colorIndex) : 'transparent'; // 정답이 아닌 경우 기본 투명 색상
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
