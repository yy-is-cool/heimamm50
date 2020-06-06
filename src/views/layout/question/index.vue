<template>
  <div>
    <!-- 搜索部分 -->
    <el-card>
      <el-form :model="form" ref="formRef" label-width="50px" inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" class="selectWidth" prop="subject">
              <el-select v-model="form.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="form.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="form.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="题型" prop="type">
              <el-select v-model="form.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="form.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value,name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="作者" prop="username">
              <el-input v-model="form.username" style="width:208px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转态" prop="status">
              <el-select v-model="form.status" placeholder="请选择转态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="form.create_date" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" style="width:500px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button type="default" @click="clear">清除</el-button>
              <el-button type="primary" @click="edit">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格内容 -->
    <el-card style="margin-top:15px">
      <el-table :data="questionList" border stripe>
        <el-table-column label="序号" width="50xpx" type="index"></el-table-column>
        <el-table-column label="题目" width="280px">
          <template slot-scope="scope">
            <div v-html="scope.row.title"></div>
          </template>
        </el-table-column>

        <!-- formatter 方法 -->
        <!-- <el-table-column label="学科.阶段" :formatter="formatterSubject"></el-table-column> -->

        <!-- 作用越自定义插槽 -->
        <el-table-column label="学科.阶段">
          <template slot-scope="scope">
            <span>{{scope.row.subject_name}}.{{stepObj[scope.row.type]}}</span>
          </template>
        </el-table-column>

        <!--这种方法没办法渲染题型，只会渲染出数字  -->
        <!-- <el-table-column label="题型" prop="type">
        </el-table-column>-->

        <!-- 用作用域插槽方法 -->
        <el-table-column label="题型">
          <template slot-scope="scope">
            <span>{{typeObj[scope.row.type]}}</span>
          </template>
        </el-table-column>

        <!-- 使用methods 方法 -->
        <!-- <el-table-column label="题型">
          <template slot-scope="scope">
            <span>
              {{ formatType(scope.row.type)}}
            </span>
          </template>
        </el-table-column>-->

        <!-- 方法三 formatter -->
        <!-- <el-table-column label="题型" prop="type" :formatter="formatterType">
        </el-table-column>-->

        <el-table-column label="企业" prop="enterprise_name"></el-table-column>
        <el-table-column label="创建着" prop="username"></el-table-column>
        <el-table-column label="访问量" prop="reads"></el-table-column>
        <el-table-column label="转态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status == 0?'red':'#6ac144'}"
            >{{scope.row.status == 0 ? '禁用':'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button type="primary">编辑</el-button>
            <el-button
              :type="scope.row.status == 0 ? 'success':'info'"
              @click="changeStatus(scope.row.id)"
            >{{scope.row.status == 0?'启用':'禁用'}}</el-button>
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="margin-top:15px; text-align:center">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10, 115]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>

    <QuestionEdit 
    ref="QuestionEditRef"
    :subjectList='subjectList'
    :enterpriseList='enterpriseList'
    :stepObj='stepObj'
    :typeObj='typeObj'
    :difficultyObj-='difficultyObj'
    >
    </QuestionEdit>
  </div>
</template>

<script>
import QuestionEdit from './question-add-or-update'
export default {
  name: "Question",
  components:{
    QuestionEdit
  },
  data() {
    return {
      form: {
        // 搜索的时候要传递给后台的
        subject: "", // 学科
        enterprise: "", // 企业
        step: "", // 阶段
        type: "", // 题型
        difficulty: "", // 难度
        username: "", // 作者
        status: "", // 状态 0 禁用 1 启用
        create_date: "", // 创建日期
        title: "" // 标题
      },
      subjectList: [], // 学科列表
      enterpriseList: [], //企业列表
      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" }, //难度

      //分页的数据
      questionList: [], //题库列表
      page: 1, //页码
      limit: 2, //页容量（每页加载多少条）
      total: 0 //总条数
    };
  },
  created() {
    // 获取所有的学科
    this.getSubjectListData();
    // 获取所有的企业
    this.getEnterpriseListData();

    //获取题库列表的数据
    this.getQuestionListData();
  },
  methods: {
    // 查询所有的学科列表
    async getSubjectListData() {
      const res = await this.$axios.get("/subject/list");
      console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    // 获取所有的企业列表
    async getEnterpriseListData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },

    // 分页获取题库列表
    async getQuestionListData() {
      const res = await this.$axios.get("/question/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.form
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },

    //分页 页容量发生了改变
    sizeChange(val) {
      this.limit = val;
      this.search();
    },

    //分页 当前页发生了改变
    currentChange(val) {
      this.page = val;
      this.getQuestionListData();
    },

    //搜索
    search() {
      this.page = 1;
      this.getQuestionListData();
    },

    //清除
    clear() {
      // 如果要调用 form 表单的 resetFields 这个方法，需要给 el-form-item 设置 prop
      this.$refs.formRef.resetFields();
      this.search();
    },

    //新增试题
    edit(){
      this.$refs.QuestionEditRef.dialogVisible = true
       this.$refs.QuestionEditRef.mode = 'add'
    },

    //更改转态
    async changeStatus(id) {
      const res = await this.$axios.post("/question/status", {
        id
      });
      // console.log(res);
      if (res.data.code == 200) {
        //提示
        this.$message({
          type: "success",
          message: "更改转态成功"
        });
        //刷新当前页面
        this.getQuestionListData();
      }
    },

    //使用methods方法 渲染题库类型
    formatType(val) {
      return this.typeObj[val];
    },

    //formatter 方法
    // formatterType(row){
    //   return this.typeObj[row.type]
    // },

    //格式化学科和阶段
    // formatterSubject(row){
    //   return `${row.subject_name}.${this.stepObj[row.step]}`
    // }

    async del(id) {
      this.$confirm("确定删除该条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$axios.post("/question/remove", {
          id
        });
        if (res.data.code == 200) {
          //提示
          this.$message({
            type: "success",
            message: "删除成功"
          });
          //刷新当前页面
          this.search();
        }
      });
    }
  }
};
</script>

<style>
</style>