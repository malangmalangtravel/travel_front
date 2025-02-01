<template>
  <div id="reportPopup" v-show="popupVisible">
    <div id="pop">
      <div id="title">게시물 신고</div>
      <br>
      <div id="content">
        신고 사유 :
        <select v-model="selectedReason" style="width: 100px;">
          <option value="">욕설 · 명예훼손</option>
          <option value="">음란물 · 선정성</option>
          <option value="">저작권 위반</option>
          <option value="">중복 게시물</option>
          <option value="">기타</option>
        </select>
        <textarea rows="6" style="margin-top: 10px;" v-model="declarationText"></textarea>
        <div style="margin-top: 10px;">
          <button type="button" @click="submitDeclaration" class="ml-2 btn btn-primary">제출</button>
          <button type="button" @click="hidePopup" class="ml-2 btn btn-primary">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popupVisible: false,
      selectedReason: '',
      declarationText: ''
    };
  },
  methods: {
    showPopup() {
      this.popupVisible = true;
    },
    hidePopup() {
      this.popupVisible = false;
    },
    submitDeclaration() {
      // Implement your submission logic here
      console.log('Selected Reason:', this.selectedReason);
      console.log('Declaration Text:', this.declarationText);
      // Reset fields or perform other actions after submission
      this.popupVisible = false;
    }
  }
};
</script>

<style scoped>
#pop {
  background: #3d3d3d;
  color: #fff;
  position: absolute;
  top: 10px;
  left: 50%; /* Center horizontally */
  transform: translateX(-50%);
  text-align: center;
  border: 2px solid #000;
  margin-top: 100px;
  z-index: 2;
  font-size: 0.5em;
  width: 80%; /* Adjust width as needed */
  max-width: 400px; /* Limit width for smaller screens */
}

#reportPopup {
  display: none;
}

#pop_bt {
  cursor: pointer;
  padding: 5px;
}

#close,
#declarationSubmit {
  cursor: pointer;
  font-weight: bold;
  font-size: 0.5em;
  display: inline-block;
  margin-top: 10px;
}
</style>
