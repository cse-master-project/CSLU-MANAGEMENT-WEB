<template>
  <q-page class="q-pa-md" style="font-family: 'Toss Product Sans'">
    <div class="container" style="width: 90%">
      <section
        v-for="(section, index) in sections"
        :key="index"
        :ref="'section' + index"
        class="section"
      >
        <!--타이틀-->
        <q-card flat class="q-pa-md text-left" style="border: none">
          <q-card-section>
            <div class="section-title">
              {{ section.title }}
            </div>
          </q-card-section>
          <!--사진 및 내용-->
          <q-card-section class="q-pt-none" style="margin: 3% 0">
            <p style="line-height: 1.7; font-weight: 600; font-size: 23px">
              {{ section.content }}
            </p>
            <div v-if="section.image">
              <img
                :src="section.image"
                :alt="section.title"
                class="full-width"
              />
            </div>
          </q-card-section>
        </q-card>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // Vue 컴포넌트에서 필요한 함수들을 가져옵니다.

// 섹션 내용
// sections 변수는 각 섹션의 제목, 내용, 이미지 URL을 포함하는 객체 배열입니다.
const sections = ref([
  {
    title: '문제 유형 선택',
    content:
      '원하는 문제 유형을 선택하여 시작해 보세요! 아래와 같은 문제 유형이 있습니다.',
    image: 'https://via.placeholder.com/800x400.png?text=First+Section+Image',
  },
  {
    title: '과목 및 챕터 선택',
    content:
      '문제 유형을 선택하셨다면, 다음으로는 과목과 해당 과목의 챕터를 선택하세요.',
    image: 'https://via.placeholder.com/800x400.png?text=Second+Section+Image',
  },
  {
    title: '문제 입력',
    content:
      '이제 선택한 유형과 과목에 맞게 문제를 작성해 보세요. 문제의 난이도와 형식을 고려하여 작성해 주세요.',
    image: 'https://via.placeholder.com/800x400.png?text=Third+Section+Image',
  },
  {
    title: '정답 및 해설 입력',
    content:
      '마지막으로, 작성한 문제에 대한 정답과 해설을 입력해 주세요. 명확한 해설은 학습자의 이해를 도울 수 있습니다.',
    image: 'https://via.placeholder.com/800x400.png?text=Fourth+Section+Image',
  },
]);

const observer = ref(null);

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
  sections.value.forEach((section, index) => {
    const element = document.querySelector(`.section:nth-child(${index + 1})`);
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

.section {
  margin-bottom: 50px;
  opacity: 0;
  animation: none;
  width: 100%;
  min-height: 800px;
}

.section.active {
  animation: fadeInUp 1.3s ease-in-out forwards;
}

.full-width {
  width: 50%;
  height: auto;
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
</style>
