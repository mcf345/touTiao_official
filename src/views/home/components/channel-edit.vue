<template>
  <div class="channel-edit">
    <van-cell style="text-align: center" title="编辑标题"></van-cell>
    <van-cell title="我的频道">
      <template #default>
        <van-button
          @click="isEdit = !isEdit"
          class="edit-btn"
          plain
          round
          size="mini"
          type="danger"
        >
          {{ isEdit ? "完成" : "编辑" }}
        </van-button>
      </template>
    </van-cell>

    <!-- 我的频道 -->
    <van-grid class="my-channel" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(value, index) in userChannel"
        :key="index"
        @click="onMyChannelClick(value, index)"
      >
        <template #icon v-if="isEdit && index !== 0">
          <van-icon name="clear" />
        </template>
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
        @click="addChannel(value)"
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
import {
  fetchAllChannel,
  fetchAddChannel,
  deleteUserChannel,
} from "@/api/cannel.js";
// import { differenceBy } from "lodash";
// import differenceBy from "lodash/differenceBy";
import { differenceBy } from "@/utils/lodash.js";
import { mapState } from "vuex";
import { USERCHANNELKEY } from "@/api/userChannels.js";
import { setLocal } from "@/utils/storages";
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
      isEdit: false,
    };
  },
  computed: {
    recommendChannels() {
      return differenceBy(this.allChannel, this.userChannel, "id");
    },
    ...mapState(["user"]),
    // recommendChannels() {
    //   // 所有的频道数据里面，找到我的频道数据 >> 过滤掉
    //   return this.allChannel.filter((item) => {
    //     // 返回true >> 留下来了
    //     // >> 如果找到了 >> true
    //     // 如果所有频道里面的item在 userChannel 里面找到了，当前项就被保存
    //     return !this.userChannel.some((userItem) => userItem.id === item.id);
    //   });
    // },
  },
  created() {
    this.getAllChannel();
  },
  methods: {
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 从接口删除
          await deleteUserChannel(channel.id);
        } else {
          // 修改之后的数据存储到本地
          setLocal(USERCHANNELKEY, this.userChannel);
        }
        this.$toast("删除成功");
      } catch (e) {
        this.$toast("删除失败,请稍后再试");
      }
    },
    onMyChannelClick(channel, index) {
      // 判断是否处于编辑状态
      if (this.isEdit) {
        // 处于编辑状态
        if (index === 0) return this.$toast("傻狗吧你，还要删这个");
        if (index <= this.active) {
          // 如果 index 小于选中项 >> 手动让选中 -1
          this.$emit("changeActive", this.active - 1, true);
        }
        this.userChannel.splice(index, 1);
        // 持久化
        this.deleteChannel(channel);
      } else {
        // 非编辑状态 >> 1.切换 >> 2.关弹窗
        this.$emit("changeActive", index, false);
      }
    },
    async addChannel(channel) {
      // 子组件不允许修改父组件的数据
      this.userChannel.push(channel);
      // 持久化
      // 本地存储 >> 未登录
      // 线上服务器 >> 已登录
      // 判断是否登录 >> token >> vuex里面取值
      if (this.user) {
        try {
          await fetchAddChannel({
            id: channel.id,
            seq: this.userChannel.length,
          });
          this.$toast("频道添加成功");
        } catch (e) {
          this.$toast("频道添加失败");
        }
      } else {
        setLocal(USERCHANNELKEY, this.userChannel);
      }
    },
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

    .channel-item {
      /deep/ .van-grid-item__icon-wrapper {
        position: unset;
      }
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
