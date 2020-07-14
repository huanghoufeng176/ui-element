<template>
  <div class="login">
    <!-- 登录盒子 -->
    <div class="loginBox">
      <!-- 登录图片 -->
      <div class="loginImg">
        <img src="~assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="ruleForm" :rules="loginFormRules" :model="loginForm" label-width="0px" class="demo-ruleForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="dengluButton">登录</el-button>
          <el-button type="info" @click="loginButton">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//网络封装引入
import {request} from '../network/request'
// import axios from 'axios'

export default {
  components:{},
  data(){
    return {
      //表单数据
      loginForm:{
        //用户名
        username:'admin',
        //密码
        password:'123456'
      },
      //表单验证规则
      loginFormRules:{
        //用户名
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      //网络请求数据
      netLoginData:''
    }
  },
  created(){},
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    //表单重置
    loginButton(){
      this.$refs.ruleForm.resetFields()
    },
    //表单预验证，发起网络请求
    dengluButton(){
      this.$refs.ruleForm.validate(valid=>{
        if(!valid) return;
        // axios.post('http://timemeetyou.com:8889/api/private/v1/login',this.loginForm).then(res=>{
        //   console.log(res)
        // })
        request({
          method:'post',
          url:'login',
          data:this.loginForm
        }).then(res=>{
          if(res.data.meta.status!==200){
            console.log('登录失败')
          }else{
            this.$message.success('登录成功')
            this.netLoginData=res
            console.log(res.data)
            window.sessionStorage.setItem('token',res.data.data.token)
            this.$router.push('/home')
          }
        })
      })	
    }
    //
  },
}
</script>
<style scoped>
.login{
  height: 100%;
  background-color: #264A6B;
}
.loginBox{
  width: 500px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -175px;
}
.loginImg{
  width: 150px;
  height: 150px;
  border: 1px solid #F1F3F4;
  border-radius: 50%;
  padding: 10px;
  position:absolute;
  left: 50%;
  margin-left: -85px;
  margin-top: -85px;
}
.loginImg img{
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #ECEEEB;
}
.el-form{
  margin-top: 120px;
  padding: 20px;
}
.btn{
  display: flex;
  justify-content: flex-end;
}
</style>