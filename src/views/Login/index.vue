<template>
  <div class="login-container">
    <van-nav-bar title="登录">
      <template #left>
        <van-icon name="cross" color="#fff" @click="$router.back()" />
      </template>
    </van-nav-bar>

    <van-form @submit="onSubmit" ref="form">
      <van-field
        v-model="user.mobile"
        type="number"
        name="mobile"
        placeholder="请输入手机号"
        required
        :rules="rules.mobile"
      >
        <template #left-icon>
          <ToutiaoIcon icon="shouji" />
        </template>
      </van-field>

      <van-field
        v-model="user.code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        required
        :rules="rules.code"
      >
        <template #left-icon>
          <ToutiaoIcon icon="yanzhengma" />
        </template>

        <template #button>
          <van-count-down
            v-if="isShowTime"
            :time="5000"
            format="ss s"
            @finish="isShowTime = false"
          />
          <van-button
            v-else
            native-type="button"
            size="small"
            type="default"
            class="send-Sms-btn"
            @click="sendBtn"
            :disabled="isDisabled"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { Login, getSend } from "@/api/user.js";
import { Toast } from "vant";
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      isShowTime: false,
      isDisabled: false,
      user: {
        mobile: 15968378091,
        // mobile: 13911111112,
        code: 246810,
      },
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          {
            pattern: /^\d{6}$/,
            message: "验证码错误",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 登录按钮
    async onSubmit() {
      try {
        const res = await Login(this.user);
        console.log(res);
        // 登录成功以后获取的数据存储到vuex和本地存储当中
        this.$store.commit("setUser", res.data.data);
        Toast.success("登录成功");
        this.$router.push("/mine");
      } catch (e) {
        console.log(e);
        Toast.fail(e?.response?.data?.message || "出错了");
      }
    },
    // 验证码
    async sendBtn() {
      try {
        // 通过传入表单name值，决定校验哪个表单 validate(name?: string | string[])
        // Promise: 异步解决方案。 解决了什么问题？回调地域 >> 链式调用形式 >> 每一次then返回一个新的promise
        // async await >> 链式调用(不够优雅) >> 看起来是同步形式
        // 校验
        await this.$refs.form.validate("mobile");
      } catch (e) {
        console.log(e);
        return;
      }
      try {
        this.isDisabled = true;
        // 请求接口
        await getSend(this.user.mobile);
        this.isShowTime = true;
        this.$toast.success("发送验证码成功");
      } catch (e) {
        console.log(e);
        this.isShowTime = false;
        this.$toast.fail("验证码发送失败");
      } finally {
        this.isDisabled = false;
      }
    },
  },
};
</script>
<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-Sms-btn {
    width: 158px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    border-color: #07c160;
  }
}
</style>
