<template>
  <div class="board-container">
    <!-- 게시판 선택 -->
    <div class="board-selector">
      <button @click="fetchhumorList('humor', 1)" :class="{'active': currentBoardCode === 'humor'}">유머 게시판</button>
      <button @click="fetchhumorList('ssul', 1)" :class="{'active': currentBoardCode === 'ssul'}">썰 게시판</button>
    </div>

    <!-- 로그인된 사용자만 글쓰기 버튼 표시 -->
    <div class="write-button" v-if="hasMemberInfo">
      <button @click="navigateToWritePage" class="btn btn-primary mb-3">글쓰기</button>
    </div>

    <!-- 게시판 리스트 -->
    <div v-if="humorList && humorList.length > 0" class="board-list">
      <ul>
        <li class="board-header">
          <div class="board-row">
            <span class="board-id">No</span>
            <span class="board-title">제목</span>
            <span class="board-nick-name">닉네임</span>
            <span class="board-create-date">날짜</span>
            <span class="board-views">조회수</span>
          </div>
        </li>
        <li v-for="board in humorList" :key="board.id" :class="['board-item', { 'highlight': board.id === currentBoardId }]">
          <router-link :to="`/humorBoard/humorDetail/${board.id}?boardCode=${board.boardCode}`" class="board-link">
            <div class="board-row-data">
              <span class="board-id">{{ board.id }}</span>
              <span class="board-title">{{ board.title }}</span>
              <span class="board-nick-name">{{ board.nickName }}</span>
              <span class="board-create-date">{{ board.createDate }}</span>
              <span class="board-views">{{ board.viewCount }}</span>
            </div>
          </router-link>
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <div class="pagination" v-if="paging.totalListCnt > 0">
        <button @click="fetchhumorList(currentBoardCode, 1)" :disabled="paging.page === 1" class="pagination-btn">처음</button>
        <button @click="fetchhumorList(currentBoardCode, Math.max(paging.page - 1, 1))" :disabled="paging.page === 1" class="pagination-btn">이전</button>

        <!-- 페이지 버튼 목록 1~10 -->
        <div class="page-buttons">
          <button
            v-for="page in getPageRange()"
            :key="page"
            :class="['pagination-btn', { 'active': paging.page === page, 'disabled': paging.page === page }]"
            :disabled="paging.page === page"
            @click="fetchhumorList(currentBoardCode, page)">
            {{ page }}
          </button>
        </div>

        <button @click="fetchhumorList(currentBoardCode, Math.min(paging.page + 1, paging.totalPageCnt))" :disabled="paging.page === paging.totalPageCnt" class="pagination-btn">다음</button>
        <button @click="fetchhumorList(currentBoardCode, paging.totalPageCnt)" :disabled="paging.page === paging.totalPageCnt" class="pagination-btn">마지막</button>
      </div>

      <!-- 검색 기능 -->
      <div class="search-bar mb-4">
        <div class="input-group">
          <select v-model="searchKey" class="form-select">
            <option value="">- 선택 -</option>
            <option value="nickName">작성자</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
            type="text"
            class="form-control"
            v-model="searchValue"
            placeholder="검색어 입력"
            @keyup.enter="fetchhumorList(currentBoardCode, 1)"
          />
          <button class="btn btn-outline-secondary" @click="fetchhumorList(currentBoardCode, 1)">검색</button>
        </div>
      </div>

    </div>

    <div v-else class="no-boards">
      <p>게시글이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    currentBoardId: { // 부모에서 현재 상세보는 게시글 ID를 전달받습니다.
      type: Number,
      default: null
    },
    initialBoardCode: {
      type: String,
      default: 'humor'
    }
  },
  data() {
    return {
      humorList: [],
      paging: {
        page: 1,
        totalListCnt: 0,
        totalPageCnt: 0,
        pageSize: 10,
      },
      currentBoardCode: this.initialBoardCode,
      searchKey: '',
      searchValue: '',
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth <= 768;
    },
    hasMemberInfo() {
      return !!this.$store.getters.getMemberInfo;
    }
  },
  methods: {
    async fetchhumorList(boardCode, page = 1) {
      this.currentBoardCode = boardCode;
      this.paging.page = page;

      try {
        const response = await axios.get(`${process.env.VUE_APP_SERVER_URL}/api/humor/${boardCode}Board/list`, {
          params: {
            page,
            size: this.paging.pageSize,
            sk: this.searchKey,
            sv: this.searchValue,
          }
        });

        this.humorList = response.data.data;
        this.paging.totalListCnt = response.data.pagination.totalListCnt;
        this.paging.totalPageCnt = response.data.pagination.totalPageCnt;
        this.paging.page = response.data.pagination.page;
      } catch (error) {
        console.error('게시글 목록을 불러오는 데 실패했습니다:', error);
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    navigateToWritePage() {
      this.$router.push({ path: './humorWrite' });
    },

    // 페이지 버튼을 1~10 범위로 설정
    getPageRange() {
      // 1~5 페이지만 표시하도록 설정
      const startPage = 1;
      const endPage = Math.min(5, this.paging.totalPageCnt);
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.fetchhumorList(this.initialBoardCode, 1);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style scoped>
.board-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}

.board-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.board-selector button {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.board-selector button:hover {
  background-color: #ddd;
}

.board-selector .active {
  background-color: #3498db;
  color: white;
}

.write-button {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.write-button .btn {
  background-color: #3498db;
  color: white;
}

.search-bar {
  margin-top: 20px;
}

.search-bar .input-group {
  display: flex;
  justify-content: space-between;
}

.search-bar .form-control {
  flex: 1;
  margin-right: 10px;
}

.search-bar .btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.board-list ul {
  list-style: none;
  padding: 0;
}

.board-item {
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.board-item:hover {
  transform: translateY(-5px);
}

.board-link {
  display: block;
  padding: 15px;
  text-decoration: none;
  color: #333;
  scroll-behavior: smooth;
}

.board-header {
  background-color: #f0f0f0; /* 배경색 */
}

.board-row, .board-row-data {
  display: grid;
  grid-template-columns: 0.8fr 5fr 1.2fr 1.7fr 0.7fr; /* 각 항목의 비율 설정 */
  gap: 8px; /* 각 항목 간의 간격 */
  align-items: center;
  font-size: 0.8rem;
  padding: 10px;
}

.board-row span, .board-row-data span {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.board-id {
  text-align: center;
  font-weight: bold;
}

.board-title {
  font-weight: bold;
}

.board-nick-name, .board-create-date, .board-views {
  text-align: center;
}

.board-item.highlight .board-row-data {
  color: blue; /* 게시글 상세 조회 id와 같으면 제목 색을 파란색으로 변경 */
  background-color: #f0f0f0;  /* 연한 회색 배경 */
  font-weight: bold;
  font-size: 1.2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 10px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.pagination-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-btn:hover {
  background-color: #2980b9;
}

.pagination-text {
  font-size: 1rem;
  color: #333;
}

.no-boards {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}

/* 모바일 화면에서 번호와 제목만 표시 */
@media (max-width: 768px) {
  .board-row, .board-row-data {
    grid-template-columns: 0.5fr 2.5fr; /* 번호와 제목만 표시 */
  }

  /* 닉네임, 날짜, 조회수 숨김 */
  .board-nick-name,
  .board-create-date,
  .board-views {
    display: none; /* 모바일에서 숨김 */
  }

  .board-id {
    font-size: 0.8rem; /* 작은 화면에서 번호 폰트 크기 축소 */
    text-align: center;
  }

  .board-title {
    font-size: 1.1rem !important; /* 제목 폰트 크기 유지 */
  }
}
</style>