import { createRouter, createWebHistory } from 'vue-router';
import Login from "./components/LoginForm.vue"
import Dashboard from './components/DashboardHome.vue';
import Leads from './components/LeadList.vue';
import Applications from './components/ApplicationList.vue';
import Counselors from './components/CounselorsList.vue';
import NotFound from './components//NotFound.vue';

// Middleware to check authentication
const isAuthenticated = () => !!localStorage.getItem('token');

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/leads', 
    name: 'Leads', 
    component: Leads, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/applications', 
    name: 'Applications', 
    component: Applications, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/counselors', 
    name: 'Counselors', 
    component: Counselors, 
    meta: { requiresAuth: true } 
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
