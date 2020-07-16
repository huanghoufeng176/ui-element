import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//网上抄来，解决路由重复报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


const Login = () => import('components/Login.vue')
const Home = () => import('components/Home.vue')
const Welcome = () => import('components/Welcome.vue')
const Users = () => import('components/users/Users.vue')

const router =new VueRouter({
  routes:[
    {path:'',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,redirect:'/welcome',children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
    ]}
  ],
  mode:'history'
})

//路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('login')
  next()
})

export default router