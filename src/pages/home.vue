<template>
  <q-page class="q-pa-md flex flex-center" style="min-height: 700px">
    <div class="row justify-center q-col-gutter-md" style="max-width: 1080px">
      <div class="col-6 col-md-8">
        <q-card flat class="q-pa-md text-left">
          <q-card-section>
            <div class="text-h4">경상국립대 컴공 신입생의 첫걸음</div>
            <div class="text-subtitle1" style="margin: 20px 0">
              복습에서부터 성공까지, 당신을 안내합니다.
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pt-none" style="margin: 20px 0">
            <p>
              신입생 여러분을 위한 최적의 복습 가이드를 제공합니다. 여러분의
              컴퓨터 공학 여정을 지원하며, 성공적인 학습 결과를 위한 모든 자료를
              한눈에 확인할 수 있습니다.
            </p>
            <p>
              저희의 플랫폼에서는 다양한 학습 자료를 제공하며, 여러분이 공부를
              시작하고 발전할 수 있도록 돕습니다. 필요한 정보와 도구들을 쉽게
              찾을 수 있으며, 성공적인 학습을 위한 리소스들을 제공합니다.
              함께하여 여러분의 컴퓨터 공학 학습을 성공적으로 이끌어 나가는 데
              도움이 되는 것이 우리의 목표입니다. 함께 여행을 시작해 봅시다!
            </p>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-4">
        <img src="/gnu.jpeg" class="full-width" alt="경상국립대 이미지" />
      </div>
    </div>
  </q-page>
  <div class="down">
    <a href="#" class="link-wrapper">
      <div class="img-wrapper">
        <img src="/apple-logo.png" />
      </div>
      <div class="content-wrapper">
        <h6>App Store</h6>
      </div>
    </a>

    <a href="#" class="link-wrapper">
      <div class="img-wrapper">
        <img src="/google-play.png" />
      </div>
      <div class="content-wrapper">
        <h6>Google Play</h6>
      </div>
    </a>
  </div>
</template>

<script setup>
// 필요한 스크립트를 여기에 추가
</script>

<style>
.text-subtitle1 {
  font-size: 20px;
}
.q-pt-none {
  font-size: 16px;
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

.link-wrapper {
  background: #111;
  color: #e1e1e1 !important;
  width: 200px;
  height: 60px;
  text-decoration: none;
  padding: 28px 16px;
  border-radius: 4px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 30px;
}

.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 400px;
}

.content-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-left: 18px;
  flex-direction: column;
  width: 200px;
}
/* 반응형 디자인을 위한 추가 스타일 */
@media (max-width: 768px) {
  .q-card {
    margin-bottom: 20px;
  }
}
</style>
