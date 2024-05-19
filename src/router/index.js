import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Register from '../views/Register.vue';
import Feed from '../views/Feed.vue';
import Signin from '../views/Signin.vue';
import VerifyEmail from '../views/VerifyEmail.vue'; // Ensure you have this view
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/feed',
    name: 'feed',
    component: Feed,
    meta: {
      requiresAuth: true,
      requiresEmailVerified: true
    }
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      if (to.matched.some((record) => record.meta.requiresEmailVerified)) {
        if (user.emailVerified) {
          next();
        } else {
          alert('Please verify your email to access this page.');
          next('/verify-email');
        }
      } else {
        next();
      }
    } else {
      alert('You do not have access to this page.');
      next('/');
    }
  } else {
    next();
  }
});

export default router;

