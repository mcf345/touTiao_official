<template>
  <div>
    <van-cell title="搜索历史">
      <template #default>
        <template v-if="isDelete">
          <van-tag class="btn" type="danger" @click="deleteAll"
            >全部删除</van-tag
          >
          <van-tag class="btn" type="success" @click="isDelete = false"
            >完成</van-tag
          >
        </template>
        <van-icon v-else name="delete" @click="isDelete = true"></van-icon>
      </template>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistory"
      :key="index"
      @click="clickHistoryItem(item, index)"
    >
      <van-icon v-if="isDelete" name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "searchHistory",
  props: {
    searchHistory: Array,
  },
  data() {
    return {
      isDelete: false,
    };
  },
  methods: {
    deleteAll() {
      this.$emit("deleteAll");
    },
    clickHistoryItem(item, index) {
      if (this.isDelete) {
        this.searchHistory.splice(index, 1);
      } else {
        this.$emit("onSearch", item);
      }
    },
  },
};
</script>

<style scoped lang="less">
.btn {
  margin-right: 5px;
}
</style>
