<template>
  <van-button class="btn" @click="changeCollected" :loading="loading">
    <template #icon>
      <van-icon
        :color="isCollected ? 'red' : ''"
        :name="isCollected ? 'star' : 'star-o'"
      ></van-icon>
    </template>
  </van-button>
</template>

<script>
import { addCollect, deleteCollect } from "@/api/article.js";
export default {
  name: "collectArticle",
  model: {
    prop: "isCollected",
    event: "changeCollected",
  },
  props: {
    isCollected: {
      type: Boolean,
      // required: true,
    },
    // 文章的id
    artId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async changeCollected() {
      try {
        this.loading = true;
        // 请求接口修改收藏的状态
        // 判断是否已经收藏
        if (this.isCollected) {
          // true
          // 已经收藏 >> 去收藏
          await deleteCollect(this.artId);
        } else {
          //  没有收藏 >> 去收藏
          await addCollect(this.artId);
        }
        // 修改父组件的收藏状态 >> 界面更新
        this.$emit("changeCollected", !this.isCollected);
        // isCollected 修改前的状态
        this.$toast(this.isCollected ? "取消收藏" : "收藏成功");
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.btn {
  border: none;
}
</style>
