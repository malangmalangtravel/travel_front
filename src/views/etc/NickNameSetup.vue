<template>
  <div class="container">
    <h2>닉네임 만들기</h2>
    <form @submit.prevent="submitNickName">
      <div class="mb-3">
        <label for="nickName" class="form-label">닉네임을 만들어주세요.</label>
        <input type="text" class="form-control" id="nickName" v-model="nickName" required>
      </div>
      <button type="submit" class="btn btn-primary">저장</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'; // axios import

export default {
  data() {
    return {
      nickName: '',  // 사용자 입력을 바인딩할 변수
    };
  },
  async mounted() {
    try {
      // Vuex에서 세션 정보를 가져오는 액션 호출
      await this.fetchMemberInfo();
    } catch (error) {
      // 세션 정보를 가져오는 도중 에러가 발생했을 때 처리
      console.error('Failed to fetch member info:', error);
    }
  },
  methods: {
    // Vuex에서 세션 정보를 가져오는 액션 호출
    async fetchMemberInfo() {
      await this.$store.dispatch('fetchMemberInfo');
    },

    // 닉네임을 서버로 전송하는 메서드
    async submitNickName() {
      const sessionMember = this.$store.getters.getMemberInfo;

      if (!sessionMember || !sessionMember.email) {
        return this.handleError('세션 정보가 없습니다.');
      }

      // 사용자 입력한 nickName을 sessionMember.nickName에 설정
      sessionMember.nickName = this.nickName;

      const requestData = {
        nickName: sessionMember.nickName,
        email: sessionMember.email
      };

      try {
        const response = await axios.post(`${process.env.VUE_APP_SERVER_URL}/api/member/updateNickName`, requestData, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
          console.log('닉네임이 성공적으로 업데이트되었습니다.');
          this.redirectToHome();
        }
      } catch (error) {
        this.handleAxiosError(error);
      }
    },

    // 홈 페이지로 리디렉션하는 메서드
    redirectToHome() {
      setTimeout(() => {
        this.$router.push('/'); // 1초 뒤에 홈 페이지로 리디렉션
      }, 1000); // 1초 뒤에 실행
    },

    // 에러를 처리하는 메서드
    handleError(message) {
      alert(message);
      console.error(message);
    },

    // Axios 요청 중 발생한 에러를 처리하는 메서드
    handleAxiosError(error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // 중복된 닉네임 오류 메시지 표시
      } else {
        alert('닉네임 업데이트에 실패했습니다. 다시 시도해주세요.');
        console.error('닉네임 업데이트 실패:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding-top: 20px;
}
</style>
