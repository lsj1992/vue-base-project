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
    redirect: '/adminRole'
  },
  {
    path: '/adminRole',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    redirect: '/adminRole/index',
    meta: {
      title: '角色管理',
      icon: 'adminRole',
      roles: ['admin', 'editor'] // 用来做权限控制
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/adminCtrl/index'),
        name: 'adminCtrl',
        meta: { title: '角色管理', noCache: true }
      },
      {
        path: 'userRuleCtrl',
        component: () => import('@/views/adminCtrl/userRuleCtrl'),
        name: 'userRuleCtrl',
        meta: { title: '用户角色管理', noCache: true }
      }
    ]
  },
  {
    path: '/workFlowCtrl',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    redirect: '/workFlowCtrl/index',
    // redirect: 'noredirect',
    meta: {
      title: '工作流管理',
      icon: 'workFlow',
      roles: ['admin', 'editor'] // 用来做权限控制
    },
    children: [
      {
        path: 'index',
        name: 'workFlowCtrl',
        component: () => import('@/views/workFlowCtrl/index'),
        meta: { title: '工作流列表', noCache: true }
      },
      {
        path: 'workFlowAuth',
        component: () => import('@/views/workFlowCtrl/workFlowAuth'),
        name: 'workFlowAuth',
        meta: { title: '工作流权限', noCache: true }
      }
    ]
  },
  {
    path: '/bannerCtrl',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    redirect: '/bannerCtrl/index',
    // redirect: 'noredirect',
    meta: {
      title: '轮播管理',
      icon: 'bannerSwper',
      roles: ['admin', 'editor'] // 用来做权限控制
    },
    children: [
      {
        path: 'index',
        name: 'bannerCtrl',
        component: () => import('@/views/bannerCtrl/index'),
        meta: { title: '轮播列表', noCache: true }
      },
      {
        path: 'imagesCtrl',
        name: 'imagesCtrl',
        component: () => import('@/views/bannerCtrl/imagesCtrl'),
        meta: { title: '图片管理', noCache: true }
      }
    ]
  },
  {
    path: '/codeTableCtrl',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    redirect: '/codeTableCtrl/index',
    // redirect: 'noredirect',
    meta: {
      title: '码表管理',
      icon: 'codeTable',
      roles: ['admin', 'editor'] // 用来做权限控制
    },
    children: [
      {
        path: 'index',
        name: 'codeTableCtrl',
        component: () => import('@/views/codeTableCtrl/index'),
        meta: { title: '码表管理', noCache: true }
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
