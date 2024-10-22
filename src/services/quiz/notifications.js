import { Notify } from 'quasar';

export function quizSuccessNotification() {
  Notify.create({
    message: '문제가 성공적으로 등록되었습니다.',
    color: 'positive',
    position: 'center', // 중앙 띄우기
    timeout: 2000,
  });
}
export function quizErrorNotification() {
  Notify.create({
    message: '입력 값을 확인해주세요.',
    color: 'negative',
    position: 'center',
    timeout: 2000,
  });
}

export function errorNotification() {
  Notify.create({
    message: '지금 서버에 문제가 있습니다. 잠시후 이용해주세요.',
    color: 'negative',
    position: 'center',
    timeout: 2000,
  });
}

//primary: 기본 색상
//secondary: 보조 색상
//accent: 강조 색상
//positive: 긍정적인 메시지 (보통 녹색 계열)
//negative: 부정적인 메시지 (보통 빨간색 계열)
//info: 정보성 메시지 (보통 파란색 계열)
//warning: 경고 메시지 (보통 주황색 계열)
