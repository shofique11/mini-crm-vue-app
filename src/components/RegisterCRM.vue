<template>
    <div class="d-flex vh-100 bg-light">
        <SideBar />
        <div class="flex-grow-1 d-flex flex-column">
            <NavberMenu />
            <h4>By default create counselor account</h4>
            <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
            <form @submit.prevent="registerAccount">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" v-model="name" class="form-control" placeholder="Enter name" />
                    <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" v-model="email" class="form-control" placeholder="Enter email" />
                    <div v-if="errors.email" class="text-danger">{{ errors.email[0] }}</div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" v-model="password" class="form-control" placeholder="Enter Password" />
                    <div v-if="errors.phone" class="text-danger">{{ errors.phone[0] }}</div>
                </div>
                <button type="submit" class="btn btn-primary">Create Account</button>
            </form>
            <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            user: {
                name: "",
                email: "",
                password: "",
                role: "",
            },
            errors: {},
            errorMessage: "",
            successMessage: "",
        };
    },
}
</script>