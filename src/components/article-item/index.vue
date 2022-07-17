<template>
  <div class="article-item">
    <van-cell :title="article.title" :to="`/article/${article.art_id}`">
      <template #default v-if="article.cover.type === 1">
        <van-image fit="contain" class="img" :src="article.cover.images[0]">
          <template v-slot:error>加载失败</template></van-image
        >
      </template>

      <template #label>
        <div class="img-container" v-if="article.cover.type === 3">
          <van-image
            fit="contain"
            class="img-three"
            v-for="(item, index) in article.cover.images"
            :key="index"
            :src="item"
          >
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <div>
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "ArticleItem",
  components: {},
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.article-item {
  span {
    margin-left: 15px;
  }
  .img {
    width: 200px;
  }

  .img-container {
    display: flex;
    justify-content: space-between;
    .img-three {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
