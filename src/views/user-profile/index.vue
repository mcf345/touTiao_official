<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />

    <input @change="fileChange" type="file" hidden ref="input" />
    <van-cell @click="clickInput" title="头像" is-link center>
      <template #default>
        <van-image class="avatar" round :src="userInfo.photo"></van-image>
      </template>
    </van-cell>
    <van-cell
      title="昵称"
      :value="userInfo.name"
      is-link
      center
      @click="isShowName = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="userInfo.gender === 0 ? '男' : '女'"
      is-link
      center
      @click="isShowSex = true"
    ></van-cell>

    <van-cell
      title="生日"
      :value="userInfo.birthday"
      is-link
      center
      @click="isShowBirthday = true"
    ></van-cell>

    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isShowName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdataName
        v-if="isShowName"
        v-model="userInfo.name"
        @close="isShowName = false"
      ></UpdataName>
    </van-popup>

    <!-- 性别弹出层 -->
    <van-popup v-model="isShowSex" position="bottom" :style="{ height: '36%' }">
      <UpdataSex
        v-if="isShowSex"
        v-model="userInfo.gender"
        @close="isShowSex = false"
      ></UpdataSex>
    </van-popup>

    <!-- 生日弹出层 -->
    <van-popup
      v-model="isShowBirthday"
      position="bottom"
      :style="{ height: '36%' }"
    >
      <UpdataBirthday
        v-if="isShowBirthday"
        v-model="userInfo.birthday"
        @close="isShowBirthday = false"
      ></UpdataBirthday>
    </van-popup>

    <!-- 点击头像预览 -->
    <van-popup
      v-model="isShowImage"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdateImage
        @close="isShowImage = false"
        v-model="userInfo.photo"
        :img="img"
      ></UpdateImage>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user.js";
import UpdataName from "./pro/Update-Name.vue";
import UpdataSex from "./pro/Updata-Sex.vue";
import UpdataBirthday from "./pro/Updata-Birthday.vue";
import UpdateImage from "./pro/Updata-Image.vue";
export default {
  name: "UserProfile",
  components: {
    UpdataName,
    UpdataSex,
    UpdataBirthday,
    UpdateImage,
  },
  data() {
    return {
      userInfo: {},
      isShowName: false,
      isShowSex: false,
      isShowBirthday: false,
      isShowImage: false,
      img: "",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const res = await getUserProfile();
      console.log(res);
      this.userInfo = res.data.data;
    },
    clickInput() {
      this.$refs.input.click();
    },
    fileChange(e) {
      // console.log(e);
      // 获取文章对象
      const file = e.target.files[0];
      // console.log(file);
      // 拿到图片的预览地址
      // 基于文章对象获取 blob 数据
      const url = URL.createObjectURL(file);
      console.log(url);
      this.isShowImage = true;
      this.img = url;
    },
  },
};
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 80px;
    height: 80px;
  }
}
.van-popup {
  background-color: #f5f7f9;
}
</style>
