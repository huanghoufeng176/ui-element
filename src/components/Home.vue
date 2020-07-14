<template>
  <div class="">
    <el-button type="info" @click="tuichuButton">退出</el-button>
  </div>
</template>

<script>
export default {
  components:{},
  data(){
    return {
    }
  },
  created(){},
  mounted(){},
  watch:{},
  computed:{},
  methods:{
    //登录退出
    tuichuButton(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
}
</script>
<style scoped>
</style>