<template>
  <div>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onSubmit"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user.js";
import dayjs from "dayjs";
export default {
  name: "UserBirthday",
  props: {
    value: String,
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onSubmit() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      try {
        const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD");
        await updateUserProfile({
          birthday: currentDate,
        });
        this.$emit("input", currentDate);
        this.$emit("close");
        this.$toast.success("修改日期成功");
      } catch (e) {
        console.log(e);
        this.$toast.fail("修改日期失败");
      }
    },
  },
};
</script>

<style></style>
