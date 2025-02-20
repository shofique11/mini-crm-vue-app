<template>
  <div class="d-flex vh-100 bg-light">
    <!-- Sidebar -->

    <!-- <SideBar /> -->
    <!-- Main Content -->
    <div class="flex-grow-1 d-flex flex-column">
      <!-- Top Navbar -->
      <NavberMenu />
      <!-- Dashboard Stats -->
      <div class="container mt-4">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
              <div class="p-3 bg-primary text-white rounded-circle">
                <i class="fas fa-user"></i>
              </div>
              <div class="ms-3">
                <h5 class="mb-1">Total Leads</h5>
                <p class="h4 fw-bold">{{ stats.total_leads }}</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
              <div class="p-3 bg-success text-white rounded-circle">
                <i class="fas fa-users"></i>
              </div>
              <div class="ms-3">
                <h5 class="mb-1">Total Counselors</h5>
                <p class="h4 fw-bold">{{ stats.total_counselors }}</p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card shadow-sm p-3 d-flex flex-row align-items-center">
              <div class="p-3 bg-warning text-dark rounded-circle">
                <i class="fas fa-folder"></i>
              </div>
              <div class="ms-3">
                <h5 class="mb-1">Total Applications</h5>
                <p class="h4 fw-bold">{{ stats.total_applications }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import api from './axios'; // Axios instance
//import SideBar from './SideBar.vue';
import NavberMenu from './NavberMenu.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  data() {
    return {
      stats: {
        total_leads: 0,
        total_counselors: 0,
        total_applications: 0
      }
    };
  },
  components: {
    //SideBar,
    NavberMenu
  },
};
</script>

<style>
/* Icons */
i {
  font-size: 1.5rem;
}
</style>