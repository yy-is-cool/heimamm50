<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i @click="isCollapse = !isCollapse" style="font-size: 20px;" class="el-icon-s-fold"></i>
        <img src="../../assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt="">
        <span class="name">{{username}} 欢迎你</span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="auto">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          router
          :collapse="isCollapse"
        >
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="background-color:#e8e9ec">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "../../utils/token";
export default {
  data() {
    return {
      avatar: "", //用户头像
      username: "", //呢称
      isCollapse: false,//是否收起折叠菜单
      defaultActive:''//菜单默认选项中的值
    };
  },
  created() {
    this.getUserInfoData();
    this.defaultActive = this.$route.fullPath
  },
  methods: {
    //获取用户信息
    async getUserInfoData() {
      const res = await this.$axios.get("/info", {
        // headers: {
        //   token: getToken(),
        // },
      });
      if (res.data.code == 200) {
        this.avatar = process.env.VUE_APP_BASEURL + '/' + res.data.data.avatar;
        this.username = res.data.data.username;
      } else if (res.data.code == 206) {
        // 删除token
        // 跳转回登录页面
      }
    },
    //退出
    logout() {
      this.$confirm("确定退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");
          if (res.data.code == 200) {
            removeToken();
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='less'>
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>