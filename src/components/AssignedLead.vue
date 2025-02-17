<template>
    <div class="d-flex vh-100 bg-light">
      <SideBar />
      <div class="flex-grow-1 d-flex flex-column">
        <NavberMenu />
        <div class="container mt-4">
          <h2 class="mb-3">My Leads</h2>
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(lead, index) in leads" :key="lead.id">
                <td>{{ index + 1 }}</td>
                <td>{{ lead.name }}</td>
                <td>{{ lead.email }}</td>
                <td>{{ lead.phone }}</td>
                <td>
                  <span :class="statusClass(lead.status)">
                    {{ lead.status }}
                  </span>
                </td>
                <td>
                  <button  class="btn btn-primary btn-sm me-2"
                    @click="editLead(lead)">Change Status</button>
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
        leads: [],
      }
    },
    components: {
      SideBar,
      NavberMenu,
    },
    async mounted() {
      await this.fetchAssignLeads();
    },
    methods: {
      async fetchAssignLeads() {
        try {
          const response = await api.get('/counselor-leads', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.leads = response.data;
          this.leads = this.leads.data.leads;
          console.log(this.leads);
        } catch (error) {
          console.error('Error fetching leads:', error);
        }
      },
      statusClass(status) {
        return {
          'badge bg-primary': status === 'In Progress',
          'badge bg-warning': status === 'Bad Timing',
          'badge bg-danger': status === 'Not Interested',
          'badge bg-secondary': status === 'Not Qualified',
        };
      },
      editLead(lead) {
        console.log('Editing lead:', lead);
      }
    }
  
  }
  </script>
  <style scoped>
  .btn-primary{
    background-color: #243b79;
    border: #243b79;
  }
</style>