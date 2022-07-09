<template>
  <div class="layout-container">
    <router-view></router-view>

    <van-tabbar v-model="active" class="layout-tabbar" route>
      <van-tabbar-item name="home" to="/home">
        <template #icon>
          <ToutiaoIcon icon="shouye" />
        </template>
        首页
      </van-tabbar-item>

      <van-tabbar-item name="search" to="/qa">
        <template #icon>
          <ToutiaoIcon icon="wenda" />
        </template>
        问答
      </van-tabbar-item>

      <van-tabbar-item name="friends" to="/video">
        <template #icon>
          <ToutiaoIcon icon="shipin" />
        </template>
        视频
      </van-tabbar-item>

      <van-tabbar-item name="setting" to="/mine">
        <template #icon>
          <ToutiaoIcon icon="wode" />
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped lang="less">
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
