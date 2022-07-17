<template>
  <div class="thBody">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-right="onClickright"
      @click-left="$emit('close')"
    ></van-nav-bar>

    <div class="pad">
      <van-field
        class="theInput"
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
export default {
  name: "UpdataName",
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      message: this.value,
    };
  },
  methods: {
    async onClickright() {
      await updateUserProfile({ name: this.message });
      this.$emit("close");
      this.$emit("input", this.message);
      this.$toast.success("修改昵称成功");
    },
  },
};
</script>

<style scoped lang="less">
.pad {
  margin: 20px;
}
.theInput {
  margin-top: 20px;
}
</style>
