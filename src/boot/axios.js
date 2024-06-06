import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  // 기본 URL
  baseURL: 'http://203.232.193.164:8080',
  // 헤더 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// boot로 quasar 앱의 글로벌 속성으로 인스턴스 추가.
export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };
