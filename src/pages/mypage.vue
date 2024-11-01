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
              탈퇴를 하시게 되면<br />
              더 이상 저희 서비스의 모든 기능을 이용하실 수 없습니다. <br />
              탈퇴 후에는 회원으로서의 혜택과 이용 기록이 일시적으로
              비활성화됩니다.<br /><br />

              저희 서비스에서는 회원님께만 제공되는 다양한 기능과 <br />
              맞춤형 경험을 제공하고 있습니다. <br />
              탈퇴 후에도 언제든지 다시 가입하여 현재까지의 기록을 복원하고<br />
              계속해서 혜택을 누리실 수 있습니다.<br /><br />

              혹시 서비스 이용 중 불편한 점이 있었나요? <br />
              개선이 필요한 부분이 있다면, 저희가 도와드릴 수 있습니다. <br />
              회원님의 의견을 듣고 더 나은 서비스를 제공할 수 있도록
              노력하겠습니다.<br /><br />

              한 번 더 신중하게 결정해주시길 바랍니다. <br />
              정말로 탈퇴를 진행하시겠습니까?<br /><br />
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userInfoService } from 'src/services/auth/userAuth'; // 분리한 서비스 파일
import { useRouter } from 'vue-router'; // 라우터 가져오기
import { Notify } from 'quasar';

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
      Notify.create({
        message: '닉네임이 변경되었습니다.',
        color: 'primary',
        position: 'center', // 중앙 띄우기
        timeout: 500, // 1초
      });
      newUserNickName.value = '';
      change.value = false;
      fetchUserInfo();
    }
  } catch (error) {}
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

    router.push('/home');
  } catch (error) {
    router.push('/home');
  }
};
</script>

<style scoped>
.profile-card {
  max-width: 600px;
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
  width: 50%;
  margin-top: 15px;
}

.deactivate-btn {
  width: 50%;
  margin-top: 10px;
}

.q-card-section {
  margin-bottom: 15px;
}
@media (max-width: 500px) {
  .profile-card {
    margin: 3% 3%;
  }
}
</style>
