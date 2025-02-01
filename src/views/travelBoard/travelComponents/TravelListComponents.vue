<template>
  <div class="container">
    <slot name="search">
      <!-- 검색 및 글쓰기 영역 -->
      <div class="row">
        <div class="col-md-6">
          <button v-if="hasMemberInfo" type="button" class="btn btn-primary mb-3" style="float: left;" @click="fnWrite">글쓰기</button>
        </div>
        <div class="col-md-6">
          <div class="input-group mb-3">
            <select class="form-select" v-model="searchKey">
              <option value="">- 선택 -</option>
              <option value="nickName">작성자</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <input type="text" class="form-control" v-model="searchValue" @keyup.enter="fnPage()">
            <button class="btn btn-outline-secondary" type="button" @click="fnPage()">검색</button>
          </div>
        </div>
      </div>
    </slot>

    <h2>{{ title }}</h2> <!-- 페이지마다 다른 제목 표시 -->

    <!-- 게시판 리스트 테이블 -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col" style="width: 60%;">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">등록일시</th>
          <th scope="col">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, id) in travelList" :key="id">
          <td>{{ row.id }}</td>
          <td style="width: 60%; max-width: 0;">
            <a @click="onPostClicked(row)" style="cursor: pointer; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis;">{{ row.title }}</a>
          </td>
          <td>{{ row.nickName }}</td>
          <td>{{ row.createDate }}</td>
          <td>{{ row.viewCount }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이징 영역 -->
    <div class="pagination d-flex justify-content-center" v-if="paging.totalListCnt > 0">
      <ul class="pagination">
        <!-- 이전, 다음 버튼 구현 -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '게시판' // 기본값 설정
    }
  },
  data() {
    return {
      travelList: [],
      paging: {
        // 페이징 데이터 초기화
      },
      page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      size: this.$route.query.size ? parseInt(this.$route.query.size) : 10,
      searchKey: this.$route.query.sk || '',
      searchValue: this.$route.query.sv || '',
    };
  },
  mounted() {
    this.fnGetList();
  },
  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    },
    hasMemberInfo() {
      return !!this.memberInfo;
    }
  },
  methods: {
    fnGetList() {
      this.$axios.get(this.apiUrl, {
        params: {
          sk: this.searchKey,
          sv: this.searchValue,
          page: this.page,
          size: this.size
        }
      }).then((res) => {
        if (res.data.resultCode === "OK") {
          this.travelList = res.data.data;
          this.paging = res.data.pagination;
        }
      }).catch((err) => {
        if (err.message.includes('Network Error')) {
          alert('네트워크 오류입니다. 다시 시도해 주세요.');
        }
      });
    },
    fnPage(n) {
      if (this.page !== n) {
        this.page = n;
        this.fnGetList();
      }
    },
    onPostClicked(row) {
      this.$router.push({ path: '../travelBoard/travelDetail', query: { id: row.id } });
      this.increaseViewCount(row.id);
    },
    increaseViewCount(id) {
      this.$axios.put(`${this.$serverUrl}/api/travel/travelBoard/increaseViewCount/${id}`).then(() => {
        console.log('조회수 증가');
      }).catch(err => {
        console.error('조회수 증가 오류', err);
      });
    },
  }
}
</script>
