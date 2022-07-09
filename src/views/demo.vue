<template>
  <div>
    <h1>demo</h1>
    <h2>{{ count }}</h2>
    <h3>{{ user.name }}</h3>
    <van-field v-model.number="num"></van-field>

    <van-button @click="count1">count++</van-button>
    <van-button @click="changeName">改变username</van-button>
    <van-button @click="changeCount2">点击后加特定的值</van-button>
  </div>
</template>

<script>
// 1. mapState 快速获取vuex state状态的方法
import { mapState } from "vuex";
export default {
  data() {
    return {
      num: 0,
    };
  },
  computed: {
    // 2. store仓库的状态通过mapState
    ...mapState(["count", "user"]),
  },
  mounted() {
    console.log(this.user);
  },
  methods: {
    count1() {
      // 调用mutations内部的方法，commit('mutations内部的事件名称')
      this.$store.commit("changeCount");
    },
    changeName() {
      this.$store.commit("changeName");
    },
    changeCount2() {
      this.$store.commit("changeCount2", this.num);
    },
  },
};
</script>

<style></style>
