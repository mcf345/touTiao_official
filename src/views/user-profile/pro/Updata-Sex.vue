<template>
  <div>
    <van-picker
      title="选择性别"
      show-toolbar
      :columns="columns"
      :defaultIndex="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
export default {
  name: "UserSex",
  props: {
    value: {
      type: [Number],
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      theSex: this.value,
    };
  },
  methods: {
    async onConfirm(...[, index]) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      await updateUserProfile({
        gender: index,
      });
      this.$toast.success("修改性别成功");
      this.$emit("close");
      this.$emit("input", index);
    },

    // async onConfirm() {
    //   this.$toast.loading({
    //     duration: 0, // 持续展示 toast
    //     forbidClick: true,
    //     message: "加载中...",
    //   });
    //   try {
    //     await updateUserProfile({
    //       gender: this.theSex,
    //     });
    //     this.$emit("input", this.theSex);
    //     this.$emit("close");
    //     this.$toast.success("修改成功");
    //   } catch (e) {
    //     console.log(e);
    //     this.$toast.fail("修改失败");
    //   }
    // },
    // onChange(picker, value, index) {
    //   this.theSex = index;
    // },
  },
};
</script>

<style></style>
