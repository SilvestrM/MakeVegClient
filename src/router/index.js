import Vue from 'vue'
import VueRouter from 'vue-router'
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
    path: '/login',
    name: 'Login',
    meta: { guest: true },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/recipe/:id',
    component: () => import('../views/Recipe.vue')
  },
  {
    path: '/add/recipe',
    meta: { requiresAuth: true },
    component: () => import('../views/AddRecipe.vue')
  },
  {
    path: '/user/:id/recipes',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/user/:id',
    name: 'Account',
    meta: { requiresAuth: true },
    component: () => import('../views/Account.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      //const user = JSON.parse(localStorage.getItem('user'))
      /* if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next()
        }
        else {
          next({ name: 'userboard' })
        }
      } else {
        next()
      }*/
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next()
    }
    else {
      next({ name: 'Discover' })
    }
  } else {
    next()
  }
})

export default router
