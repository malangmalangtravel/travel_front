import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './vuex/store' // Vuex Store 모듈 import
import { convertKeysToCamelCase } from './vuex/convertToCamel';
import { createMetaManager } from 'vue-meta';

const app = createApp(App)
app.config.globalProperties.$axios = axios;  //전역변수로 설정 컴포넌트에서 this.$axios 호출할 수 있음
app.use(router);
app.use(store);
app.use(createMetaManager()); // Vue Meta 플러그인 사용
app.mount('#app');


// Axios 응답 인터셉터 설정
axios.interceptors.response.use(response => {
  if (response.data) {
    // 데이터가 존재하고 객체일 때만 변환 수행
    if (typeof response.data === 'object') {
      const transformedData = convertKeysToCamelCase(response.data); // Transform data
      return { ...response, data: transformedData }; // Return new response with transformed data
    }
  }
  return response;
}, error => {
  return Promise.reject(error); // 에러 전달: Promise.reject를 사용하여 에러를 다음 핸들러로 전달합니다.
});

export default axios; // 수정된 Axios 인스턴스를 모듈에서 기본으로 내보냅니다.