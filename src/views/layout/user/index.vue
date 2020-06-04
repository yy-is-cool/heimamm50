<template>
  <div>
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline label-width="80px" :model="searchForm" ref="searchFormRef">
        <el-form-item label="用户名称" prop="username">
          <el-input style="width:150px" v-model="searchForm.username"></el-input>
        </el-form-item>

        <el-form-item label="用户邮箱" prop="email">
          <el-input style="width:150px" v-model="searchForm.email"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role_id">
          <el-select placeholder="请选择转态" style="width:150px" v-model="searchForm.role_id">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="clear">清除</el-button>
          <el-button type="primary" @click="addUser">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 内容部分 -->
    <el-card style="margin-top:20px">
      <!-- 表格 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="序号" type="index" width="80px"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="200px"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="转态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:red">禁用</span>
            <span v-if="scope.row.status == 1" style="color:blue">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editUser">编辑</el-button>
            <el-button
              :type="scope.row.status == 0 ? 'succes' : 'info'"
              @click="changeStatus(scope.row.id)"
            >{{scope.row.status == 0 ? '启用':'禁用'}}</el-button>
            <el-button type="default" @click="deleteUser(scope.row.id,scope.row.username)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top:15px; text-align:center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 使用子组件 -->
    <UserEdit ref="userEditRef"></UserEdit>
  </div>
</template>

<script>
//导入编辑，新增 子组件
import UserEdit from "./addUser_or_editUser";

export default {
  // 注册
  components: {
    UserEdit
  },

  data() {
    return {
      searchForm: {
        username: "",
        email: "",
        role_id: ""
      },
      userList: [],
      page: 1,
      limit: 2,
      total: 0
    };
  },

  created() {
    this.getUserListData();
  },

  methods: {
    getUserListData() {
      this.$axios({
        url: "/user/list",
        method: "get",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      }).then(res => {
        //成功回调
        // console.log(res);
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserListData();
    },

    search() {
      this.page = 1;
      this.getUserListData();
    },

    clear() {
      //方法1
      // this.searchForm.username = '',
      // this.searchForm.email = '',
      // this.searchForm.role_id = '',

      //方法2
      this.$refs.searchFormRef.resetFields();

      this.search();
    },
    async changeStatus(id) {
      const res = await this.$axios({
        url: "/user/status",
        method: "post",
        data: {
          id
        }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改转态成功~",
          type: "success"
        });
        //重新查询
        this.search();
      }
    },

    //删除用户
    deleteUser(id, username) {
      this.$confirm(`此操作将删除${username}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$axios.post("/user/remove", { id });

        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });

          //重新刷新
          this.search();
        }
      });
    },


    //新增用户
    addUser() {
      this.$refs.userEditRef.dialogVisible = true;
      this.$refs.userEditRef.mode = "add";
    },

    editUser(){
      this.$refs.userEditRef.dialogVisible = true;
      this.$refs.userEditRef.mode = "edit";

      JOSN.parent
    }
  }
};
</script>

<style>
</style>