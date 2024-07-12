<template>
  <q-page class="about">
    <div class="content-container row">
      <div class="text" style="width: 35%">
        <div class="text-h6" style="margin: 5% 0; font-weight: bold">
          사진 설명
        </div>
        <div>
          이곳에 사진 설명을 입력합니다. 이 설명은 사진의 내용을 요약합니다.
        </div>
      </div>
      <div class="picture" style="width: 60%">
        <q-carousel
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          v-model="slide"
          arrows
          navigation
          infinite
          autoplay
          autoplay-interval="3000"
        >
          <q-carousel-slide
            :name="1"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-carousel-slide
            :name="2"
            img-src="https://cdn.quasar.dev/img/parallax1.jpg"
          />
          <q-carousel-slide
            :name="3"
            img-src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
          <q-carousel-slide
            :name="4"
            img-src="https://cdn.quasar.dev/img/quasar.jpg"
          />
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    return {
      slide: ref(1),
    };
  },
};
</script>

<style scoped>
.about {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* 화면 중앙에 배치 */
  width: 100%; /* 전체 화면 너비 */
}

.content-container {
  display: flex;
  justify-content: space-between; /* 요소들 사이에 공간을 균등하게 분배 */
  align-items: center; /* 요소들을 수직 가운데로 정렬 */
  width: 100%;
  max-width: 1200px; /* 원하는 최대 너비 설정 */
}
</style>
