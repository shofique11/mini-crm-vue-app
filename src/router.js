import { createRouter, createWebHistory } from 'vue-router';
import Login from "./components/LoginForm.vue"
import Dashboard from './components/DashboardHome.vue';
import Leads from './components/LeadList.vue';
import Applications from './components/ApplicationList.vue';
import Counselors from './components/CounselorsList.vue';
import CreateLead from './components/CreateLead.vue';
import NotFound from './components//NotFound.vue';
import RegisterCRM from './components/RegisterCRM.vue';
import AssignedLead from './components/AssignedLead.vue';
import CounselorApplication from './components/CounselorApplication.vue';
import AdminDashboard from './components/adminDashboard.vue';
import CounselorDashboard from './components/CounselorDashboard.vue';

// Middleware to check authentication
const isAuthenticated = () => !!localStorage.getItem('token');

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'RegisterCRM', component: RegisterCRM },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin-dashboard', 
    name: 'AdminDashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/counselor-dashboard', 
    name: 'CounselorDashboard', 
    component: CounselorDashboard,
    meta: { requiresAuth: true, role: 'counselor' }
  },
  { 
    path: '/leads', 
    name: 'Leads', 
    component: Leads, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/create-lead', 
    name: 'CreateLead', 
    component: CreateLead, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/my-leads', 
    name: 'AssignedLead', 
    component: AssignedLead, 
    meta: { requiresAuth: true, role: 'counselor' } 
  },
  { 
    path: '/applications', 
    name: 'Applications', 
    component: Applications, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  { 
    path: '/my-applications', 
    name: 'CounselorApplication', 
    component: CounselorApplication, 
    meta: { requiresAuth: true, role: 'counselor' } 
  },
  { 
    path: '/counselors', 
    name: 'Counselors', 
    component: Counselors, 
    meta: { requiresAuth: true, role: 'admin' } 
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
  } else if ( to.meta.requiresAuth && to.path === "/register") {
    next("/register");
  } else {
    next();
  }
});

export default router;
