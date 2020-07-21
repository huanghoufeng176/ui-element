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
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              :key="item.id"
              :span="5"
              :class="['bb',index=='0'?'bt':'']"
            >
              <!-- 一级权限渲染 -->
              <el-col class="vcenter">
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <el-tag @close="deleteClickEvent(scope.row,item.id)" closable>{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                </el-col>
                <el-col :span="19">
                  <div class="grid-content bg-purple-light">
                    <el-row
                      :class="[index1!==0?'bt':'','vcenter']"
                      v-for="(item1,index1) in item.children"
                      :key="item1.id"
                    >
                      <el-col :span="5">
                        <div class="grid-content bg-purple">
                          <el-tag
                            @close="deleteClickEvent(scope.row,item1.id)"
                            closable
                            type="success"
                          >{{item1.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </div>
                      </el-col>
                      <el-col :span="19">
                        <div class="grid-content bg-purple-light">
                          <el-tag
                            @close="deleteClickEvent(scope.row,item2.id)"
                            closable
                            type="warning"
                            v-for="item2 in item1.children"
                            :key="item2.id"
                          >{{item2.authName}}</el-tag>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-col>
              <!-- 二级和三级渲染 -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="bianjiClick(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteClick(scope.row.id)"
            >删除</el-button>
            <el-button @click="addquanxianList(scope.row)" size="mini" type="warning" icon="el-icon-share">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加按钮对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialog" width="50%">
      <!-- 添加角色表单区 -->
      <el-form
        :model="addRoleDate"
        :rules="ruleRoleForm"
        ref="ruleRefForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleDate.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleDate.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="quxiaoClick">取 消</el-button>
        <el-button type="primary" @click="quedingClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击便捷按钮跳出来的对话框 -->
    <el-dialog title="编辑" :visible.sync="bianjixianshi" width="50%">
      <!-- 编辑角色表单区 -->
      <el-form
        :model="bianjieData"
        :rules="bianjiRules"
        ref="ruleRefForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="bianjieData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="bianjieData.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjiquxiao">取 消</el-button>
        <el-button type="primary" @click="bianjiqueren">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击分配权限跳出来对话框 -->
    <el-dialog @close="guanbiDialog" title="分配权限" :visible.sync="fenpeiquanxian" width="50%">
      <!-- 展示树形结构 -->
      <el-tree ref="quanxianRef" :default-checked-keys="defKeys" :default-expand-all="true" node-key="id" show-checkbox :data="addquanxianData" :props="treeShuxing"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenpeiquanxian = false">取 消</el-button>
        <el-button type="primary" @click="quedingQingqiu">确 定</el-button>
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
      addDialog: false,
      //添加数据绑定
      addRoleDate: {
        roleName: "",
        roleDesc: ""
      },
      //添加数据验证规则
      ruleRoleForm: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //便捷数据
      bianjieData: {
        roleName: "",
        roleDesc: ""
      },
      //编辑规则
      bianjiRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ]
      },
      //编辑对话框是否隐藏
      bianjixianshi: false,
      //分配权限是否隐藏
      fenpeiquanxian:false,
      //获取权限列表数据
      addquanxianData:[],
      //树形属性
      treeShuxing:{
        children:'children',
        label:'authName'
      },
      //默认选择的树形结果
      defKeys:[],
      //角色权限id
      roleId:''
    };
  },
  created() {
    this.getRoleData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //添加按钮
    addRoule() {
      this.addDialog = true;
    },
    //添加列表中取消按钮
    quxiaoClick() {
      this.addDialog = false;
      this.$refs.ruleRefForm.resetFields();
    },
    //编辑取消
    bianjiquxiao() {
      this.bianjixianshi = false;
      // this.$refs.ruleRefForm.resetFields()
    },
    

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
    //添加对话框中，确定按钮发送网络请求添加数据
    quedingClick() {
      this.$refs.ruleRefForm.validate(valid => {
        if (!valid) {
          this.$message.error("校验失败");
        }
        this.addDialog = false;
        request({
          url: "roles",
          method: "post",
          data: this.addRoleDate
        }).then(res => {
          if (res.data.meta.status !== 201) {
            this.$message.error("请求添加列表数据失败");
          }
          this.getRoleData();
        });
      });
    },
    //打开编辑按钮
    bianjiClick(id) {
      this.bianjixianshi = true;
      request({
        url: "roles/" + id,
        method: "get",
        params: this.bianjieData
      }).then(res => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取编辑数据失败");
        }
        this.bianjieData = res.data.data;
      });
    },
    //编辑确认
    bianjiqueren() {
      // console.log(this.bianjieData)
      request({
        url: "roles/" + this.bianjieData.roleId,
        method: "put",
        data: {
          roleName: this.bianjieData.roleName,
          roleDesc: this.bianjieData.roleDesc
        }
      }).then(res => {
        this.$refs.ruleRefForm.validate(valid => {
          if (!valid) {
            this.$message.error("表单验证失败");
          }
          this.bianjieData = res.data.data;
          this.getRoleData();
          this.bianjixianshi = false;
        });
      });
    },
    //删除信息
    deleteClick(id) {
      // console.log(id)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          request({
            url: "roles/" + id,
            method: "delete"
          }).then(res => {
            if (res.data.status !== 200) {
              this.$message.error("获取删除数据失败");
            }
            this.$message.success("删除数据成功");
            this.getRoleData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //删除三级权限
    deleteClickEvent(role, right) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          request({
            url: `roles/${role.id}/rights/${right}`,
            method: "delete"
          }).then(res => {
            if (res.data.meta.status !== 200) {
              this.$message.error("取消权限失败");
            }
            role.children = res.data.data;
            this.$message.success("取消权限成功");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击分配权限展示树形列表
    addquanxianList(role) {
      this.roleId=role.id
      request({
        url:'rights/tree',
        method:'get'
      }).then(res=>{
        if(res.data.meta.status!==200){
          this.$message.error('获取权限列表数据失败')
        }
        //调用递归函数选节点 
        this.getLeafKeys(role,this.defKeys)
        this.addquanxianData=res.data.data
        console.log(res)
      })
      this.fenpeiquanxian=true
    },
    //通过递归的形式，将获取角色下所有三级权限的id，并保存到
    //defKeys中
    getLeafKeys(node,arr){
      //如果此节点是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //不是的话则遍历每个children节点
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    //关闭对话框，清空数组的选择
    guanbiDialog(){
      this.defKeys=[]
    },
    //点击确定按钮分配角色成功
    quedingQingqiu(){
      const arr=[
        ...this.$refs.quanxianRef.getCheckedKeys(),
        ...this.$refs.quanxianRef.getHalfCheckedKeys(),
      ]
      const arr1=arr.join(',')
      console.log(arr)
      request({
        url:`roles/${this.roleId}/rights`,
        method:'post',
        data:{
          rids:arr1
        }
      }).then(res=>{
        if(res.data.meta.status!==200){
          this.$message.error('获取数据失败')
        }
        this.$message.success('分配权限成功')
        this.getRoleData()
      })
      this.fenpeiquanxian=false
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
.el-tag {
  margin: 7px;
}
.bt {
  border-top: 1px solid #eee;
}
.bb {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>