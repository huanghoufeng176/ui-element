<template>
  <div class>
    <!-- 面包削部分 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addFenleiClick">添加分类</el-button>
      <!-- 获取数据列表区 -->
      <tree-table
        class="treeTable"
        :data="categories"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效模板列 -->
        <template slot="isOk" slot-scope="scop">
          <i class="el-icon-success" v-if="!scop.row.cat_deleted" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:lightgreen"></i>
        </template>
        <!-- 排序模板列 -->
        <template slot="order" slot-scope="scop">
          <el-button type="primary" v-if="scop.row.cat_level==0">一级</el-button>
          <el-button type="success" v-else-if="scop.row.cat_level==1">二级</el-button>
          <el-button type="warning" v-else>三级</el-button>
        </template>
        <!-- 操作模板列 -->
        <template slot="caozuo" slot-scope="scop">
          <el-button
            @click="bainjieClick(scop.row.cat_id)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >编辑</el-button>
          <el-button @click="deleteClick" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        class="fenye"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </el-card>

    <!-- 点击添加分类，弹出的对话框 -->
    <el-dialog @close="addCloseShijian" title="添加分类" :visible.sync="addFenlei" width="50%">
      <!-- form表单区 -->
      <el-form
        :model="addFenleiData"
        :rules="addFenleirules"
        ref="addFenleiruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addFenleiData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类 :">
          <!-- 级联选择框 -->
          <!-- options绑定数据源 -->
          <!-- v-model 选中的id -->
          <el-cascader
            v-model="parentId"
            :options="parentData"
            @change="jilianChang"
            :props="shuxingProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addFenlei = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync="bianjieDia" width="50%">
      <!-- 分类名称 -->
      <el-form ref="fenleiform" :model="chanxunData" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="chanxunData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjieDia = false">取 消</el-button>
        <el-button type="primary" @click="bianjiequerenClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "network/request.js";
export default {
  components: {},
  data() {
    return {
      //网络请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //获取商品分类数据
      categories: [],
      //总页数
      totalPage: 0,
      //表格各列的配置
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "caozuo",
        },
      ],
      // 添加分类显示隐藏
      addFenlei: false,
      // 添加分类表单数据
      addFenleiData: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      // 添加分类表单验证规则
      addFenleirules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      // 父级列表数据
      parentData: [],
      // 选中数据的id数组
      parentId: [],
      //选择器的属性
      shuxingProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      //编辑对话框，显示与否
      bianjieDia: false,
      //查询数据
      chanxunData: {},
    };
  },
  created() {
    this.categorie();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //商品分类数据请求
    categorie() {
      request({
        url: "categories",
        method: "get",
        params: this.queryInfo,
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取分类管理列表数据失败");
        }
        // console.log(res);
        this.categories = res.data.data.result;
        this.totalPage = res.data.data.total;
      });
    },
    //pagesize发生变化
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize;
      this.categorie();
    },
    //页数变化时
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.categorie();
    },
    //点击添加分类按钮
    addFenleiClick() {
      this.addFenlei = true;
      this.getParentData();
    },
    //获取父级数据
    getParentData() {
      request({
        url: "categories",
        method: "get",
        params: {
          type: 2,
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取父级数据失败");
        }
        this.parentData = res.data.data;
        console.log(res);
      });
    },
    // 级联发生改变的触发函数
    jilianChang() {
      console.log(this.parentId);
      console.log(this.parentId.length);
      if (this.parentId.length > 0) {
        this.addFenleiData.cat_pid = this.parentId[this.parentId.length - 1];
        this.addFenleiData.cat_level = this.parentId.length;
      } else {
        this.addFenleiData.cat_pid = 0;
        this.addFenleiData.cat_level = 0;
      }
      console.log(this.addFenleiData);
    },
    //取消表单事件，数据重置为0
    addCloseShijian() {
      this.$refs.addFenleiruleForm.resetFields();
      this.parentId = [];
      this.addFenleiData.cat_pid = 0;
      this.addFenleiData.cat_level = 0;
    },
    //点击添加分类确定按钮
    addCate() {
      this.$refs.addFenleiruleForm.validate((valid) => {
        if (!valid) return;
        request({
          url: "categories",
          method: "post",
          data: this.addFenleiData,
        }).then((res) => {
          if (res.data.meta.status != 201) {
            this.$message.error("获取添加数据失败");
          }
          this.$message.success("添加分类成功");
          this.categorie();
          this.addFenlei = false;
        });
      });
    },
    //点击分类编辑
    bainjieClick(id) {
      this.bianjieDia = true;
      request({
        url: "categories/" + id,
        method: "get",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error("查询数据失败");
        }
        this.chanxunData = res.data.data;
      });
    },
    //点击编辑确认按钮
    bianjiequerenClick() {
      this.bianjieDia = false;
      request({
        url: "categories/" + this.chanxunData.cat_id,
        method: "put",
        data: {
          cat_name: this.chanxunData.cat_name,
        },
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error("修改失败");
        }
        this.categorie();
        this.$message.success("修改成功");
      });
    },
    //删除数据
    deleteClick() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url:'categories/' + this.chanxunData.cat_id,
            method:'delete',
          }).then(res=>{
            // console.log(res)
            if(res.data.meta.status!==200){
              this.$message.error('删除失败')
              return
            }
            this.categorie()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
.treeTable {
  margin-top: 20px;
}
.fenye {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>