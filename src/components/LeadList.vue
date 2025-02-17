<template>
  <div class="d-flex vh-100 bg-light">
    <SideBar />
    <div class="flex-grow-1 d-flex flex-column">
      <NavberMenu />
      <div class="container mt-4">
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
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
                <button class="btn btn-primary btn-sm me-2" @click="editLead(lead)">Edit</button>
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
          <h5 class="modal-title">Edit Lead</h5>
          <button type="button" class="btn-close" @click="isEditModalOpen = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLead">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="editedLead.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="editedLead.email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Phone</label>
              <input v-model="editedLead.phone" type="text" class="form-control" required />
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
      editedLead: {
        id: null,
        name: "",
        email: "",
        phone: "",
      },
      isEditModalOpen: false,
      successMessage: "",
    }
  },
  components: {
    SideBar,
    NavberMenu,
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
      this.editedLead = JSON.parse(JSON.stringify(lead));
      this.isEditModalOpen = true;
    },
    async saveLead() {
      try {
        const index = this.leads.findIndex((l) => l.id === this.editedLead.id);
        if (index !== -1) {
          await api.put(`/leads/${this.editedLead.id}`, this.editedLead, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.leads[index] = { ...this.editedLead };
          this.isEditModalOpen = false;
          this.successMessage = "Lead updated successfully!";
          setTimeout(() => {
                    this.successMessage = "";
                }, 3000);
        }
      } catch (error) {
        console.error("Error updating lead:", error);
        alert("Failed to update lead. Please try again.");
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