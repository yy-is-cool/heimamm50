<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>

      <!-- form表单部分 -->
      <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-user" placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="18">
            <el-col :span="16">
              <el-input prefix-icon="el-icon-key" placeholder="请输入验证码" v-model="loginForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="getCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="http://www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="loginClick">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
    <!-- 注册子组件 -->
    <!--方法A <register :isShow='isShow'></register> -->
    <register ref="registerRef"></register>
  </div>
</template>

<script>
//按需导入 token
import { setToken } from "../../utils/token"; 
// 导入注册子组件
import register from './register'

export default {
  name: "Login",

//注册子组件
  components:{
    register
  },

  data() {
    return {

      // 方法A
      // isShow:false,

      // 验证码的地址
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login",

      loginForm: {
        // 模型
        phone: "18511111111", // 手机号
        password: "12345678", //密码
        code: "", //验证码
        isCheck: true //默认勾选用户协议
      },
      rules: {
        // 校验规则
        phone: [
          //   { required: true, message: "请输入手机号", trigger: "blur" },
          //   { min: 11, max: 11, message: "手机号必须是11位", trigger: "blur" }

          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }

              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "密码要6到12位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码要4位", trigger: "blur" }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须勾选用户协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    console.log("开发阶段的基准路径", process.env.VUE_APP_BASEURL);
  },
  methods: {
    getCode() {
      // url 地址缓存了 图形验证码地址不会刷新
      // this.codeURL = process.env.VUE_APP_BASEURL + "/captcha?type=login"
      // this.codeURL = process.env.VUE_APP_BASEURL + "/captcha?type=login&r"+Math.random()
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=login&t" +
        (new Date() - 0);
    },
  //登陆
    loginClick() {
      // 本质用的promise .then()方法解决回调地狱,但.then()写多了就又是那样了
      //  用async  awit方法

      /*this.$refs.loginFormRef.validate((valid)=>{
        console.log(valid+"2222222222222222222");
        if(!valid) return 

        // 发送请求给后台进行登陆
        this.$axios.post('/login',this.loginForm).then(res=>{
            if (res.data.code === 200) {
              // this.$message.success(res.data.message)
              this.$message({
                message:"登陆成功~",
                type:'success'
              })
            } else {
              this.$message.error(res.data.message)
            }
        })
      }) */

      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid + "2222222222222222222");
        if (!valid) return;

        const res = await this.$axios.post("/login", this.loginForm);
        if (res.data.code === 200) {
          // this.$message.success(res.data.message)
          this.$message({
            message: "登陆成功~",
            type: "success"
          });

          // 保存token
          setToken(res.data.data.token);

          // 跳转到后台管理页面
          this.$router.push("/layout");
        } else {
          this.$message.error(res.data.message);
          // this.codeURL =
            // process.env.VUE_APP_BASEURL +
            // "/captcha?type=login$t" +
            // (new Date() - 0);

            this.codeURL =
            process.env.VUE_APP_BASEURL +
            "/captcha?type=login&t=" +
            (new Date() - 0);
        }
      });
    },
  //注册
    registerClick(){
      // 方法A
      // this.isShow = true

      this.$refs.registerRef.dialogVisible = true
    }
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>