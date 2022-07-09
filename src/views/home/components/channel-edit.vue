<template>
  <div class="channel-edit">
    <van-cell style="text-align: center" title="编辑标题"></van-cell>
    <van-cell title="我的频道">
      <template #default>
        <van-button class="edit-btn" plain round size="mini" type="danger"
          >编辑</van-button
        >
      </template>
    </van-cell>

    <!-- 我的频道 -->
    <van-grid class="my-channel" :gutter="10">
      <van-grid-item
        icon="clear"
        class="channel-item"
        v-for="(value, index) in userChannel"
        :key="index"
      >
        <template #text>
          <span class="text" :class="{ active: active === index }">{{
            value.name
          }}</span>
        </template>
      </van-grid-item>
    </van-grid>

    <!-- 推荐频道 -->
    <van-cell title="推荐频道" />

    <van-grid :gutter="10" direction="horizontal" class="recommend-channel">
      <van-grid-item
        icon="plus"
        class="channel-item"
        v-for="value in recommendChannels"
        :key="value.id"
      >
        <template #text>
          <span class="text">{{ value.name }}</span>
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { fetchAllChannel } from "@/api/cannel.js";
export default {
  name: "ChannelEdit",
  props: {
    userChannel: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Number,
    },
  },
  data() {
    return {
      allChannel: [],
    };
  },
  computed: {
    recommendChannels() {
      // 所有的频道数据里面，找到我的频道数据 >> 过滤掉
      return this.allChannel.filter((item) => {
        // 返回true >> 留下来了
        // >> 如果找到了 >> true
        // 如果所有频道里面的item在 userChannel 里面找到了，当前项就被保存
        return !this.userChannel.some((userItem) => userItem.id === item.id);
      });
    },
  },
  created() {
    this.getAllChannel();
  },
  methods: {
    async getAllChannel() {
      const res = await fetchAllChannel();
      this.allChannel = res.data.data.channels;
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  .edit-btn {
    width: 100px;
  }

  // 推荐频道的加号
  .recommend-channel {
    /deep/.van-icon-plus {
      color: #222;
      font-size: 26px;
      margin-right: 6px;
    }
  }

  // 我的频道的叉号
  .my-channel {
    /deep/ .van-icon-clear {
      position: absolute;
      font-size: 30px;
      right: -10px;
      top: -10px;
      color: #cacaca;
    }
  }

  // 每一个按键的背景色
  /deep/.channel-item .van-grid-item__content {
    background-color: #f4f5f6;
  }
  // 文字样式
  .channel-item .text {
    font-size: 16px;
    color: #222;
    margin-top: 0;

    &.active {
      color: red;
    }
  }
}
</style>
