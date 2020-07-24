<template>
  <div class>
    <!-- 面包削区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意,只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类 :</span>
          <el-cascader
            class="jilian"
            v-model="jilianshuzu"
            :options="listData"
            :props="shuxingProps"
            @change="jilianChange"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";
export default {
  components: {},
  data() {
    return {
      // 列表数据
      listData: [],
      //级联属性
      shuxingProps:{
        expandTrigger:'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择数组存储
      jilianshuzu:[]
    };
  },
  created() {
    this.getCatData();
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //获取商品分类列表数据
    getCatData() {
      request({
        url: "categories",
        method: "get",
      }).then((res) => {
        if (res.data.meta.status !== 200) {
          this.$message.error("获取列表数据失败");
        } else {
          this.listData = res.data.data;
          console.log(res);
        }
      });
    },
    //级联选择发生变化
    jilianChange(){
      console.log(this.jilianshuzu)
    }
  },
};
</script>
<style scoped>
.el-card {
  margin-top: 20px;
}
.el-row {
  margin-top: 20px;
}
.jilian{
  margin-left: 20px;
}
</style>