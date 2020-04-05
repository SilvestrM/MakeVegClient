import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Feed from '../views/Feed.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/discover'
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Feed
  },
  {
    path: '/recipe/:id',
    component: () => import(/* webpackChunkName: "about" */ '../views/Recipe.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
