<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isShowResult = false"
      />
    </form>
    <!-- 搜索结果 -->
    <SearchResult v-if="isShowResult" :searchText="searchText" />
    <!-- 搜索建议 >> 如果搜索框有内容显示 -->
    <SearchSuggestion
      @onSearch="onSearch"
      :searchText="searchText"
      v-else-if="searchText"
    />
    <!-- 搜索历史 >> 如果搜索框没有内容显示 -->
    <SearchHistory
      v-else
      :searchHistory="searchHistory"
      @deleteAll="deleteAll"
      @onSearch="onSearch"
    />
  </div>
</template>

<script>
import SearchHistory from "@/views/search/compontents/search-history.vue";
import SearchSuggestion from "@/views/search/compontents/search-suggestion.vue";
import SearchResult from "@/views/search/compontents/search-result.vue";
import { HISTORY } from "@/api/userChannels.js";
import { setLocal, getLocal } from "@/utils/storages.js";
export default {
  name: "SearchPage",
  components: { SearchHistory, SearchSuggestion, SearchResult },
  props: {},
  data() {
    return {
      searchText: "",
      isShowResult: false,
      searchHistory: getLocal(HISTORY) || [], // 搜索历史列表
    };
  },
  computed: {},
  watch: {
    searchHistory(val) {
      setLocal(HISTORY, val);
    },
  },
  created() {},
  methods: {
    // 确认搜索时触发
    onSearch(value) {
      // 默认 >> 搜索历史
      // 如果输入框有内容 >> 搜索建议
      // 按下回车 >> 搜索结果
      console.log("确认搜索");
      this.searchText = value;
      this.isShowResult = true;

      const index = this.searchHistory.indexOf(value);
      if (index !== -1) {
        this.searchHistory.splice(index, 1);
      }
      this.searchHistory.unshift(value);
    },
    onCancel() {
      console.log("点击了取消");
      // this.isShowResult = false;
      this.$router.push("/home");
    },
    deleteAll() {
      this.searchHistory = [];
    },
  },
};
</script>

<style scoped></style>
