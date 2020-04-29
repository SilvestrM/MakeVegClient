import Vue from 'vue'
import VueRouter from 'vue-router'
import Feed from '../views/Feed.vue'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [

  // Feed
  {
    path: '/',
    redirect: '/discover'
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Feed
  },

  // Guest Login
  {
    path: '/login',
    name: 'Login',
    meta: { guest: true },
    component: () => import('../views/Login.vue')
  },

  // Recipe
  {
    path: '/recipe/:id',
    component: () => import('../views/Recipe.vue')
  },

  // Recipe add/update
  {
    path: '/recipe/:id/update',
    meta: { requiresAuth: true },
    component: () => import('../views/UpdateRecipe.vue')
  },
  {
    path: '/add/recipe',
    meta: { requiresAuth: true },
    component: () => import('../views/AddRecipe.vue')
  },

  // User Profile
  {
    path: '/user/:id',
    component: () => import('../views/UserProfile.vue')
  },

  // Settings
  {
    path: '/user/:id/settings',
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

  // About
  {
    path: '/about',
    name: 'About',
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

  // Checks if route is requies user to be authenticated
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // Checks if user is authenticated
    if (localStorage.getItem('jwt') !== store.state.loggedIn.tokens.authToken) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      if (to.matched.some(record => record.meta.isAdmin)) {

        // Checks if user is admin
        if (!store.state.loggedIn.tokens.adminToken) {
          next({ path: '/' })
        } else {
          next()
        }
      } else {
        next()
      }
    }

    // Checks if route is requies user not to be authenticated
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
