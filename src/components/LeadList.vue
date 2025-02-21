<template>
  <div class="d-flex vh-100 bg-light">
    <SideBar />
    <div class="flex-grow-1 d-flex flex-column">
      <NavberMenu />
      <div class="container mt-4">
        <h4 class="mb-3">Leads List</h4>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Assaigned to</th>
              <th>Action</th>
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
              <td>{{ lead.counselor?.name ?? 'Not Assigned' }}</td>
              <button class="btn btn-primary btn-sm me-2" @click="assaignLead(lead)"
                :disabled="!!lead.counselor?.name">Lead Assaign</button>
              <button class="btn btn-success btn-sm me-2" @click="editLead(lead)"
                :disabled="!!lead.counselor?.name">Edit</button>
              <button class="btn btn-danger btn-sm me-2" @click="deleteLead(lead.id)"
                >Delete</button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Assaign to counselor  Modal -->
  <div v-if="isAssaignModalOpen" class="modal show d-block" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Update lead Status</h5>
          <button type="button" class="btn-close" @click="isAssaignModalOpen = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAssainLead">
            <div class="mb-3">
              <!-- Assign Counselor Field -->
              <div class="mb-3">
                <label class="form-label">Assign Counselor</label>
                <select v-model="singleLead.counselor_id" class="form-control">
                  <option :value="null">Click to select counselor</option>
                  <option v-for="counselor in counselors?.data?.userlist" :key="counselor.id" :value="counselor.id">
                    {{ counselor.name }}
                  </option>
                </select>
                <!-- <div v-if="errors.counselor_id" class="text-danger">{{ errors.counselor_id[0] }}</div> -->
              </div>
            </div>
            <button type="submit" class="btn btn-success">Save Assaign</button>
            <button type="button" class="btn btn-secondary ms-2" @click="isAssaignModalOpen = false">Cancel</button>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit lead  Modal -->
  <div v-if="isEditModalOpen" class="modal show d-block" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit lead</h5>
          <button type="button" class="btn-close" @click="isEditModalOpen = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUpdate">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" v-model="updateLead.name" class="form-control" placeholder="Enter lead name" />
              <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" v-model="updateLead.email" class="form-control" placeholder="Enter lead email" />
              <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Phone</label>
              <input type="text" v-model="updateLead.phone" class="form-control" placeholder="Enter phone" />
              <div v-if="errors.phone" class="text-danger">{{ errors.phone[0] }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Select Status</label>
              <select v-model="updateLead.status" class="form-control">
                  <option value="">Select Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Bad Timing">Bad Timing</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Not Qualified">Not Qualified</option>
              </select>
            </div>
            <button type="submit" class="btn btn-success">Save Update</button>
            <button type="button" class="btn btn-secondary ms-2" @click="isEditModalOpen = false">Cancel</button>
          </form>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
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
      isAssaignModalOpen: false,
      isEditModalOpen: false,
      singleLead: {
        id: null,
        name: "",
        email: "",
        phone: "",
        status: "",
        counselor_id: ""
      },
      updateLead:{},
      counselors: { data: { userlist: [] } },
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
    await this.fetchLeads();
    await this.fetchCounselor();
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
    async fetchCounselor() {
      try {
        const response = await api.get('/counselor-list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.counselors = response.data;
        console.log(this.counselors);

      } catch (error) {
        console.error('Error fetching counselors:', error);
      }
    },
    assaignLead(lead) {
      this.singleLead = JSON.parse(JSON.stringify(lead));
      this.isAssaignModalOpen = true;
    },
    async saveAssainLead() {
      try {
        const index = this.leads.findIndex((l) => l.id === this.singleLead.id);
        if (index !== -1) {
          await api.put(`/leads/${this.singleLead.id}`, this.singleLead, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.leads[index] = { ...this.singleLead };
          this.isAssaignModalOpen = false;
          this.successMessage = "Lead assaigned successfully!";
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        }
        await this.fetchLeads();
      } catch (error) {
        console.error("Error updating lead:", error);
        alert("Failed to assaign lead. Please try again.");
      }
    },
    closeModal() {
      this.isAssaignModalOpen = false;
    },
    editLead(lead){
      this.updateLead = JSON.parse(JSON.stringify(lead));
      this.isEditModalOpen = true;
    },
    async saveUpdate() {
      try {
        const index = this.leads.findIndex((l) => l.id === this.updateLead.id);
        if (index !== -1) {
          await api.put(`/leads/${this.updateLead.id}`, this.updateLead, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          this.leads[index] = { ...this.updateLead };
          this.isEditModalOpen = false;
          this.successMessage = "Lead edited successfully!";
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        }
        await this.fetchLeads();
      } catch (error) {
        console.error("Error updating lead:", error);
        alert("Failed to edit lead. Please try again.");
      }
    },
    async deleteLead(leadId) {
      try {
        await api.delete(`/leads/${leadId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        console.log("Lead deleted successfully");
        this.successMessage = "Lead deleted successfully!";
          setTimeout(() => {
            this.successMessage = "";
          }, 3000);
        // Optionally remove the deleted lead from the local list
        this.leads = this.leads.filter(lead => lead.id !== leadId);

      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  }
}
</script>
<style scoped>
.btn-primary {
  background-color: #243b79;
  border: #243b79;
  color: #fff;
}
.btn-success{
  background: #198754;
  color: #fff;
}
.btn-danger{
    background: #ff0000bd;
    color: #fff;
}
</style>