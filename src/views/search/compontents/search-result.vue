<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <!-- <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      /> -->
      <ArticleItem
        v-for="(item, index) in list"
        :key="index"
        :article="item"
      ></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import { getSearch } from "@/api/search.js";
import ArticleItem from "@/components/article-item";
export default {
  name: "SearchResult",
  components: {
    ArticleItem,
  },
  props: {
    searchText: {
      type: String,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perPage: 10,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 获取搜索结果
      //  >> 请求获取数据
      try {
        const res = await getSearch({
          page: this.page,
          per_Page: this.perPage,
          q: this.searchText,
        });
        const { results } = res.data.data;
        // this.list.push(...results);
        this.list = [...this.list, ...results];
        console.log(this.list);
        this.loading = false;

        if (results.length) {
          this.page++; // 更新获取下一页数据的页码
        } else {
          this.finished = true; // 没有数据了，将加载状态设置结束，不再 onLoad
        }
      } catch (e) {
        console.log(e);
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
// .search-result {
//   height: 79vh;
//   // overflow: auto;
// }
.search {
  padding-top: 106px;
  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
