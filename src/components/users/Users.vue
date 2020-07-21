<template>
  <div class>
    <!-- 面包削区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 面包削 -->
      <el-row>
        <el-col :span="8" class="elCol">
          <el-input
            placeholder="请输入内容"
            v-model="usersData.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addClick">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- table列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeCurrent(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="bianjiClick(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deletClick(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button @click="fenpeijueseClick(scope.row)" type="warning" icon="el-icon-share"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersData.pagenum"
        :page-sizes="[6,10,20]"
        :page-size="usersData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 点击添加弹出对话框 -->
    <el-dialog title="添加用户" :visible.sync="isDialog" width="50%" @close="dialogClose">
      <!-- 添加表单区 -->
      <el-form
        :model="addFormDate"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormDate.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormDate.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormDate.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFormDate.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="quedingClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击编辑按钮对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="bianjieDialog" width="50%">
      <!-- 编辑表单 -->
      <el-form
        :model="bianjiData"
        :rules="bianjiRules"
        ref="bianjiruleForm"
        label-width="100px"
        class="demo-ruleForm"
        @close="resetClick"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="bianjiData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="bianjiData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="bianjiData.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjieDialog = false">取 消</el-button>
        <el-button type="primary" @click="bianjiUserClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="juesebuer" width="50%">
      <div>当前的用户 : {{yihangxinxi.username}}</div>
      <div class="juese">当前的角色 ： {{yihangxinxi.role_name}}</div>
      <div class="selected">
        分配新角色:
        <el-select v-model="xuzeId" placeholder="请选择">
          <el-option
            v-for="item in liebiaoData"
            :key="item.id"
            :label="item.roleDesc"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="juesebuer = false">取 消</el-button>
        <el-button type="primary" @click="fenpeiQuerenClick">确 定</el-button>
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
      //用户列表数据
      usersData: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每一页多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      //添加对话框布尔值
      isDialog: false,
      //添加的数据
      addFormDate: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加数据规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //编辑弹框
      bianjieDialog: false,
      //编辑数据
      bianjiData: {},
      //编辑规则
      bianjiRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //分配角色对话框的显示隐藏
      juesebuer: false,
      //角色一行信息
      yihangxinxi: {},
      //列表数据
      liebiaoData:{},
      //下拉菜单选择上的id
      xuzeId:'',
    };
  },
  created() {
    //获取列表数据
    this.getUserList();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //每页多少条数据发生改变时
    handleSizeChange(newSize) {
      this.usersData.pagesize = newSize;
      this.getUserList();
    },
    //改变页数时发生的改变
    handleCurrentChange(newPage) {
      this.usersData.pagenum = newPage;
      this.getUserList();
    },
    //添加用户
    addClick() {
      console.log(555);
      this.isDialog = true;
    },
    //取消按钮，数据复位
    resetClick() {
      this.$refs.bianjiruleForm.resetFields();
    },

    //监听事件
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },

    //网络请求，获取列表数据
    getUserList() {
      request({
        url: "users",
        method: "get",
        params: this.usersData
      }).then(res => {
        if (res.data.meta.status !== 200)
          return this.$message.error("请求数据失败");
        // console.log(res.data.data);
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    //修改状态事件函数
    changeCurrent(changeDate) {
      request({
        url: `users/${changeDate.id}/state/${changeDate.mg_state}`,
        method: "put"
      }).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取错误");
          changeDate.mg_state = !changeDate.mg_state;
        }
        this.$message.success("更新用户状态成功");
      });
    },
    //添加确定按钮，表单预验证，发起网络请求
    quedingClick() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        request({
          url: "users",
          method: "post",
          data: this.addFormDate
        }).then(res => {
          if (res.data.meta.status !== 201) {
            return this.$message.error("获取数据失败");
          }
          this.$message.success("添加用户成功");
          this.isDialog = false;
          this.getUserList();
        });
      });
    },
    //打开编辑按钮
    bianjiClick(id) {
      this.bianjieDialog = true;
      request({
        url: "users/" + id,
        method: "get"
      }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取数据失败");
        }
        console.log(res.data.data);
        this.bianjiData = res.data.data;
      });
    },
    //编辑信息
    bianjiUserClick() {
      this.$refs.bianjiruleForm.validate(valid => {
        if (!valid) return;
        request({
          url: "users/" + this.bianjiData.id,
          method: "put",
          data: {
            email: this.bianjiData.email,
            mobile: this.bianjiData.mobile
          }
        }).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取数据失败");
          }
          this.$message.success("更改信息成功");
          this.bianjieDialog = false;
          this.getUserList();
        });
      });
    },
    //删除数据
    deletClick(id) {
      this.$confirm("此操作将永久删除用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          //删除网络请求
          request({
            url: "users/" + id,
            method: "delete"
          }).then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除用户失败");
            }
            this.$message.success("删除用户成功");
            this.getUserList();
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击分配角色按钮
    fenpeijueseClick(libiao) {
      this.yihangxinxi = libiao;
      this.juesebuer = true;
      request({
        url: "roles",
        method: "get"
      }).then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取列表数据失败");
        }
        this.liebiaoData = res.data.data;
        console.log(this.liebiaoData)
      });
    },
    //分配权限确认
    fenpeiQuerenClick(){
      console.log(this.yihangxinxi)
      console.log(this.xuzeId)
      if(!this.xuzeId){
        return this.$message.error('请选择要分配的角色')
      }
      request({
        url:`users/${this.yihangxinxi.id}/role`,
        method:'put',
        data:{
          rid:this.xuzeId
        }
      }).then(res=>{
        console.log(res)
        if(res.data.meta.status!==200){
          this.$message.error('设置失败')
        }

      //问题没有结局 
      
      })
    }
  }
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
.elCol {
  margin-right: 30px;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}
.el-form-item {
  margin-right: 10px;
}
.juese {
  margin-top: 7px;
}
.selected{
  margin-top: 7px;
}
</style>