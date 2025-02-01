<template>
  <section class="py-1 text-center container">
    <div class="row py-lg-1">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">여행</h1>
        <p class="lead text-muted">여행 정보 공유 사이트</p>
      </div>
    </div>
  </section>

  <!-- 나라 리스트 -->
  <div class="album py-5 bg-body-tertiary">
    <div class="container">

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div class="col" v-for="country in countries" :key="country.id">
          <div class="card shadow-sm">
            <!-- 실제 이미지가 있으면 보여줌 -->
            <img v-if="country.locationImg" :src="country.locationImg" alt="Country Image" class="bd-placeholder-img card-img-top" width="100%" height="225">
            <!-- 실제 이미지가 없으면 기본 SVG 플레이스홀더를 보여줌 -->
            <svg v-else class="bd-placeholder-img card-img-top" width="100%" height="225"
                xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 한국" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>한국</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">No Picture</text>
            </svg>
            <div class="card-body">
              <p class="card-text">{{ country.countryName }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-body-secondary">여행하러 가기</small>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <!-- 나라 리스트 -->

</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      countries: [],
    };
  },
  mounted() {
    this.fetchCountries();
  },
  methods: {
    async fetchCountries() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}/api/countries`);
        this.countries = response.data;
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    },
  },
};
</script>
