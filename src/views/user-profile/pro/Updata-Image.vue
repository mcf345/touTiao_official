<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserPhoto } from "@/api/user.js";
export default {
  name: "UpdateImage",
  components: {},
  props: {
    // 预览图片地址信息
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null, // 裁剪器对象
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const img = this.$refs.img;
    this.cropper = new Cropper(img, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
    });
  },
  methods: {
    // 确定事件
    onConfirm() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob); // 裁剪后的结果信息
      });
    },
    // 上传文件的方法
    async updateUserPhoto(blob) {
      const formData = new FormData();
      formData.append("photo", blob);
      const res = await updateUserPhoto(formData);
      this.$emit("input", res.data.data.photo);
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="less">
.update-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
