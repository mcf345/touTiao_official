<template>
  <div class="post-comment">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button class="post-btn" size="small" @click="onPost">发布</van-button>
  </div>
</template>

<script>
import { addComment } from "@/api/comment.js";
export default {
  name: "PostComment",
  components: {},
  props: {
    // 目标id，接收文章id或者评论id
    target: {
      type: [Number, String],
      required: true,
    },
    type: {
      type: String,
      default: "a",
    },
  },
  // 子组件注入文章id，可以直接在当前组件使用
  inject: ["articleId"], // 文章的id
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      // loading效果
      this.$toast.loading({
        duration: 0, // 表示toast不会消失
        forbidClick: true, // 禁用背景点击
      });
      try {
        if (this.message.trim().length === 0) {
          return this.$toast("请输入正确的格式");
        }
        const res = await addComment({
          target: this.target, // 评论目标id（评论文章即文章id，对评论进行回复则为评论id） 防止有大数字最好也执行一下toString方法！
          content: this.message, // 评论内容
          art_id: this.type === "c" ? this.articleId : null, // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        this.$toast.success("成功");
        console.log(res);
        this.$emit("postSuccess", res.data.data.new_obj);
      } catch (e) {
        console.log(e);
        this.$toast("失败");
      }
      this.message = "";
    },
  },
};
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
