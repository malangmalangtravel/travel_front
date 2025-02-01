import { createStore } from 'vuex';
import axios from 'axios';
import { convertKeysToCamelCase } from '@/vuex/convertToCamel';

const store = createStore({
  state() {
    return {
      memberInfo: null // 초기에는 회원 정보가 없음
    };
  },
  mutations: {
    setMemberInfo(state, memberInfo) {
      state.memberInfo = memberInfo;
    }
  },
  actions: {
    fetchMemberInfo({ commit }) {
      return new Promise((resolve, reject) => {
        // 세션 정보를 가져오는 API 엔드포인트 설정
        const apiUrl = `${process.env.VUE_APP_SERVER_URL}/api/member/memberInfo`;

        // Axios를 사용하여 세션 정보 요청
        axios.get(apiUrl, { withCredentials: true }) // withCredentials 옵션을 통해 쿠키를 전달

          .then(response => {
            // 성공적으로 데이터를 받아왔을 때 처리
            const transformedData = convertKeysToCamelCase(response.data);
            commit('setMemberInfo', transformedData);
            resolve(transformedData); // Promise resolve
          })
          .catch(error => {
            console.error('Failed to fetch member info:', error);
            reject(error); // Promise reject
          });
      });
    }
  },
  getters: {
    getMemberInfo(state) {
      return state.memberInfo;
    }
  }
});

export default store;

// Vue Router를 이용한 페이지 이동 로직을 추가
import router from '@/router'; // Vue Router 인스턴스를 가져옴

store.watch(
  (state, getters) => getters.getMemberInfo,
  (newMemberInfo) => {
    // newMemberInfo가 존재하고, nickName이 null 또는 공백이면 NickNameSetup 페이지로 리디렉션
    if (newMemberInfo && (!newMemberInfo.nickName || newMemberInfo.nickName.trim() === '')) {
      router.push('/etc/NickNameSetup');
    }
  }
);