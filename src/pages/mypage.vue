<template>
  <q-page>
    <q-card class="q-pa-md q-mx-auto q-my-lg profile-card" flat bordered>
      <div class="text-center">
        <q-toolbar-title class="title q-mb-md">
          {{ userInfo.nickname }}님의 정보
        </q-toolbar-title>
        <q-separator dark class="q-my-md" />

        <!-- 가입한지 며칠 지났는지 표시 -->
        <q-card-section>
          <p class="q-mb-md">
            저의 서비스와 함께 한 지
            <strong>{{ daysSinceJoined }}일</strong> 입니다
          </p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-mt-md">
          <q-card-section v-if="change">
            <div class="nickname-change-section">
              <label class="nickname-label">변경할 닉네임</label>
              <input
                v-model="newUserNickName"
                class="nickname-input"
                placeholder="새 닉네임 입력"
              />
            </div>
            <div class="button-group">
              <q-btn color="primary" class="save-btn" @click="changeNickname">
                저장
              </q-btn>
              <q-btn
                color="negative"
                class="cancel-btn"
                @click="change = false"
              >
                취소
              </q-btn>
            </div>
          </q-card-section>

          <q-btn
            v-if="!change && !leave"
            color="primary"
            class="change-btn"
            @click="change = true"
          >
            닉네임 변경
          </q-btn>
        </q-card-actions>

        <q-card-actions align="center" v-if="!change">
          <q-card-section v-if="leave">
            <p>
              탈퇴를 하시게 되면 더 이상 저희 서비스의 모든 기능을 이용하실 수
              없습니다. <br />
              탈퇴 후에는 회원으로서의 모든 혜택이 사라지며, 그동안의 이용 기록
              및 설정, 맞춤형 추천, 저장된 데이터가 영구적으로 삭제됩니다.
              <br />
              또한, 다시 회원가입을 하더라도 기존의 데이터를 복구할 수 없으며,
              저희가 제공하는 다양한 업데이트 및 혜택도 더 이상 받을 수 없게
              됩니다. <br />
              저희 서비스는 회원님께 보다 나은 경험을 제공하기 위해 노력하고
              있으니, 한 번 더 신중하게 결정해주시길 바랍니다. <br />
              정말로 탈퇴를 진행하시겠습니까?
            </p>
            <div class="button-group">
              <q-btn color="primary" class="cancel-btn" @click="leave = false">
                취소
              </q-btn>
              <q-btn color="negative" class="save-btn" @click="deactivate">
                탈퇴
              </q-btn>
            </div>
          </q-card-section>

          <q-btn
            v-if="!leave"
            color="negative"
            class="deactivate-btn"
            @click="leave = true"
          >
            탈퇴하기
          </q-btn>
        </q-card-actions>
      </div>
    </q-card>
    <q-card></q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userInfoService } from 'src/services/userAuth'; // 분리한 서비스 파일
import { useRouter } from 'vue-router'; // 라우터 가져오기

const userInfo = ref({});
const daysSinceJoined = ref(null);

onMounted(async () => {
  await fetchUserInfo(); // 사용자 정보 가져오기
  calculateDaysSinceJoined(); // 가입 날짜 계산
});

// 사용자 정보 패치 로직
const fetchUserInfo = async () => {
  try {
    userInfo.value = await userInfoService.fetchInfo();
  } catch (error) {}
};

// 사용자 가입일 계산 로직
const calculateDaysSinceJoined = () => {
  if (userInfo.value.createAt) {
    daysSinceJoined.value = userInfoService.calculateDaysSinceJoined(
      userInfo.value.createAt,
    );
  }
};

// 사용자 닉네임 변경 로직
const change = ref(false);
const newUserNickName = ref('');
const changeNickname = async () => {
  try {
    change.value = true;
    if (newUserNickName.value) {
      await userInfoService.changeNicknameUser(newUserNickName.value);
      alert('닉네임이 변경 되었습니다.');
      newUserNickName.value = '';
      change.value = false;
      fetchUserInfo();
    }
  } catch (error) {
    console.error(error);
  }
};

const router = useRouter(); // 라우터 사용 준비
// 탈퇴 요청 로직
const leave = ref(false);
const deactivate = async () => {
  // 사용자에게 탈퇴 경고 메시지를 표시
  const confirmation = confirm(
    '탈퇴 시 더 이상 우리 서비스를 사용할 수 없습니다. \n정말로 탈퇴하시겠습니까 ? ',
  );
  if (!confirmation) {
    // 사용자가 탈퇴를 취소한 경우
    return;
  }
  try {
    await userInfoService.deactivateUser();
    alert('탈퇴 되었습니다.');
    router.push('/home');
  } catch (error) {
    alert('탈퇴가 실패 되었습니다.');
    router.push('/home');
    console.error('탈퇴 요청 실패:', error);
  }
};
</script>

<style scoped>
.profile-card {
  max-width: 400px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nickname-change-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nickname-label {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.nickname-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* 버튼 간격을 조정 */
  width: 100%;
}

.save-btn,
.cancel-btn {
  width: 100%;
  margin-top: 10px;
}

.change-btn {
  width: 100%;
  margin-top: 15px;
}

.deactivate-btn {
  width: 100%;
  margin-top: 10px;
}

.q-card-section {
  margin-bottom: 15px;
}
</style>
