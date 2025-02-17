<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar />
        <div class="flex-grow-1 d-flex flex-column">
            <div class="container mt-4">
                <div><img alt="Vue logo" src="../assets/logo.png" width="250px"></div>
                <h4>By default create counselor account</h4>
                <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                <form @submit.prevent="registerAccount">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" v-model="user.name" class="form-control" placeholder="Enter name" />
                        <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" v-model="user.email" class="form-control" placeholder="Enter email" />
                        <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" v-model="user.password" class="form-control"
                            placeholder="Enter Password" />
                        <div v-if="errors.phone" class="text-danger">{{ errors.phone[0] }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Account</button>
                </form>
                <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
                <p><router-link to="/login" class="nav-link  bg-opacity-10 rounded py-2 px-3">Login here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import api from './axios';
export default {
    data() {
        return {
            user: {
                name: "",
                email: "",
                password: "",
                role: "counselor"
            },
            errors: {},
            errorMessage: ""
        };
    },
    methods: {
        async registerAccount() {
            try {
                if (!this.user.name || !this.user.email || !this.user.password) {
                    console.error("Please fill in all required fields.");
                    return;
                }
                await api.post('/register', this.user);
                console.log('Account created successfully');
                this.successMessage = "Account created successfully";
                this.$router.push('/login');
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    this.errors = error.response.data.errors; // Store validation errors
                } else {
                    this.errorMessage = error.response?.data?.message || 'Account created failed!';
                }
            }
        }
    }
}
</script>