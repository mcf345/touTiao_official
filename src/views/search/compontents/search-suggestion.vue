<template>
  <div>
    <van-cell
      @click="hancleClick(item)"
      v-for="(item, index) in list"
      :key="index"
      icon="search"
    >
      <template #title>
        <div v-html="hightLight(item)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from "@/api/search.js";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: String,
  },
  data() {
    return {
      list: [],
    };
  },
  // debounce(function() {},wait)     >> 防抖
  watch: {
    // 监听搜索内容的变化 >> 发送请求获取搜索建议列表数据
    searchText: {
      handler: debounce(function (value) {
        this.getSearchSuggestion(value);
      }, 500),
      immediate: true, // 首次也需要监听
    },
  },
  methods: {
    hightLight(item) {
      const reg = new RegExp(this.searchText, "gi");
      return item.replace(
        reg,
        `<span style='color:red'>${this.searchText}</span>`
      );
    },
    hancleClick(value) {
      console.log(value);
      // 在父组件创建自定义事件，在子组件触发事件，
      // 将点击的拿一项发送给父组件
      this.$emit("onSearch", value);
    },
    // 获取搜索联想建议
    async getSearchSuggestion(q) {
      const res = await getSearchSuggestion(q);
      this.list = res.data.data.options || [];
      // this.list = res.data.data.options.map((item) => {
      //   const reg = new RegExp(this.searchText, "gi");
      //   return item.replace(
      //     reg,
      //     `<span style='color:red'>${this.searchText}</span>`
      //   );
      // });
    },
  },
};
</script>

<style></style>
