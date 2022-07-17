<template>
  <van-button
    v-if="!isFollowed"
    @click="follow"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="isFollowLoading"
    >关注</van-button
  >
  <van-button
    v-else
    @click="follow"
    class="follow-btn"
    round
    size="small"
    :loading="isFollowLoading"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user.js";
export default {
  name: "attention",
  model: {
    prop: "isFollowed", // key >> value >> ?
    event: "changFollowed", // 自定义事件的名称， >> input >> ?
  },
  props: {
    autId: {
      type: [Number, String],
      required: true,
    },
    isFollowed: {
      type: [Boolean],
    },
    // value: {
    //   type: [Boolean],
    // },
  },
  // 组件添加v-model
  // 目的：允许子组件直接修改父组件的值
  // 1. 把通过value属性传递给子组件 >> 子组件可以props(value)属性接受
  // 2. 提供子组件一个input事件 >> 修改v-model后面的值
  data() {
    return {
      isFollowLoading: false,
    };
  },
  methods: {
    async follow() {
      this.isFollowLoading = true;
      try {
        // 调用接口，关注/取消关注 当前作者
        if (this.isFollowed) {
          // 取消关注
          await deleteFollow(this.autId);
        } else {
          // 去关注
          await addFollow(this.autId);
        }
        // 让当前关注的状态取反 >> 界面响应式更新
        // this.isFollowed = !this.isFollowed;
        // this.$emit("input", !this.isFollowed);
        this.$emit("changFollowed", !this.isFollowed);
        // 关注之后进行提示
        this.$notify({
          type: "success",
          message: this.isFollowed ? "关注成功" : "取消关注",
        });
        this.isFollowLoading = false;
      } catch (e) {
        this.$notify({
          type: "danger",
          message: "操作失败",
        });
        this.isFollowLoading = false;
      }
    },
  },
};
</script>

<style></style>
