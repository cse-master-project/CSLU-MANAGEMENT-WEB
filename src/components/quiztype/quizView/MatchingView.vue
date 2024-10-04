<template>
  <q-form class="q-pa-md">
    <!-- 문제 유형을 카드 밖 오른쪽에 배치 -->
    <div class="row justify-end q-mb-md">
      <q-chip small outline class="text-caption text-grey">
        &lt;선긋기형&gt;
      </q-chip>
    </div>

    <q-card flat bordered>
      <!-- 문제 내용 -->
      <q-card-section class="bg-primary text-white q-pa-md">
        <div class="text-subtitle1">Q. {{ quizcontent.quiz }}</div>
      </q-card-section>

      <q-separator />

      <div class="q-pa-md row">
        <!-- 왼쪽 옵션 -->
        <q-card-section class="col">
          <q-list bordered padding>
            <q-item
              v-for="(option, index) in quizcontent.left_option"
              :key="'left-' + index"
            >
              <q-item-section>
                <div
                  class="option-text"
                  :style="{ backgroundColor: getColor(index, 'left') }"
                >
                  {{ index + 1 }}. {{ option }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!-- 오른쪽 옵션 -->
        <q-card-section class="col">
          <q-list bordered padding>
            <q-item
              v-for="(option, index) in quizcontent.right_option"
              :key="'right-' + index"
            >
              <q-item-section>
                <div
                  class="option-text"
                  :style="{ backgroundColor: getColor(index, 'right') }"
                >
                  {{ index + 1 }}. {{ option }}
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>

      <q-separator />

      <!-- 정답 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          정답 :
          <span class="text-positive">{{ quizcontent.answer.join(', ') }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <!-- 해설 표시 -->
      <q-card-section>
        <div class="text-weight-medium">
          해설 : {{ quizcontent.commentary }}
        </div>
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
  const answers = props.quizcontent.answer.map(answer => answer.split('t'));
  const colorIndex = answers.findIndex(([left, right]) => {
    if (side === 'left') return left == index;
    if (side === 'right') return right == index;
  });

  // 정답에 해당하면 색상을 반환하고, 아니면 투명하게 설정
  return colorIndex >= 0 ? getColorForIndex(colorIndex) : 'transparent';
};

const getColorForIndex = index => {
  switch (index) {
    case 0:
      return 'yellow';
    case 1:
      return 'yellowgreen';
    case 2:
      return 'orange';
    default:
      return 'transparent';
  }
};
</script>

<style scoped>
.option-text {
  padding: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  text-align: center;
}

.text-blue {
  color: #1e88e5;
}

.text-bold {
  font-weight: 700;
}

.text-h5 {
  font-size: 1.25rem;
}

.text-caption {
  font-size: 12px;
}

.text-weight-medium {
  font-weight: 500;
}
</style>
