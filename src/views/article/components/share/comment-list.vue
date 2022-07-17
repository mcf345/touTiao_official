<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="出错了,点击重试"
    >
      <CommentItem
        @reply-click="$emit('reply-click', $event)"
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
      ></CommentItem>
      <!-- <van-cell
        :title="item.content"
        v-for="(item, index) in list"
        :key="index"
      /> -->
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import { getComments } from "@/api/comment.js";
import CommentItem from "./comment-item.vue";
export default {
  name: "ArticleComment",
  components: {
    CommentItem,
  },
  props: {
    artId: {
      type: [String, Number],
      required: true,
    },
    list: {
      type: Array,
    },
    type: {
      type: String,
      default: "a",
    },
  },
  data() {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      limit: 10, // 动态设置每页大小
      error: false,
    };
  },

  methods: {
    async onLoad() {
      try {
        const res = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.artId, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, // 每页大小
        });
        console.log(res);
        this.list.push(...res.data.data.results);
        // 请求完数据后，loading >> false
        this.loading = false;

        // 说明当前数据的最后一条id和所有数据最后一条的id相等
        // end_id：所有数据的最后一条
        if (res.data.data.last_id === res.data.data.end_id) {
          this.finished = true;
        } else {
          this.offset = res.data.data.last_id;
        }
      } catch (e) {
        console.log(e);
        this.error = true;
        this.loading = false;
      }

      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //   }
      //   // 加载状态结束
      //   this.loading = false;

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true;
      //   }
      // }, 500);
    },
  },
};
</script>

<style scoped lang="less">
.van-list {
  margin-bottom: 45px;
}
</style>
