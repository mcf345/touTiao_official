<template>
  <div class="article-container">
    <!-- <meta name="referrer" content="no-referrer" /> -->
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.art_id">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate }}</div>

          <attention
            :autId="article.aut_id"
            v-model="article.is_followed"
          ></attention>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider
          :style="{
            color: '#1989fa',
            borderColor: '#1989fa',
            padding: '0 16px',
          }"
          >正文结束</van-divider
        >

        <!-- 评论列表 -->
        <commentList
          @reply-click="onReplyClick"
          :list="commentList"
          :artId="articleId"
        ></commentList>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="isNotFound">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else @click="getArticleById">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!------------------------ 评论回复 ------------------------------>
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply
        v-if="isReplyShow"
        @closeThis="isReplyShow = false"
        :currentComment="currentComment"
      ></CommentReply>
    </van-popup>
    <!------------------------ /评论回复 ------------------------------>

    <!-- 发布文章评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        @postSuccess="postSuccess"
        :target="article.art_id"
      ></PostComment>
    </van-popup>
    <!-- /发布文章评论 -->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :info="article.comm_count" color="#777" />
      <!-- 收藏 -->
      <collectArticle
        :artId="articleId"
        v-model="article.is_collected"
      ></collectArticle>

      <!-- 点赞 -->
      <giveLike :artId="articleId" v-model="article.attitude"></giveLike>

      <van-icon color="#777777" name="share"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";
import { ImagePreview } from "vant";
// import { addFollow, deleteFollow } from "@/api/user.js";
import attention from "./components/follow-user"; // 关注组件
import collectArticle from "./components/collect-article"; // 收藏组件
import giveLike from "./components/giveLike"; // 点赞
import commentList from "./components/share/comment-list.vue";
import PostComment from "./components/share/post-comment.vue";
import CommentReply from "./components/share/comment-reply.vue";
// 引入美化 markdown 的样式文件
import "github-markdown-css";
export default {
  name: "ArticleIndex",
  components: {
    attention,
    collectArticle,
    giveLike,
    commentList,
    PostComment,
    CommentReply,
  },
  // 父组件提供文章的id
  provide() {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    // 使用props获取动态路由的数据
    articleId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章对象
      loading: false,
      isNotFound: false, //标识当前是不是404状态
      isPostShow: false, // 发布评论弹层控制
      commentList: [], // 评论列表的数组
      isReplyShow: false, // 回复弹层是否展示字段
      currentComment: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getArticleById();
  },
  mounted() {},
  methods: {
    onReplyClick(comment) {
      console.log(comment);
      this.isReplyShow = true;
      this.currentComment = comment;
    },
    postSuccess(data) {
      this.isPostShow = false;
      this.commentList.unshift(data);
    },
    previewImg() {
      // 获取所有img图片
      // src属性
      // push到一个新的数组里面
      // console.log(this.$refs.content);
      const imgs = this.$refs.content.querySelectorAll("img");
      // 存储所有图片的路径数组
      const images = [];
      // 获取图片链接
      // 遍历dom结构获取图片链接，存入数组
      imgs.forEach((item, index) => {
        images.push(item.src);
        item.addEventListener("click", function () {
          ImagePreview({
            images: images,
            startPosition: index, // 指定图片的起始位置 >> 图片的index
          });
        });
      });
      // console.log(images);
    },
    async getArticleById() {
      this.loading = true;
      try {
        const res = await getArticleById(this.articleId);
        console.log(res);
        this.article = res.data.data;

        // 已经成功获取到了数据
        // 绑定图片预览功能
        this.loading = false;
        // 界面更新之后执行
        // 获取到最新的dom结构

        // 因为界面的更新是异步的
        // 所以修改完数据以后，直接获取最新的dom结构是获取不到的
        // 需要通过$nextTick 在界面更新完毕以后再去获取才可以
        //  $nextTick: 界面更新完毕以后想要拿到最新的dom结构就可以使用这个api
        this.$nextTick(() => {
          this.previewImg();
        });
      } catch (e) {
        console.log(e);
        this.loading = false;
        // 判断当前是不是404状态
        this.isNotFound = e.response?.status === 404;
      }
    },
  },
};
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
