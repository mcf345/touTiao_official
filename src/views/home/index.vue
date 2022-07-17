<template>
  <div class="home-container">
    <van-nav-bar fixed>
      <template #title>
        <van-button
          round
          type="info"
          icon="search"
          size="small"
          block
          to="/search"
          class="search-btn"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>

    <!-- 在 HTMl 页面头中通过 meta 属性全局配置： 图片的防盗链保护处理 -->
    <meta name="referrer" content="no-referrer" />

    <!-- 文章频道列表 -->
    <van-tabs swipeable animated v-model="active" class="channel-tabs">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <ArticleList :channel="item" />
      </van-tab>

      <template #nav-right>
        <div class="placeholder"></div>
        <div class="hamburger-btn" @click="showPopup = true">
          <ToutiaoIcon icon="gengduo" />
        </div>
      </template>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup
      close-icon-position="top-left"
      closeable
      v-model="showPopup"
      position="bottom"
      style="height: 90%"
    >
      <!-- 弹出层内容 -->
      <channelEdit
        @changeActive="changeActive"
        :active="active"
        :userChannel="userChannel"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserCannel } from "@/api/cannel.js";
import ArticleList from "@/views/home/components/article-list.vue";
import channelEdit from "@/views/home/components/channel-edit.vue";
import { getLocal } from "@/utils/storages.js";
import { USERCHANNELKEY } from "@/api/userChannels.js";
export default {
  name: "HomePage",
  components: {
    ArticleList,
    channelEdit,
  },
  props: {},
  data() {
    return {
      showPopup: false,
      active: 0,
      userChannel: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getTheUserCannel();
  },
  mounted() {},
  methods: {
    // 修改active值的方法
    changeActive(index, flag) {
      this.active = index;
      // 弹层关闭
      this.showPopup = flag;
    },
    // 获取用户频道数据
    async getTheUserCannel() {
      // const res = await getUserCannel();
      // this.userChannel = res.data.data.channels;
      try {
        // 获取用户token
        const token = this.$store.state.user?.token;
        let channels = getLocal(USERCHANNELKEY);
        // 判断是否登录或本地存储是否有数据
        if (token || !channels) {
          const res = await getUserCannel();
          channels = res.data.data.channels;
        }
        this.userChannel = channels;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    width: 80%;
    max-width: unset;
  }

  .van-nav-bar .van-icon {
    color: #fff;
  }

  .search-btn {
    background-color: #5babfb;
    border: none;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
  }
}
</style>
