<template>
  <div class="edit">
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose" center>
      <div slot="title" class="title">{{mode == "add"?"新增用户":"编辑用户"}}</div>

      <el-form :model="form" ref="formRef" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转态" prop="status">
          <el-select v-model="form.status" placeholder="请选择转态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "edituser",
  data() {
    return {
      dialogVisible: false,
      mode: "", // 模式，add 代表新增  edit 代表修改
      form: {
        username: "", // 用户名
        email: "", // 邮箱
        phone: "", // 手机号
        role_id: "", // 角色 1：超级管理员 2：管理员 3：老师 4：学生
        status: "", // 状态 1：启用 0：禁用
        remark: "" // 备注
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("邮箱不能为空"));
              }
              setTimeout(() => {
                //邮箱的正则
                var szReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
                if (!szReg.test(value)) {
                  return callback(new Error("邮箱不合法"));
                } else {
                  callback();
                }
              }, 1000);
            },
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("手机号不能为空"));
                return;
              }

              // 手机的正则
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法!"));
              }

              callback();
            },
            trigger: "blur"
          }
        ],
        role_id: [
          { required: true, message: "请选择用户角色", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择用户状态", trigger: "change" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    submit() {
      //   this.$refs.formRef.validate(valid => {
      //     if (valid) {
      //       if (this.mode == 'add') {
      //           this.$axios({
      //               url:'/user/add',
      //               method:'post',
      //               data: {
      //                   ...this.form
      //               },

      //           }).then(res=>{
      //               //成功回调
      //               console.log(res)
      //               if(res.data.code == 200){
      //                   this.$message({
      //                       message:this.mode == 'add'?'新增成功~':'编辑成功',
      //                       type:'success'
      //                   })
      //                   //关闭当前的对话框
      //                   this.dialogVisible = false

      //                   //刷新数据
      //                   this.$parent.search()
      //               }else{
      //                   this.$message.error(res.data.message)
      //               }
      //           });
      //       }
      //     } else {
      //       console.log("error submit!!");
      //       return false;
      //     }
      //   });

      this.$refs.formRef.validate(async valid => {
        if (!valid) return;

        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/user/add", this.form);
        } else {
          //修改编辑用户
        }

        if (res.data.code == 200) {
          //提示
          this.$message({
            message:this.mode =='add'?'新增成功~':'编辑成功~',
            type: "success"
          });
          //关闭当前的对话框
          this.dialogVisible = false;

          //刷新数据
          this.$parent.search()
        }else {
            this.$message.error(res.data.message)
        }
      });
    }
  }
};
</script>

<style lang="less">
.edit {
  .title {
    background: skyblue;
    height: 53px;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
}
</style>