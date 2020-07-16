<template>
  <div class="home">
    <!-- 主体页面 -->
    <el-container>
      <!-- 登录头部 -->
      <el-header>
        <!-- 左侧图片区 -->
        <div class="img">
          <img src="~assets/123.jpg" alt />
          <span class="wenzi">电商后台管理系统</span>
        </div>
        <el-button type="info" @click="tuichuButton">退出</el-button>
      </el-header>
      <!-- 登录主体 -->
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <!-- 收起小按钮 -->
          <div class="toggle-button" @click="toggleClick">|||</div>
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#313743"
            text-color="#fff"
            active-text-color="#4471B1"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu :index="item.id+''" v-for="item in menuData.data" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]" class="icon"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="menuItemClick('/'+subItem.path)">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
              </el-menu-item>  
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {request} from '../network/request'
export default {
  components: {},
  data() {
    return {
      //左侧列表数据
      menuData:'',
      //左侧列表图标
      iconObj:{
        '125':'iconfont icon-yonghuguanli',
        '103':'iconfont icon-quanxianguanli',
        '101':'iconfont icon-shangpinguanli',
        '102':'iconfont icon-dingdanguanli',
        '145':'iconfont icon-shujutongji',
      },
      //侧边栏折叠
      isCollapse:false,
      //点击高亮
      activePath:''
    };
  },
  created() {
    //左侧边栏数据
    this.getMenuList()
    //取出高亮的值
    this.activePath=window.sessionStorage.getItem('activepath')
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //登录退出
    tuichuButton() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //按钮折叠侧边栏
    toggleClick(){
      this.isCollapse=!this.isCollapse
    },
    //点击高亮显示
    menuItemClick(activepath){
      window.sessionStorage.setItem('activepath',activepath)
      this.activePath=activepath
    },
    //网络请求
    //获取左侧菜单数据
    getMenuList(){
      request({
        url:'menus',
        method:'get'
      }).then(res=>{
        if(!res.data.meta.status==200) return this.$message.error(res.data.meta.msg)
        this.menuData=res.data
        // console.log(this.menuData)
      })
    }
  }
};
</script>
<style scoped>
.home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.img {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
}
.wenzi {
  margin-left: 20px;
}
.el-submenu {
  color: #fff;
}
.icon{
  margin-right: 10px;
}
.el-menu{
  border-right: 0;
}
.toggle-button{
  background-color: #475163;
  font-size: 10px;
  line-height: 22px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>