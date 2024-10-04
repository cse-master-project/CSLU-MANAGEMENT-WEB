<template>
  <q-page class="q-pa-md" style="font-family: 'Toss Product Sans'">
    <div class="container" style="width: 90%">
      <section
        v-for="(section, sectionIndex) in sections"
        :key="sectionIndex"
        :ref="'section' + sectionIndex"
        class="section"
      >
        <!-- 타이틀 -->
        <q-card flat class="q-pa-md text-left" style="border: none">
          <q-card-section>
            <div class="section-title">
              {{ section.title }}
            </div>
          </q-card-section>
          <q-card-section
            style="font-size: 30px; font-weight: 700; white-space: pre-line"
          >
            {{ section.content }}
          </q-card-section>

          <!-- 사진 및 내용 -->
          <q-card-section class="q-pt-none" style="margin: 3% 0; width: 100%">
            <div v-if="section.image" class="content-wrapper">
              <div v-if="sectionIndex === 0">
                <q-carousel
                  v-model="currentImageIndex"
                  animated
                  swipeable
                  infinite
                  class="slider"
                  height="700px"
                  style="width: 100%"
                >
                  <q-carousel-slide
                    v-for="(img, imgIndex) in section.image"
                    :key="imgIndex"
                    :name="imgIndex"
                    class="slides"
                    style="width: 840px"
                  >
                    <div class="image-text" style="color: black">
                      {{ img.text }}
                    </div>
                    <img
                      :src="img.src"
                      class="screenimage"
                      alt="Section Image"
                      style="width: 350px; height: 700px"
                    />
                  </q-carousel-slide>
                </q-carousel>
                <div class="button-container">
                  <q-btn
                    @click="prevImage"
                    icon="keyboard_arrow_left"
                    round
                    class="btn"
                  />
                  <div style="font-size: 1.3rem; color: black">
                    {{ currentImageIndex + 1 }} / {{ sections[0].image.length }}
                  </div>
                  <q-btn
                    @click="nextImage"
                    icon="keyboard_arrow_right"
                    round
                    class="btn"
                  />
                </div>
              </div>
              <div
                v-else
                class="image-text-wrapper"
                v-for="(img, imgIndex) in section.image"
                :key="imgIndex"
                :class="{ 'is-visible': imgIndex <= currentImageIndex }"
                :style="{ '--i': imgIndex }"
                style="max-width: 1200px"
              >
                <img :src="img.src" class="image" alt="Section Image" />
                <div class="image-text">{{ img.text }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { QCarousel, QCarouselSlide, QBtn } from 'quasar';

// 섹션 내용
const sections = ref([
  {
    title: '문제 유형 선택',
    content:
      '원하는 문제 유형을 선택하여 시작해 보세요!\n 아래와 같은 문제 유형이 있습니다.',
    image: [
      {
        src: '/quizimg/multiple.png',
        text: '4지선다형',
      },
      { src: '/quizimg/shortanswer.png', text: '단답형' },
      { src: '/quizimg/matching.png', text: '선긋기형' },
      { src: '/quizimg/truefalse.png', text: 'O/X형' },
      { src: '/quizimg/screen.png', text: '빈칸 채우기형' },
    ],
  },
  {
    title: '과목 및 챕터 선택',
    content:
      '문제 유형을 선택하셨다면, 다음으로는 과목과 해당 과목의 챕터를 선택하세요.',
    image: [{ src: '/quizimg/lang.png', text: '' }],
  },
  {
    title: '문제 입력',
    content: `이제 선택한 유형과 과목에 맞게 문제를 작성해 보세요.
      문제의 난이도와 형식을 고려하여 작성해 주세요.`,
    image: [],
  },
  {
    title: '정답 및 해설 입력',
    content:
      '마지막으로, 작성한 문제에 대한 정답과 해설을 입력해 주세요. \n명확한 해설은 학습자의 이해를 도울 수 있습니다.',
    image: [],
  },
]);

const observer = ref(null);
const currentImageIndex = ref(0);

// handleIntersection 함수는 섹션 요소가 뷰포트에 들어오고 나갈 때 호출됩니다.
const handleIntersection = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active'); // 섹션이 뷰포트에 들어오면 'active' 클래스를 추가합니다.
    } else {
      entry.target.classList.remove('active'); // 섹션이 뷰포트에서 나가면 'active' 클래스를 제거합니다.
    }
  });
};

// 컴포넌트가 마운트될 때 실행되는 함수
onMounted(() => {
  observer.value = new IntersectionObserver(handleIntersection, {
    threshold: 0.1,
  });

  // 각 섹션 요소를 찾아서 observer에 등록합니다.
  sections.value.forEach((section, sectionIndex) => {
    const element = document.querySelector(
      `.section:nth-child(${sectionIndex + 1})`,
    );
    if (element) {
      observer.value.observe(element); // 섹션 요소를 observer에 등록
    }
  });
});

// 컴포넌트가 언마운트될 때 실행되는 함수
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect(); // observer의 모든 관찰을 중지합니다.
  }
});

// 이전 이미지로 이동
const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + sections.value[0].image.length) %
    sections.value[0].image.length;
};

// 다음 이미지로 이동
const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % sections.value[0].image.length;
};
</script>

<style>
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  margin: 0 auto;
}
.slider {
  display: flex;
  flex-direction: column;
  width: 1080px;
}
.section {
  margin-bottom: 50px;
  opacity: 0;
  animation: none;
  width: 100%;
  min-height: 800px;
}

.section.active {
  animation: fadeInUp 1s ease-in-out forwards;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.image-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.section.active .image-text-wrapper.is-visible {
  opacity: 1;
  transition-delay: calc(var(--i) * 0.1s);
}

.image-text {
  margin-top: 10px;
  font-size: 40px;
  text-align: center;
  font-weight: 700;
}

.q-mt-md {
  margin-top: 16px;
  list-style-type: none;
  font-size: 1.3rem;
}

.section-title {
  font-size: 28px;
  color: #3182f6;
  font-weight: 700;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  padding: 16px 16px;
}
.btn {
  background-color: #ededed;
}
.slides {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
