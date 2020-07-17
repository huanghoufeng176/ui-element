<template>
  <div class>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 权限列表表格 -->
      <el-table :data="quanxianData" style="width:100%" width="180" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">标签一</el-tag>
            <el-tag v-else-if="scope.row.level=='1'" type="success">标签二</el-tag>
            <el-tag v-else type="warning">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";
export default {
  components: {},
  data() {
    return {
      //权限列表数据
      quanxianData: []
    };
  },
  created() {
    //获取权限列表数据
    this.getquanxianlist();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    getquanxianlist() {
      request({
        url: "rights/list",
        method: "get"
      }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message("获取权限列表失败");
        }
        console.log(res)
        this.quanxianData = res.data.data;
      });
    }
  }
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
</style>