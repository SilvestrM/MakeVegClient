import Vue from 'vue'
import VueRouter from 'vue-router'
import Feed from '../views/Feed.vue'

import store from '../store/index'

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
    name: 'Settings',
    meta: { requiresAuth: true },
    component: () => import('../views/Settings.vue'),
    children: [
      {
        path: 'account',
        component: () => import('../views/settings/Account.vue')
      },
      {
        path: 'manage_users',
        meta: { isAdmin: true },
        component: () => import('../views/admin/Users.vue')
      },
      {
        path: 'manage_recipes',
        meta: { isAdmin: true },
        component: () => import('../views/admin/Recipes.vue')
      }
    ]
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
  //store.dispatch('initApp').then(() => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') !== store.state.loggedIn.tokens.authToken) {
      console.log(store.state.loggedIn.tokens.authToken);
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      //const user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (!store.state.loggedIn.tokens.adminToken) {
          next({ path: '/' })
        } else {
          next()
        }
      } else {
        next()
      }
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

  /* })
    .catch(reason => {
      throw new Error(`Init app failed... ${reason}`)
    }) */
})

export default router
