<template>
  <div class="d-flex vh-100 bg-light">
    <SideBar />
    <div class="flex-grow-1 d-flex flex-column">
      <NavberMenu />
      <div class="container mt-4">
        <h2 class="mb-3">My Leads</h2>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
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
                <button class="btn btn-success btn-sm me-2" @click="createApplication(lead)">Move
                  Application</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Edit Lead Modal -->
  <div v-if="isEditModalOpen" class="modal show d-block" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Move Application</h5>
          <button type="button" class="btn-close" @click="isEditModalOpen = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveApplication">
            <div class="mb-3">
              <label class="form-label">Select Status</label>
              <select v-model="editedLead.status" class="form-control">
                <option value="In Progress">In Progress</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-success">Save Changes</button>
            <button type="button" class="btn btn-secondary ms-2" @click="isEditModalOpen = false">Cancel</button>
          </form>
        </div>
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
      isEditModalOpen: false,
      applicationLead: {
        lead_id: null,
        counselor_id: null,
        status: "In Progress",
      },
      errors: {},
      errorMessage: "",
      successMessage: "",
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
    createApplication(lead) {
      this.editedLead = JSON.parse(JSON.stringify(lead));
      this.isEditModalOpen = true;
    },
    async saveApplication() {
      try {
        if (!this.editedLead.id || !this.editedLead.counselor_id) {
          console.error("Please fill in all required fields.");
          this.errorMessage = "Please fill in all required fields.";
          return;
        }
        this.applicationLead = {
          lead_id: this.editedLead.id,
          counselor_id: this.editedLead.counselor_id,
          status: this.editedLead.status
        };
        await api.post("/applications", this.applicationLead, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.successMessage = "Application created successfully!";
        this.errors = {};
        this.isEditModalOpen = false;
        this.editedLead = { id: null, counselor_id: null, status: "" };
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
        await this.fetchAssignLeads();

      } catch (error) {
        if (error.response) {
          if (error.response.data.errors) {
            this.errors = error.response.data.errors; 
          } else {
            this.errorMessage = error.response.data.message || "Application creation failed!";
          }
        } else {
          this.errorMessage = "An unexpected error occurred. Please try again.";
        }
        console.error("API Error:", error);
      }
    },
    closeModal() {
      this.isEditModalOpen = false;
    }
  }

}
</script>
<style scoped>
.btn-primary {
  background-color: #243b79;
  border: #243b79;
}
</style>