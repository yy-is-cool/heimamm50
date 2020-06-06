<template>
  <div>
    <!-- 搜索部分 -->
    <el-card>
      <el-form :model="form" ref="form" label-width="50px" inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="学科" class="selectWidth">
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
            <el-form-item label="阶段">
              <el-select v-model="form.step" placeholder="请选择阶段">
                <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业">
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
            <el-form-item label="题型">
              <el-select v-model="form.type" placeholder="请选择题型">
                <el-option v-for="(value,name) in typeObj" :key="name" :label="value" :value="name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="难度">
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
            <el-form-item label="作者">
              <el-input v-model="form.username"  style="width:208px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转态">
              <el-select v-model="form.status" placeholder="请选择转态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker v-model="form.create_date" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="form.title"  style="width:500px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary">搜索</el-button>
              <el-button type="default">清除</el-button>
              <el-button type="primary">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Question",
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
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" } //难度
    };
  },
  created() {
    // 获取所有的学科
    this.getSubjectListData();
    // 获取所有的企业
    this.getEnterpriseListData();
  },
  methods: {
    async getSubjectListData() {
      const res = await this.$axios.get("/subject/list");
      console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },

    async getEnterpriseListData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    }
  }
};
</script>

<style>
</style>