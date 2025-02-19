<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar />
        <div class="flex-grow-1 d-flex flex-column">
            <NavberMenu />
            <h4>Create New Lead</h4>
            <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
            <form @submit.prevent="submitLead" class="leadBox">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" v-model="lead.name" class="form-control" placeholder="Enter lead name" />
                    <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" v-model="lead.email" class="form-control" placeholder="Enter lead email" />
                    <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Phone</label>
                    <input type="text" v-model="lead.phone" class="form-control" placeholder="Enter lead phone" />
                    <div v-if="errors.phone" class="text-danger">{{ errors.phone[0] }}</div>
                </div>
                <button type="submit" class="btn btn-primary">Create Lead</button>
            </form>
            <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
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
            counselors: { data: { userlist: [] } },
            lead: {
                name: "",
                email: "",
                phone: "",
                // status: "",
                // counselor_id: '',
            },
            errors: {},
            errorMessage: "",
            successMessage: "",
        };
    },
    components: {
        SideBar,
        NavberMenu,
    },
    async mounted() {
        await this.fetchCounselor();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing. Redirecting to login.");
            this.$router.push('/login'); // Redirect user if not logged in
            return;
        }
    },
    methods: {
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
        async submitLead() {
            try {
                if (!this.lead.name || !this.lead.email) {
                    console.error("Please fill in all required fields.");
                    return;
                }

                 await api.post('/leads', this.lead, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                console.log('Lead created successfully');
                this.successMessage = "Lead created successfully!";
                this.lead = { name: "", email: "", phone: "" };
                this.errors = {};
                setTimeout(() => {
                    this.successMessage = "";
                }, 3000);
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.errors = error.response.data.errors; // Store validation errors
                } else {
                    this.errorMessage = error.response?.data?.message || 'Lead creation failed!';
                }
            }
        }
    }
};
</script>
<style scoped>
  .leadBox{
    background-color: #fff;
    padding: 30px 60px;
  }
</style>
