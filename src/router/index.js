import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    redirect: '/projectManage'
  },
  {
    path: '/projectManage',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    redirect: '/projectManage/create',
    meta: {
      title: '项目管理',
      icon: 'adminRole',
      keepAlive: false, // 用来区分是否需要缓存
      roles: ['admin', 'editor'] // 用来做权限控制，暂时没有权限管理，roles必须加上admin才能让菜单栏显示出来
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/projectManage/createProject/index'),
        name: 'createProject',
        keepAlive: false,
        meta: { title: '创建项目', keepAlive: false, noCache: true }
      },
      {
        path: 'addProject',
        component: () => import('@/views/projectManage/addProject/index'),
        name: 'addProject',
        meta: { title: '用户角色管理', keepAlive: false, noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     roles: ['admin', 'editor'],
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //     { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }}
  //   ]
  // },

  // { path: '*', redirect: '/404', hidden: true }
]
