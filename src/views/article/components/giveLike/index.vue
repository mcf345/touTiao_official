<template>
  <van-button @click="changeLick" class="btn" :loading="loading">
    <template #icon>
      <van-icon
        :color="lickArticle === 1 ? 'red' : ''"
        :name="lickArticle === 1 ? 'good-job' : 'good-job-o'"
      ></van-icon>
    </template>
  </van-button>
  <!-- <van-icon name="good-job" /> -->
</template>

<script>
import { addLike, deleteLike } from "@/api/article.js";
export default {
  name: "giveLike",
  data() {
    return {
      flag: false,
      loading: false,
    };
  },
  model: {
    prop: "lickArticle",
    event: "changeLick",
  },
  props: {
    lickArticle: {
      type: Number,
      // required: true,
    },
    artId: {
      type: [Number, String],
      // required: true,
    },
  },
  created() {},
  methods: {
    async changeLick() {
      try {
        this.loading = true;
        if (this.lickArticle === 1) {
          await deleteLike(this.artId);
          this.$emit("changeLick", -1);
        } else {
          await addLike(this.artId);
          this.$emit("changeLick", 1);
        }
        this.$toast(this.lickArticle === 1 ? "取消点赞" : "点赞成功");
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
