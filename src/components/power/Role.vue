<template>
  <div class>
    <!-- 面包肖 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" class="zhuyaoButton" @click="addRoule">添加角色</el-button>

      <!-- 添加角色表格 -->
      <el-table :data="roleListData" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-share">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加按钮对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialog" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "../../network/request";
export default {
  components: {},
  data() {
    return {
      //角色列表数据
      roleListData: [],
      //添加对话框，显示隐藏
      addDialog:false,
    };
  },
  created() {
    this.getRoleData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //获取角色列表数据
    getRoleData() {
      request({
        url: "roles",
        method: "get"
      }).then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取角色列表数据失败");
        }
        // console.log(res);
        this.roleListData = res.data.data;
      });
    },
    //添加角色数据
    addRoule() {
      this.addDialog=true
      request({
        url:'roles',
        method:'post',
        data:{
          roleName:this.roleListData.roleName,
          roleDesc:this.roleListData.roleDesc
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
.zhuyaoButton {
  margin-bottom: 20px;
}
</style>