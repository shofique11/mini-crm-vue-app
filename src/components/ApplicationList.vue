<template>
    <div class="d-flex vh-100 bg-light">
      <SideBar />
      <div class="flex-grow-1 d-flex flex-column">
        <NavberMenu />
        <div class="container mt-4">
          <h4 class="mb-3">Application List</h4>
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Application Status</th>
                <th>Counselor</th>
                <th>Lead Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(application, index) in applications" :key="application.id">
                <td>{{ index + 1 }}</td>
                <td>{{ application.lead.name }}</td>
                <td>{{ application.lead.email }}</td>
                <td>{{ application.lead.phone }}</td>
                <td>
                  <span :class="statusClass(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td>{{ application.counselor.name }}</td>
                <td>
                  <span :class="statusLeadClass(application.lead.status)">
                    {{ application.lead.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  <script>
  import api from './axios';
  import SideBar from './SideBar.vue';
  import NavberMenu from './NavberMenu.vue';
  export default {
    data() {
      return {
        applications: [],
      }
    },
    components: {
      SideBar,
      NavberMenu
    },
    async mounted() {
      await this.fetchApplication();
    },
    methods: {
      async fetchApplication() {
        try {
          const response = await api.get('/applications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.applications = response.data;
          this.applications = this.applications.data.applications;
          console.log(this.applications);
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      },
      statusClass(status) {
        return {
          'badge bg-primary': status === 'In Progress',
          'badge bg-danger': status === 'Rejected',
          'badge bg-secondary': status === 'Approved',
        };
      },
      statusLeadClass(status) {
      return {
        'badge bg-primary': status === 'In Progress',
        'badge bg-warning': status === 'Bad Timing',
        'badge bg-danger': status === 'Not Interested',
        'badge bg-secondary': status === 'Not Qualified',
      };
    },
    }
  
  }
  </script>
  <style></style>