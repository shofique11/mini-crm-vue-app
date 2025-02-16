<template>
  <div class="d-flex vh-100 bg-light">
    <SideBar />
    <div class="flex-grow-1 d-flex flex-column">
      <NavberMenu />
      <div class="container mt-4">
        <h2 class="mb-3">Leads List</h2>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Counselor</th>
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
              <td>{{ lead.counselor.name }}</td>
              <td>
                <button  class="btn btn-primary btn-sm me-2"
                  @click="editLead(lead)">Edit</button>
                <button  class="btn btn-danger btn-sm"
                  @click="deleteLead(lead.id)">Delete</button>
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
    NavberMenu
  },
  async mounted() {
    await this.fetchLeads();
  },
  methods: {
    async fetchLeads() {
      try {
        const response = await api.get('/leads', {
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
      // Handle lead editing logic
      console.log('Editing lead:', lead);
    },
    deleteLead(leadId) {
      if (confirm('Are you sure you want to delete this lead?')) {
        // API call to delete lead
        console.log('Deleting lead with ID:', leadId);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }

}
</script>
<style></style>