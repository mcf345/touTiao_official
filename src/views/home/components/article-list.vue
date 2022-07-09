<template>
  <div class="artcile-list">
    <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="successText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="出错了,点击重新加载~"
      >
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
        <ArticleItem
          :article="item"
          v-for="(item, index) in list"
          :key="index"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getUserCannel } from "@/api/article.js";
import ArticleItem from "@/components/article-item";
export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
    },
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false,
      isLoading: true,
      successText: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      console.log("onLoad");
      try {
        //获取文章列表数据
        const res = await getUserCannel({
          channel_id: this.channel.id, // 文章列表对应的频道id
          timestamp: this.timestamp || Date.now(), // 时间戳首次请求为当前时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含 ---写死1
        });
        this.list = [...this.list, ...res.data.data.results];
        this.loading = false;

        // 数据请求完
        if (res.data.data.results.length === 0) {
          // 如果数据请求完毕，finisehd置为true
          this.finished = false;
        } else {
          this.timestamp = res.data.data.pre_timestamp;
        }
      } catch (e) {
        console.log(e);
        this.error = true;
        this.loading = false;
      }

      // 1. 请求获取数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   // 2. 把请求结果数据放到 list 数组中
      //   for (let i = 0; i < 10; i++) {
      //     // 0 + 1 = 1
      //     // 1 + 1 = 2
      //     // 2 + 1 = 3
      //     this.list.push(this.list.length + 1);
      //   }

      //   // 3. 本次数据加载结束之后要把加载状态设置为结束
      //   //     loading 关闭以后才能触发下一次的加载更多
      //   this.loading = false;

      //   // 4. 判断数据是否全部加载完成
      //   if (this.list.length >= 40) {
      //     // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
      //     this.finished = true;
      //   }
      // }, 1000);
    },
    async onRefresh() {
      try {
        const res = await getUserCannel({
          channel_id: this.channel.id, // 文章列表对应的频道id
          timestamp: Date.now(), // 时间戳首次请求为当前时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含 ---写死1
        });
        this.list = [...res.data.data.results, ...this.list];
        this.isLoading = false;
        this.successText = `更新了${res.data.data.results.length}条数据`;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped lang="less">
.artcile-list {
  height: 79vh;
  overflow: auto;
}
</style>
