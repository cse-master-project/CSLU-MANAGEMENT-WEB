<template>
  <q-page
    class="q-pa-md flex flex-center"
    style="
      font-family: 'Toss Product Sans';
      justify-content: center;
      align-items: center;
    "
  >
    <div class="row justify-center q-col-gutter-md" style="max-width: 1280px">
      <div class="col-12 col-md-8">
        <q-card flat class="q-pa-md text-left" style="border: none">
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
              <br />컴퓨터공학 분야에서 더 큰 성장을 이룰 수 있도록 지원합니다.
            </p>
            <!-- <p style="line-height: 1.7">
              저희의 플랫폼에서는 다양한 학습 자료를 제공하며, 여러분이 공부를
              시작하고 발전할 수 있도록 돕습니다. 필요한 정보와 도구들을 쉽게
              찾을 수 있으며, 성공적인 학습을 위한 리소스들을 제공합니다.
              함께하여 여러분의 컴퓨터 공학 학습을 성공적으로 이끌어 나가는 데
              도움이 되는 것이 우리의 목표입니다. 함께 여행을 시작해 봅시다!
            </p> -->
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
      <div class="col-12 col-md-4">
        <img src="/gnu.jpg" class="full-width" alt="경상국립대 이미지" />
      </div>
    </div>
  </q-page>
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
  padding: 16px 16px;
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
  background-color: rgba(0, 12, 30, 0.8);
  color: white;
  text-transform: none;
  font-family: 'Toss Product Sans';
  font-weight: 600;
  border-radius: 7px;
  padding: 11px 22px;
  font-size: 17px;
  margin-top: 5%; /* 버튼과 카드 내용 사이의 간격 조절 */
}
.gp img {
  height: 16px; /* 이미지 높이 조절 */
  width: auto; /* 이미지 비율 유지 */
  vertical-align: middle; /* 텍스트와 이미지 수직 정렬 */
  margin-right: 8px; /* 텍스트와 이미지 간격 */
}
.gp:hover {
  background-color: rgb(78, 89, 104);
  color: rgb(255, 255, 255);
}
/* 반응형 디자인을 위한 추가 스타일 */
@media (max-width: 768px) {
  .q-card {
    margin-bottom: 20px;
  }
}
</style>
