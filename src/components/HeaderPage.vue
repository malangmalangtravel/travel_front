<template>
  <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="logo-container">
        <router-link to="/">
          <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fl5Ocm%2Fbtrz0uMdgTY%2FKF29pRts2VFHtN4NocXZK0%2Fimg.png" alt="logo" width="50" height="50">
        </router-link>
      </div>

      <ul class="nav nav-pills">
        <li class="nav-item"><router-link to="/" class="nav-link" aria-current="page">메인</router-link></li>

        <!-- 여행 메뉴 -->
        <li class="nav-item position-relative" @mouseenter="showTravelDropdown = true" @mouseleave="showTravelDropdown = false">
          <router-link to="/travelBoard/kor/travelInfoList" class="nav-link">여행</router-link>
          <ul v-if="showTravelDropdown" class="travel-dropdown-menu">
            <li v-for="country in countries" :key="country.id">
              <router-link :to="`/travelBoard/${country.country_code}/travelInfoList`" class="travel-dropdown-item" :countryName="country.country_name">
                {{ country.country_name }}
              </router-link>
            </li>
          </ul>
        </li>

        <li class="nav-item"><router-link to="/humorBoard/HumorList" class="nav-link">유머</router-link></li>
        <li class="nav-item"><router-link to="/" class="nav-link">핫딜</router-link></li>
        <li class="nav-item"><a href="#" class="nav-link">공지사항</a></li>
        <li class="nav-item"><a href="#" class="nav-link">고객센터</a></li>
      </ul>

      <div class="col-md-3 text-end">
        <div v-if="!memberInfo">
          <button class="btn btn-outline-primary me-2" @click="redirectToGoogleAuth">구글 로그인</button>
        </div>
        <div v-else class="dropdown text-end">
          <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="memberInfo.picture" alt="mdo" width="40" height="40" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
            <li><a class="dropdown-item">이메일 : {{ memberInfo.email }}</a></li>
            <li><a class="dropdown-item">닉네임: {{ memberInfo.nickName || '닉네임 없음' }}</a></li>
            <li><a class="dropdown-item" href="#">내정보</a></li>
            <li><a class="dropdown-item" @click="redirectToGoogleLogout">로그아웃</a></li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showTravelDropdown: false,
      countries: [],
    };
  },
  async mounted() {
    this.fetchCountries();
    this.$store.dispatch("fetchMemberInfo")
      .then(() => {
        console.log("Member Info:", this.$store.getters.getMemberInfo);
      })
      .catch((error) => {
        console.error("Failed to fetch member info:", error);
      });
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}/api/countries`);
        console.log("API 응답 데이터:", response.data);  // 응답 로그 추가
        this.countries = response.data;
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    },
    redirectToGoogleAuth() {
      window.location.href = `${process.env.VUE_APP_SERVER_URL}/oauth2/authorization/google`;
    },
    redirectToGoogleLogout() {
      window.location.href = `${process.env.VUE_APP_SERVER_URL}/logout`;
    },
  },
  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    },
  },
};
</script>

<style>
/* 드롭다운 메뉴 스타일 */
.travel-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 120px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.travel-dropdown-item {
  padding: 8px 12px;
  display: block;
  color: black;
  text-decoration: none;
  white-space: nowrap;
}

.travel-dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>
