<template>
  <div class="board-detail-container">
    <!-- 수정, 삭제, 신고 -->
    <div class="row">
      <div class="col-md-12">
        <!-- 세션 정보가 있고 이메일이 같은 경우에만 보이는 버튼 -->
        <div class="btn-group" role="group" aria-label="Button group">
          <button v-if="shouldDisplayButtons" type="button" class="btn btn-primary">수정</button>
          <button v-if="shouldDisplayButtons" type="button" class="btn btn-danger">삭제</button>
          <button type="button" class="btn btn-danger">게시물 신고</button>
        </div>
      </div>
    </div>

    <!-- 게시글 상세 카드 -->
    <div class="board-card">
      <h1 class="board-title" id="title" name="title">{{ boardDetail.title }}</h1>
      <div class="board-meta">
        <span class="meta-item">작성자: {{ boardDetail.nickName }}</span>
        <span class="meta-item">조회수: {{ boardDetail.viewCount }}</span>
        <span class="meta-item">작성일: {{ boardDetail.createDate }}</span>
      </div>
      <div class="board-content" id=content name="content">
        <!-- 애드센스 컨텐츠 상단 광고 -->
        <div>
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-1107226096880396"
               data-ad-slot="6457501361"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
        <div v-html="sanitizeContent(boardDetail.content)"></div>
        <!-- 애드센스 컨텐츠 하단 광고 -->
        <div>
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-1107226096880396"
               data-ad-slot="6457501361"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>
    </div>

    <!-- TravelList 컴포넌트에 현재 게시글 ID를 전달 -->
    <TravelList :currentBoardId="boardDetail.id" :initialBoardCode="'travel'" />

    <!-- 사이트 하단 고정 광고 -->
    <div class="bottom_ad">
      <!-- 애드센스 하단 메뉴 광고 -->
        <!-- 수평형 지정 -->
        <!--
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1107226096880396"
             data-ad-slot="6012089010"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>
        -->

      <!-- 애드핏 -->
      <ins class="kakao_ad_area" style="display:none;"
          data-ad-unit="DAN-rJHzRSsW6ZKje7Ak"
          data-ad-width="320"
          data-ad-height="50"></ins>
    </div>

    <!-- 다음, 이전 게시글 버튼 -->
    <div class="pagination-buttons-fixed">
      <!-- 이전 게시글 버튼(게시글 id가 +1씩) -->
      <router-link :to="nextBoardId ? `/travelBoard/travelDetail/${nextBoardId}?boardCode=${boardCode}` : ''">
        <button
          class="pagination-btn next-btn"
          :disabled="!nextBoardId">
          이전
        </button>
      </router-link>

      <!-- 다음 게시글 버튼(게시글 id가 -1씩) -->
      <router-link :to="previousBoardId ? `/travelBoard/travelDetail/${previousBoardId}?boardCode=${boardCode}` : ''">
        <button
          class="pagination-btn previous-btn" style="margin-right:50px;"
          :disabled="!previousBoardId">
          다음
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TravelList from './TravelList.vue';
import DOMPurify from 'dompurify';

export default {
  components: {
    TravelList,
  },
  data() {
    return {
      boardDetail: {},
      previousBoardId: null,
      nextBoardId: null,
      boardCode: '',
    };
  },

  // 메타 태그 설정
  metaInfo() {
    if (!this.boardDetail.title) {
      return {
        title: '말랑말랑트래블 - 게시글'
      };
    }

    const description = this.boardDetail.content ? this.boardDetail.content.substring(0, 160) : '';

    return {
      title: `${this.boardDetail.title} - 말랑말랑트래블`,
      meta: [
        { name: 'description', content: `${this.boardDetail.title} - ${description}` },
        { name: 'keywords', content: `${this.boardDetail.title}, 여행, 말랑말랑트래블, 말랑말랑 트래블, 말랑말랑트레블, 말랑말랑 트레블, 여행사이트, 스카이스캐너, 여행 추천, 일본여행, 베트남여행, 세계 여행, 재미있는 각종 유머글 모음 사이트, 유머 사이트 추천, 심심할 때, 유머 모음, 재밌는 글, 유머 게시판, 아프라카, 인터넷 방송, 뉴스, bj, 축구, 스타, 게임, 예능, 티비, tv, 야구, mlb, 음식, 먹방, 에펨, 펨코, 팸코, fmkorea, fm, 디시, 디시인사이드, dc, dcinside, 커뮤, 커뮤니티, 오유, 오늘의유머, 웃대, 웃긴대학, 짱공유, 고급유머, 깨글, 개그, gag, 9gag, 레딧, radit -동까유머` },
        { property: 'og:title', content: `${this.boardDetail.title} - 말랑말랑트래블` },
        { property: 'og:description', content: `${this.boardDetail.title} - ${description}` },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: this.boardDetail.image || require('@/assets/appicon(popup).png') },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: this.boardDetail.image || require('@/assets/appicon(popup).png') },
        { name: 'twitter:title', content: `${this.boardDetail.title} - 말랑말랑트래블` },
        { name: 'twitter:description', content: `${this.boardDetail.title} - ${description}` },
      ]
    };
  },

  methods: {
    async fetchBoardDetail(id) {
      const boardCode = this.$route.query.boardCode;
      this.boardCode = boardCode;

      try {
        const response = await axios.get(`${this.$serverUrl}/api/travel/${boardCode}Board/detail/${id}`);
        this.boardDetail = response.data;
        this.previousBoardId = response.data.previousBoardId;
        this.nextBoardId = response.data.nextBoardId;

        // 조회수 증가 API 호출
        this.incrementViewCount(id);

        // 탭에 제목 설정하기 - 게시글 제목을 가져와서 document.title을 설정
        if (this.boardDetail && this.boardDetail.title) {
          document.title = `${this.boardDetail.title} - 말랑말랑트래블`;
        } else {
          document.title = '말랑말랑트래블 - 게시글'; // 제목이 없는 경우 기본 제목 설정
        }
      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
      }
    },

    // 조회수 증가 함수
    async incrementViewCount(id) {
      const boardCode = this.$route.query.boardCode;
      this.boardCode = boardCode;

      try {
        await axios.post(`${this.$serverUrl}/api/travel/${boardCode}Board/incrementViewCount/${id}`);
        console.log('조회수 증가 완료');
      } catch (error) {
        console.error('조회수 증가 실패:', error);
      }
    },

    sanitizeContent(content) {
      return DOMPurify.sanitize(content);
    },
    loadAds() {
      // 애드핏 광고 초기화
      if (window.Kakao && window.Kakao.Ad) {
        window.Kakao.Ad.requestAd({ unit: 'DAN-Jg8NF50cbip1SULj' });
      }
    },
  },
  mounted() {
    const id = this.$route.params.id;
    this.fetchBoardDetail(id);
    this.loadAds();  // 광고 로드
  },
  beforeRouteUpdate(to, from, next) {
    const newId = to.params.id;
    this.fetchBoardDetail(newId);
    next();
  },
};
</script>

<style scoped>
.board-detail-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.board-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.board-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

.board-meta {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 20px;
}

.meta-item {
  margin-right: 20px;
}

.board-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 30px;
}

/* 이전, 다음 버튼 고정 스타일 */
.pagination-buttons-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  padding: 0px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.pagination-btn {
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.previous-btn {
  background-color: #007bff;
}

.previous-btn:hover {
  background-color: #0056b3;
}

.next-btn {
  background-color: #28a745;
}

.next-btn:hover {
  background-color: #218838;
}

/* 비활성화된 버튼 스타일 */
.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .board-detail-container {
    padding: 15px;
  }

  .board-title {
    font-size: 1.8rem;
    word-wrap: break-word;
    word-break: break-word;
  }

  .board-meta {
    font-size: 0.8rem;
  }

  .board-content {
    font-size: 1rem;
  }

  .pagination-btn {
    font-size: 0.9rem;
  }
}

.bottom_ad {
  position: fixed;
  bottom: 26px;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 100;
  border-top: 1px solid black;
  background-color: white;
  margin-bottom: 9px;
}
</style>
