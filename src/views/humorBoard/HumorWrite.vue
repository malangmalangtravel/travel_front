<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <h3 class="text-center mb-4">{{ post.id ? '게시글 수정' : '게시글 작성' }}</h3>

      <form @submit.prevent="submitPost">
        <!-- 게시판 선택 -->
        <div class="form-group mb-3">
          <label for="board">게시판 선택</label>
          <select id="board" v-model="post.boardCode" class="form-control" required>
            <option value="">게시판 선택</option>
            <option value="humor">유머 게시판</option>
            <option value="ssul">썰 게시판</option>
          </select>
        </div>

        <!-- 제목 입력 -->
        <div class="form-group mb-3">
          <label for="title">제목:</label>
          <input type="text" id="title" v-model="post.title" required maxlength="100" class="form-control" placeholder="제목을 입력해주세요." />
        </div>

        <!-- Quill 에디터 -->
        <div class="form-group mb-4">
          <label for="content">내용:</label>
          <div ref="editor" id="content" required class="quill-editor"></div>
        </div>

        <!-- 제출 버튼 -->
        <div class="form-group text-center">
          <button type="submit" class="btn btn-primary btn-lg px-5">
            {{ post.id ? '게시글 수정' : '게시글 작성' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import Quill from 'quill'; // Quill 라이브러리 임포트

export default {
  data() {
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,
      post: {
        id: null,
        title: '',
        content: '',
        boardCode: '',
        deleteYn: ''
      }
    };
  },
  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    }
  },
  created() {
    this.fetchMemberInfo();
    if (this.id) {
      this.fnEditPost(); // 게시글 수정 모드 진입
    }
  },
  mounted() {
    // Quill 에디터 초기화
    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      placeholder: '내용을 입력해주세요.',
      modules: {
        toolbar: [
          [{ 'size': ['large', 'huge'] }], // 폰트 크기 조절 옵션 추가
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link'],
        ],
      },
    });

    // Quill 에디터의 내용을 Vue 데이터와 양방향 바인딩
    this.quill.on('text-change', () => {
      this.post.content = this.quill.root.innerHTML;
    });
  },

  methods: {
    fetchMemberInfo() {
      this.$store.dispatch('fetchMemberInfo')
        .then(() => {
          console.log('회원 정보를 성공적으로 가져왔습니다.');

          // 닉네임이 null이거나 공백이면 nicknamesetup 페이지로 리디렉션
          const memberInfo = this.$store.getters.getMemberInfo;

          if (!memberInfo.nickName || memberInfo.nickName.trim() === '') {
            // 닉네임이 없으면 nicknamesetup 페이지로 리디렉션
            this.$router.push('/etc/nicknamesetup');
          }
        })
        .catch(error => {
          console.error('회원 정보를 가져오는 중 오류 발생:', error);
        });
    },

    submitPost() {
      if (!this.memberInfo) {
        console.error('회원 정보를 가져올 수 없습니다.');
        return;
      }

      // 게시글 정보에 회원 정보 추가
      this.post.nick_name = this.memberInfo.nickName;
      this.post.email = this.memberInfo.email;

      // 게시판에 따라 API URL 설정
      const apiUrl = this.getApiUrl();

      // 해당 URL로 게시글 저장 API 호출
      this.$axios.post(apiUrl, this.post)
        .then(response => {
          const postId = response.data.id;
          alert('게시글이 저장되었습니다.');

          if (postId) {
            this.$router.push({
              path: '/humorBoard/HumorList',
              query: this.requestBody
            }); // 저장된 게시글 상세 페이지로 이동
          } else {
            console.error('저장된 게시글의 ID를 가져올 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('게시글 저장 실패:', error);
          alert('게시글 저장 중 오류가 발생했습니다.');
        });
    },

    fnEditPost() {
        const boardCode = this.$route.query.boardCode;
        this.boardCode = boardCode;
      if (this.id) {
        const apiUrl = `${process.env.VUE_APP_SERVER_URL}/api/humor/${boardCode}Board/detail/${this.id}`;
        this.$axios.get(apiUrl)
          .then(response => {
            const { id, title, content, boardCode, deleteYn } = response.data;
            this.post = { id, title, content, boardCode, deleteYn };

            // Quill 에디터의 내용도 초기화된 데이터로 설정(수정 시 content 가져오기)
            if (this.quill) {
              this.quill.root.innerHTML = this.post.content;
            }
          })
          .catch(error => {
            console.error('게시글 정보를 가져오는 중 오류 발생:', error);
          });
      }
    },

    // 게시판 코드에 따라 API URL 반환
    getApiUrl() {
      if (this.post.boardCode === 'humor') {
        return `${process.env.VUE_APP_SERVER_URL}/api/humor/humorBoard/create`;
      } else if (this.post.boardCode === 'ssul') {
        return `${process.env.VUE_APP_SERVER_URL}/api/humor/ssulBoard/create`;
      }
      throw new Error('게시판을 선택하세요.');
    }
  }
};
</script>

<style scoped>
.quill-editor {
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  margin-top: 10px;
}

.card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;
}

.card h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.form-group label {
  font-weight: 600;
  color: #555;
}

.form-control {
  border-radius: 8px;
  font-size: 16px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  font-size: 18px;
  padding: 12px 24px;
  border-radius: 5px;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-primary:focus, .btn-primary.focus {
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.mb-4 {
  margin-bottom: 2rem !important;
}

.mb-3 {
  margin-bottom: 1.5rem !important;
}

.text-center {
  text-align: center;
}
</style>
