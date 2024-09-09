<template>
  <q-page
    class="q-pa-md flex flex-center"
    style="
      font-family: 'Toss Product Sans';
      justify-content: center;
      align-items: center;
    "
  >
    <div class="background-slider">
      <div
        class="row justify-center q-col-gutter-md"
        style="width: 1280px; height: 100vh; display: flex; align-items: center"
      >
        <div class="col-12 col-md-8">
          <q-card flat class="q-pa-md text-left transparent-card">
            <q-card-section>
              <div class="text-h4" style="font-weight: bold">
                경상국립대 컴공 신입생의 첫걸음
                <p style="color: blue">Computer Science Level Up</p>
              </div>
              <div class="text-subtitle1" style="margin: 3% 0">
                CSLU는 경상국립대 컴공 신입생을 위한 애플리케이션입니다.
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pt-none" style="margin: 3% 0">
              <p style="line-height: 1.7">
                CSLU는 컴퓨터 공학 신입생을 위한 문제 제작 및 풀이 서비스를
                제공합니다. <br />우리의 기술과 도구로 학습의 모든 가능성을
                연결합니다. <br />사용자와 함께 다가오는 미래를 앞서 준비하고,
                <br />컴퓨터공학 분야에서 더 큰 성장을 이룰 수 있도록
                지원합니다.
              </p>
            </q-card-section>
            <q-btn class="gp">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
                alt="Google Play Logo"
              />
              Google Play
            </q-btn>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const images = [
  'https://co1127.shiningcorp.com/sh_img/index/main_banner/main_img1.jpg',
  'https://co1127.shiningcorp.com/sh_img/index/main_banner/main_img2.jpg',
  'https://co1127.shiningcorp.com/sh_img/index/main_banner/main_img3.jpg',
];

let currentImageIndex = 0;

const changeBackgroundImage = () => {
  const backgroundSlider = document.querySelector('.background-slider');
  backgroundSlider.style.backgroundImage = `url(${images[currentImageIndex]})`;
  currentImageIndex = (currentImageIndex + 1) % images.length;
};

onMounted(() => {
  changeBackgroundImage();
  setInterval(changeBackgroundImage, 5000); // Change image every 5 seconds
});
</script>

<style>
.background-slider {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;
}

.transparent-card {
  background: transparent;
  color: white;
}

.text-h4 {
  color: white;
}

.text-subtitle1 {
  font-size: 20px;
  color: white;
}

.q-pt-none {
  font-size: 16px;
  padding: 16px 16px;
  color: white;
}

.full-width {
  width: 100%;
  height: auto;
}

.down {
  display: flex;
}

.img-wrapper {
  width: 48px;
  display: flex;
  align-items: center;
}

img {
  width: 80%;
}

.gp {
  background-color: rgb(229, 232, 236);
  color: black;
  text-transform: none;
  font-family: 'Toss Product Sans';
  font-weight: 600;
  border-radius: 7px;
  padding: 11px 22px;
  font-size: 17px;
  margin-top: 5%;
}

.gp img {
  height: 16px;
  width: auto;
  vertical-align: middle;
  margin-right: 8px;
}

.gp:hover {
  background-color: rgba(125, 125, 126, 0.8);
  color: white;
}

@media (max-width: 768px) {
  .q-card {
    margin-bottom: 20px;
  }
}
</style>
