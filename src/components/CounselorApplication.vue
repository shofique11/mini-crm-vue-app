<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar2 />
        <div class="flex-grow-1 d-flex flex-column">
            <NavberMenu />
            <div class="container mt-4">
                <h4 class="mb-3">Application List</h4>
                <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                <table class="table table-striped table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Application Status</th>
                            <th>Lead Status</th>
                            <th>Change lead Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(applicationView, index) in myApplicationList" :key="applicationView.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ applicationView.lead.name }}</td>
                            <td>{{ applicationView.lead.email }}</td>
                            <td>{{ applicationView.lead.phone }}</td>
                            <td>
                                <span :class="statusClass(applicationView.status)">
                                    {{ applicationView.status }}
                                </span>
                            </td>
                            <td>
                                <span :class="statusLeadClass(applicationView.lead.status)">
                                    {{ applicationView.lead.status }}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2"
                                    @click="openStatusModal([applicationView.lead.id, applicationView.lead.status])">Update
                                    Status</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Status change  Modal -->
    <div v-if="isStatusModalOpen" class="modal show d-block" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Lead Status</h5>
                    <button type="button" class="btn-close" @click="isStatusModalOpen = false"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveStatus">
                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select v-model="updateStatusLead.status" class="form-control">
                                <option value="">Select Status</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Bad Timing">Bad Timing</option>
                                <option value="Not Interested">Not Interested</option>
                                <option value="Not Qualified">Not Qualified</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-success">Save Status</button>
                        <button type="button" class="btn btn-secondary ms-2"
                            @click="isStatusModalOpen = false">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from './axios';
import SideBar2 from './SideBar2.vue';
import NavberMenu from './NavberMenu.vue';
export default {
    data() {
        return {
            myApplicationList: [],
            updateStatusLead: {
                id: null,
                status: "",
            },
            isStatusModalOpen: false,
            errors: {},
            errorMessage: "",
            successMessage: "",
        }
    },
    components: {
        SideBar2,
        NavberMenu
    },
    async mounted() {
        await this.fetchCounselorApplication();
        // await this.fetchSingleLead();
    },
    methods: {
        async fetchCounselorApplication() {
            try {
                const response = await api.get('/my-applications', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.myApplicationList = response.data;
                this.myApplicationList = this.myApplicationList.data.user_applications;
                console.log(this.myApplicationList);
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
        openStatusModal(lead) {
            this.updateStatusLead = { id: lead[0], status: lead[1] || "" };
            console.log(this.updateStatusLead);
            this.isStatusModalOpen = true;
        },
        async saveStatus() {
            if (!this.updateStatusLead.id || !this.updateStatusLead.status) {
                this.errorMessage = "Please select a status.";
                return;
            }
            try {
                await api.put(`/leads/${this.updateStatusLead.id}/status`, { status: this.updateStatusLead.status }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.successMessage = "Lead status updated successfully!";
                this.isStatusModalOpen = false;
                setTimeout(() => {
                    this.successMessage = "";
                }, 3000);
                // Refresh lead list (optional)
                await this.fetchCounselorApplication();
            } catch (error) {
                console.error("Error updating status:", error);
                this.errorMessage = error.response?.data?.message || "Failed to update lead status.";
            }
        },
        closeModal() {
            this.isEditModalOpen = false;
        }
    }
}
</script>
<style></style>