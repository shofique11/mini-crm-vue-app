<template>
  <nav class="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center">
    <h2 class="h5 fw-bold mb-0">Dashboard</h2>
    <span class="text-muted">Welcome, {{ user.name }}!</span>
  </nav>
</template>

<script>
import api from './axios';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  data() {
    return {
      user: {},
      leads: 0,
    }
  },
  async mounted() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const response = await api.get('/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.user = response.data;
        console.log(this.user);
      } catch (error) {
        console.error('Error fetching user:', error);
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