<template>
    <aside class="bg-primary text-white p-4 d-flex flex-column" style="width: 250px;">
        <h1 class="h4 fw-bold">Mini CRM</h1>
        <nav class="mt-4">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/dashboard"
                        class="nav-link text-white bg-opacity-10 rounded py-2 px-3">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/create-lead"
                        class="nav-link text-white bg-opacity-10 rounded py-2 px-3" v-if="isAdmin">Create Leads</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/leads"
                        class="nav-link text-white bg-opacity-10 rounded py-2 px-3">Leads</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/applications"
                        class="nav-link text-white bg-opacity-10 rounded py-2 px-3">Applications</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/counselors"
                        class="nav-link text-white bg-opacity-10 rounded py-2 px-3" v-if="isAdmin">Counselors</router-link>
                </li>
            </ul>
        </nav>
        <button @click="logout" class="btn btn-danger mt-auto w-100">Logout</button>
    </aside>
</template>
<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    data() {
        return {
            userRole: null,
        }
    },
    computed: {
        isAdmin() {
            return this.userRole === "admin";
        }
    },
    mounted(){
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        this.userRole = userInfo ? userInfo.role : null;
    },
    methods: {
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
        }
    }
}
</script>
<style scoped>
.bg-primary{
    background-color: #243b79e3 !important;
}
</style>